import { useCallback, useEffect, useState } from 'react';
import { SolicitudReservaItem } from './SolicitudReservaItem';
import { ESTADOS_RESERVA, listarReservas, responderSolicitud } from '../../services/reservaService';
import './GestionReservas.css';

const FILTROS = [
    { codigo: '', texto: 'Todas' },
    { codigo: 'P', texto: 'Pendiente' },
    { codigo: 'A', texto: 'Aprobada' },
    { codigo: 'R', texto: 'Rechazada' },
];

function aSolicitud(reserva) {
    return {
        id: reserva.res_id,
        solicitante: `${reserva.usu_nombres} ${reserva.usu_apellidos}`,
        laboratorio: reserva.lab_nombre,
        fecha: reserva.res_fecha,
        franja: `${reserva.hor_entrada} – ${reserva.hor_salida}`,
        asignatura: reserva.res_asignatura,
        motivo: reserva.res_motivo,
        codigoEstado: reserva.res_estado,
        estado: ESTADOS_RESERVA[reserva.res_estado],
        mensajeRespuesta: reserva.res_mensaje_respuesta || '',
    };
}

export function GestionReservas() {
    const [filtroEstado, setFiltroEstado] = useState('P');
    const [solicitudes, setSolicitudes] = useState([]);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    const cargarSolicitudes = useCallback(() => {
        listarReservas({ estado: filtroEstado })
            .then((reservas) => setSolicitudes(reservas.filter((r) => r.res_tipo === 'L').map(aSolicitud)))
            .catch((err) => setError(err.message));
    }, [filtroEstado]);

    useEffect(() => {
        cargarSolicitudes();
    }, [cargarSolicitudes]);

    async function handleResponderSolicitud(idReserva, decision, mensajeRespuesta) {
        setError('');
        setExito('');
        try {
            await responderSolicitud(idReserva, decision, mensajeRespuesta);
            setExito(`Solicitud #${idReserva} ${decision === 'A' ? 'aprobada' : 'rechazada'}.`);
            cargarSolicitudes();
        } catch (err) {
            setError(`Solicitud #${idReserva}: ${err.message}`);
        }
    }

    return (
        <div className="contenedor-gestion-reservas">
            <div className="tarjeta-encabezado-reservas">
                <h2 className="titulo-gestion-reservas">Solicitudes de reserva</h2>

                <div className="filtros-reservas">
                    {FILTROS.map((filtro) => (
                        <button
                            key={filtro.texto}
                            type="button"
                            className={`boton-filtro ${filtroEstado === filtro.codigo ? 'activo' : ''}`}
                            onClick={() => setFiltroEstado(filtro.codigo)}
                        >
                            {filtro.texto}
                        </button>
                    ))}
                </div>
            </div>

            {error && (
                <p className="mensaje-gestion mensaje-gestion-error" role="alert">
                    {error}
                </p>
            )}
            {exito && (
                <p className="mensaje-gestion mensaje-gestion-exito" role="status">
                    {exito}
                </p>
            )}

            <div className="lista-solicitudes">
                {solicitudes.length === 0 && <p className="respuesta-registrada">No hay solicitudes en este estado.</p>}
                {solicitudes.map((solicitud) => (
                    <SolicitudReservaItem
                        key={solicitud.id}
                        solicitud={solicitud}
                        onResponder={handleResponderSolicitud}
                    />
                ))}
            </div>
        </div>
    );
}
