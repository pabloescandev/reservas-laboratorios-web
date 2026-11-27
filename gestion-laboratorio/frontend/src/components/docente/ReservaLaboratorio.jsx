import { useCallback, useEffect, useState } from 'react';
import { listarLaboratorios } from '../../services/laboratorioService';
import {
    ESTADOS_RESERVA,
    cancelarReserva,
    listarReservas,
    obtenerDisponibilidad,
    solicitarLaboratorio,
} from '../../services/reservaService';
import './ReservaLaboratorio.css';

function fechaLocalHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}

const CLASES_ESTADO = {
    A: 'badge-estado estado-aprobada',
    R: 'badge-estado estado-rechazada',
    C: 'badge-estado estado-cancelada',
    F: 'badge-estado estado-finalizada',
    P: 'badge-estado estado-pendiente',
};

export function ReservaLaboratorio() {
    const fechaMinimaHoy = fechaLocalHoy();

    const [laboratorios, setLaboratorios] = useState([]);
    const [labId, setLabId] = useState('');
    const [fecha, setFecha] = useState('');
    const [franjas, setFranjas] = useState([]);
    const [horId, setHorId] = useState('');
    const [asignatura, setAsignatura] = useState('');
    const [motivo, setMotivo] = useState('');
    const [solicitudes, setSolicitudes] = useState([]);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarSolicitudes = useCallback(() => {
        listarReservas()
            .then(setSolicitudes)
            .catch((err) => setError(err.message));
    }, []);

    useEffect(() => {
        listarLaboratorios()
            .then(setLaboratorios)
            .catch((err) => setError(err.message));
        cargarSolicitudes();
    }, [cargarSolicitudes]);

    useEffect(() => {
        setHorId('');
        setFranjas([]);
        if (!labId || !fecha) return;

        obtenerDisponibilidad(labId, fecha)
            .then((datos) => {
                const dia = datos.dias.find((d) => d.fecha === fecha);
                const disponibles = (dia?.franjas || []).filter(
                    (f) => !f.pasada && f.estado !== 'bloqueada' && !f.laboratorioAprobado
                );
                setFranjas(disponibles);
            })
            .catch((err) => setError(err.message));
    }, [labId, fecha]);

    async function handleCrearReserva(e) {
        e.preventDefault();
        setEnviando(true);
        setError('');
        setExito('');
        try {
            await solicitarLaboratorio({ horId: Number(horId), fecha, asignatura, motivo });
            setExito('Solicitud enviada. Queda pendiente hasta que el administrador la revise.');
            setHorId('');
            setAsignatura('');
            setMotivo('');
            setFecha('');
            cargarSolicitudes();
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    }

    async function handleCancelar(resId) {
        setError('');
        setExito('');
        try {
            await cancelarReserva(resId);
            setExito('Solicitud cancelada.');
            cargarSolicitudes();
        } catch (err) {
            setError(err.message);
        }
    }

    const sinFranjas = labId && fecha && franjas.length === 0;

    return (
        <div className="contenedor-reservas">
            {/* 1. Formulario para solicitar reserva de laboratorio */}
            <form className="tarjeta-solicitud" onSubmit={handleCrearReserva}>
                <h2 className="titulo-tarjeta">Reservar laboratorio</h2>

                <div className="fila-doble-reserva">
                    <div className="campo-reserva">
                        <label className="etiqueta-reserva" htmlFor="laboratorio">
                            Laboratorio:
                        </label>
                        <select
                            id="laboratorio"
                            className="selector-reserva"
                            value={labId}
                            onChange={(e) => setLabId(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un laboratorio</option>
                            {laboratorios.map((lab) => (
                                <option key={lab.lab_id} value={lab.lab_id} disabled={lab.lab_estado === 'M'}>
                                    {lab.lab_nombre} (Aforo: {lab.lab_aforo})
                                    {lab.lab_estado === 'M' ? ' — en mantenimiento' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-reserva">
                        <label className="etiqueta-reserva" htmlFor="fecha">
                            Fecha de reserva:
                        </label>
                        <input
                            id="fecha"
                            type="date"
                            className="entrada-reserva"
                            min={fechaMinimaHoy}
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="fila-doble-reserva">
                    <div className="campo-reserva">
                        <label className="etiqueta-reserva" htmlFor="franja">
                            Franja horaria:
                        </label>
                        <select
                            id="franja"
                            className="selector-reserva"
                            value={horId}
                            onChange={(e) => setHorId(e.target.value)}
                            disabled={!labId || !fecha || franjas.length === 0}
                            required
                        >
                            <option value="">
                                {!labId || !fecha ? 'Elige laboratorio y fecha' : 'Selecciona una franja'}
                            </option>
                            {franjas.map((franja) => (
                                <option key={franja.hor_id} value={franja.hor_id}>
                                    {franja.entrada} – {franja.salida}
                                    {franja.cupos.ocupados > 0 ? ` (${franja.cupos.ocupados} estudiantes ya reservados)` : ''}
                                </option>
                            ))}
                        </select>
                        {sinFranjas && (
                            <span className="ayuda-reserva">No hay franjas disponibles ese día.</span>
                        )}
                    </div>

                    <div className="campo-reserva">
                        <label className="etiqueta-reserva" htmlFor="asignatura">
                            Asignatura:
                        </label>
                        <input
                            id="asignatura"
                            className="entrada-reserva"
                            value={asignatura}
                            onChange={(e) => setAsignatura(e.target.value)}
                            maxLength={100}
                            required
                        />
                    </div>
                </div>

                <div className="campo-reserva">
                    <label className="etiqueta-reserva" htmlFor="motivo">
                        Motivo de la reserva:
                    </label>
                    <textarea
                        id="motivo"
                        className="area-motivo"
                        minLength={3}
                        maxLength={300}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        required
                        placeholder="Describe la práctica o actividad académica (mínimo 3 caracteres)"
                    />
                </div>

                {error && (
                    <p className="mensaje-reserva mensaje-reserva-error" role="alert">
                        {error}
                    </p>
                )}
                {exito && (
                    <p className="mensaje-reserva mensaje-reserva-exito" role="status">
                        {exito}
                    </p>
                )}

                <button type="submit" className="boton-solicitar" disabled={enviando}>
                    {enviando ? 'Enviando…' : 'Enviar solicitud'}
                </button>
            </form>

            {/* 2. Tabla de seguimiento con estado y mensaje de respuesta */}
            <section className="tarjeta-historial">
                <h2 className="titulo-tarjeta">Mis solicitudes de laboratorio</h2>

                {solicitudes.length === 0 ? (
                    <p className="ayuda-reserva">Todavía no tienes solicitudes.</p>
                ) : (
                    <table className="tabla-solicitudes">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Laboratorio</th>
                                <th>Fecha</th>
                                <th>Franja</th>
                                <th>Asignatura</th>
                                <th>Motivo</th>
                                <th>Estado</th>
                                <th>Mensaje de respuesta</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {solicitudes.map((reserva) => (
                                <tr key={reserva.res_id}>
                                    <td>{reserva.res_id}</td>
                                    <td>{reserva.lab_nombre}</td>
                                    <td>{reserva.res_fecha}</td>
                                    <td>
                                        {reserva.hor_entrada} – {reserva.hor_salida}
                                    </td>
                                    <td>{reserva.res_asignatura}</td>
                                    <td>{reserva.res_motivo}</td>
                                    <td>
                                        <span className={CLASES_ESTADO[reserva.res_estado]}>
                                            {ESTADOS_RESERVA[reserva.res_estado]}
                                        </span>
                                    </td>
                                    <td>{reserva.res_mensaje_respuesta || '—'}</td>
                                    <td>
                                        {['P', 'A'].includes(reserva.res_estado) && (
                                            <button
                                                type="button"
                                                className="boton-cancelar-solicitud"
                                                onClick={() => handleCancelar(reserva.res_id)}
                                            >
                                                Cancelar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
