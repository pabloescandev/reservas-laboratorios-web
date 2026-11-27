import { useEffect, useState } from 'react';
import { listarEquiposDeLaboratorio, listarLaboratorios } from '../../services/laboratorioService';
import { obtenerDisponibilidad, reservarPuesto } from '../../services/reservaService';
import { HistorialReservas } from '../laboratorio/HistorialReservas';
import './ReservaEquipo.css';

function fechaLocalHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export function ReservaEquipo() {
    const [laboratorios, setLaboratorios] = useState([]);
    const [labId, setLabId] = useState('');
    const [equipos, setEquipos] = useState([]);
    const [fecha, setFecha] = useState('');
    const [franjas, setFranjas] = useState([]);
    const [horId, setHorId] = useState('');
    const [equipoId, setEquipoId] = useState('');
    const [motivo, setMotivo] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');
    const [versionHistorial, setVersionHistorial] = useState(0);

    useEffect(() => {
        listarLaboratorios()
            .then(setLaboratorios)
            .catch((err) => setError(err.message));
    }, []);

    useEffect(() => {
        setEquipos([]);
        setEquipoId('');
        if (!labId) return;
        listarEquiposDeLaboratorio(labId)
            .then(setEquipos)
            .catch(() => setEquipos([]));
    }, [labId]);

    useEffect(() => {
        setHorId('');
        setFranjas([]);
        if (!labId || !fecha) return;

        obtenerDisponibilidad(labId, fecha)
            .then((datos) => {
                const dia = datos.dias.find((d) => d.fecha === fecha);
                const disponibles = (dia?.franjas || []).filter(
                    (f) => !f.pasada && f.estado === 'libre' && f.cupos.disponibles > 0
                );
                setFranjas(disponibles);
            })
            .catch((err) => setError(err.message));
    }, [labId, fecha, versionHistorial]);

    const franjaElegida = franjas.find((f) => String(f.hor_id) === horId);
    const equiposDisponibles = equipos.filter(
        (equipo) => equipo.equ_estado === 'O' && !(franjaElegida?.equiposReservados || []).includes(equipo.equ_id)
    );

    async function handleReservar(e) {
        e.preventDefault();
        setEnviando(true);
        setError('');
        setExito('');
        try {
            await reservarPuesto({
                horId: Number(horId),
                fecha,
                equId: equipoId ? Number(equipoId) : undefined,
                motivo,
            });
            setExito(equipoId ? 'Equipo reservado.' : 'Puesto reservado.');
            setHorId('');
            setEquipoId('');
            setMotivo('');
            setVersionHistorial((v) => v + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="contenedor-estudiante">
            {/* 1. Formulario para reservar puesto o equipo */}
            <form className="tarjeta-reserva" onSubmit={handleReservar}>
                <h2 className="titulo-seccion">Reservar puesto o equipo</h2>

                <div className="fila-campos">
                    <div className="grupo-campo">
                        <label className="etiqueta-campo" htmlFor="laboratorio">
                            Laboratorio:
                        </label>
                        <select
                            id="laboratorio"
                            className="selector-dato"
                            value={labId}
                            onChange={(e) => setLabId(e.target.value)}
                            required
                        >
                            <option value="">Selecciona un laboratorio</option>
                            {laboratorios.map((lab) => (
                                <option key={lab.lab_id} value={lab.lab_id} disabled={lab.lab_estado === 'M'}>
                                    {lab.lab_nombre}
                                    {lab.lab_estado === 'M' ? ' — en mantenimiento' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grupo-campo">
                        <label className="etiqueta-campo" htmlFor="fecha-reserva">
                            Fecha:
                        </label>
                        <input
                            id="fecha-reserva"
                            type="date"
                            className="entrada-dato"
                            min={fechaLocalHoy()}
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="fila-campos">
                    <div className="grupo-campo">
                        <label className="etiqueta-campo" htmlFor="horario-reserva">
                            Franja horaria:
                        </label>
                        <select
                            id="horario-reserva"
                            className="selector-dato"
                            value={horId}
                            onChange={(e) => {
                                setHorId(e.target.value);
                                setEquipoId('');
                            }}
                            disabled={franjas.length === 0}
                            required
                        >
                            <option value="">
                                {!labId || !fecha
                                    ? 'Elige laboratorio y fecha'
                                    : franjas.length === 0
                                    ? 'No hay franjas disponibles'
                                    : 'Selecciona una franja'}
                            </option>
                            {franjas.map((franja) => (
                                <option key={franja.hor_id} value={franja.hor_id}>
                                    {franja.entrada} – {franja.salida} ({franja.cupos.disponibles} cupos)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grupo-campo">
                        <label className="etiqueta-campo" htmlFor="equipo">
                            Puesto o equipo:
                        </label>
                        <select
                            id="equipo"
                            className="selector-dato"
                            value={equipoId}
                            onChange={(e) => setEquipoId(e.target.value)}
                            disabled={!horId}
                        >
                            <option value="">Solo un puesto</option>
                            {equiposDisponibles.map((equipo) => (
                                <option key={equipo.equ_id} value={equipo.equ_id}>
                                    {equipo.equ_codigo} · {equipo.equ_tipo}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grupo-campo">
                    <label className="etiqueta-campo" htmlFor="motivo-reserva">
                        Motivo (opcional):
                    </label>
                    <input
                        id="motivo-reserva"
                        className="entrada-dato"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        maxLength={300}
                    />
                </div>

                {error && (
                    <p className="mensaje-estudiante mensaje-estudiante-error" role="alert">
                        {error}
                    </p>
                )}
                {exito && (
                    <p className="mensaje-estudiante mensaje-estudiante-exito" role="status">
                        {exito}
                    </p>
                )}

                <button type="submit" className="boton-reservar" disabled={enviando}>
                    {enviando ? 'Reservando…' : 'Confirmar reserva'}
                </button>
            </form>

            {/* 2. Historial con las reservas del estudiante */}
            <HistorialReservas
                titulo="Mis reservas"
                rol="E"
                version={versionHistorial}
                onCambio={() => setVersionHistorial((v) => v + 1)}
            />
        </div>
    );
}
