import { useCallback, useEffect, useState } from 'react';
import { ESTADOS_RESERVA, TIPOS_RESERVA, cancelarReserva, listarReservas } from '../../services/reservaService';
import './HistorialReservas.css';

function ahoraTexto() {
    const ahora = new Date();
    const dos = (n) => String(n).padStart(2, '0');
    return `${ahora.getFullYear()}-${dos(ahora.getMonth() + 1)}-${dos(ahora.getDate())} ${dos(ahora.getHours())}:${dos(ahora.getMinutes())}`;
}

function sePuedeCancelar(reserva) {
    return ['P', 'A'].includes(reserva.res_estado) && `${reserva.res_fecha} ${reserva.hor_entrada}` > ahoraTexto();
}

function detalleReserva(reserva) {
    if (reserva.res_tipo === 'E') return reserva.equ_codigo;
    if (reserva.res_tipo === 'L') return reserva.res_asignatura;
    return reserva.res_motivo || '—';
}

export function HistorialReservas({ titulo, labId, rol, version = 0, onCambio }) {
    const [reservas, setReservas] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const esAdmin = rol === 'A';

    const cargar = useCallback(() => {
        listarReservas({ labId, estado: filtroEstado })
            .then(setReservas)
            .catch((err) => setError(err.message));
    }, [labId, filtroEstado]);

    useEffect(() => {
        cargar();
    }, [cargar, version]);

    async function handleCancelar(resId) {
        setError('');
        setExito('');
        try {
            await cancelarReserva(resId);
            setExito(`Reserva #${resId} cancelada.`);
            cargar();
            onCambio?.();
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <section className="tarjeta-historial-reservas">
            <div className="cabecera-historial">
                <h2 className="titulo-historial">{titulo}</h2>
                <label className="filtro-historial">
                    <span>Estado</span>
                    <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="">Todos</option>
                        {Object.entries(ESTADOS_RESERVA).map(([codigo, texto]) => (
                            <option key={codigo} value={codigo}>
                                {texto}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            {error && (
                <p className="mensaje-historial mensaje-historial-error" role="alert">
                    {error}
                </p>
            )}
            {exito && (
                <p className="mensaje-historial mensaje-historial-exito" role="status">
                    {exito}
                </p>
            )}

            {reservas.length === 0 ? (
                <p className="vacio-historial">No hay reservas para mostrar.</p>
            ) : (
                <div className="contenedor-tabla-historial">
                    <table className="tabla-historial">
                        <thead>
                            <tr>
                                <th>ID</th>
                                {esAdmin && <th>Usuario</th>}
                                {!labId && <th>Laboratorio</th>}
                                <th>Tipo</th>
                                <th>Fecha</th>
                                <th>Franja</th>
                                <th>Detalle</th>
                                <th>Estado</th>
                                <th>Respuesta</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((reserva) => (
                                <tr key={reserva.res_id}>
                                    <td>{reserva.res_id}</td>
                                    {esAdmin && (
                                        <td>
                                            {reserva.usu_nombres} {reserva.usu_apellidos}
                                        </td>
                                    )}
                                    {!labId && <td>{reserva.lab_nombre}</td>}
                                    <td>{TIPOS_RESERVA[reserva.res_tipo]}</td>
                                    <td>{reserva.res_fecha}</td>
                                    <td>
                                        {reserva.hor_entrada} – {reserva.hor_salida}
                                    </td>
                                    <td>{detalleReserva(reserva)}</td>
                                    <td>
                                        <span className={`insignia-estado insignia-estado-${reserva.res_estado}`}>
                                            {ESTADOS_RESERVA[reserva.res_estado]}
                                        </span>
                                    </td>
                                    <td>{reserva.res_mensaje_respuesta || '—'}</td>
                                    <td>
                                        {sePuedeCancelar(reserva) && (
                                            <button
                                                type="button"
                                                className="boton-cancelar-historial"
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
                </div>
            )}
        </section>
    );
}
