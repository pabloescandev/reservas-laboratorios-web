import { useState } from 'react';
import { SolicitudReservaItem } from './SolicitudReservaItem';
import './GestionReservas.css';

export function GestionReservas() {
    const [filtroEstado, setFiltroEstado] = useState('Todas');

    const [solicitudes, setSolicitudes] = useState([
        {
            id: '01',
            solicitante: 'Doc. Luis Enrique',
            laboratorio: 'Lab. de Redes y Telemática',
            fecha: '2026-11-28',
            motivo: 'Práctica de configuración de routers y VLANs con 25 estudiantes.',
            estado: 'Pendiente',
            mensajeRespuesta: '',
        },
        {
            id: '02',
            solicitante: 'Est. Diego Forlán',
            laboratorio: 'Lab. de Electrónica Digital',
            fecha: '2026-11-29',
            motivo: 'Uso de osciloscopio para proyecto final de circuitos.',
            estado: 'Pendiente',
            mensajeRespuesta: '',
        },
        {
            id: '03',
            solicitante: 'Doc. Pep Guardiola',
            laboratorio: 'Lab. de Cómputo 1',
            fecha: '2026-11-25',
            motivo: 'Evaluación práctica de bases de datos.',
            estado: 'Aprobado',
            mensajeRespuesta: 'Aprobado. El laboratorio estará listo desde las 08:45.',
        },
    ]);

    function handleResponderSolicitud(idReserva, nuevoEstado, mensajeRespuesta) {
        // Actualiza en pantalla y deja el objeto listo para enviar al backend
        setSolicitudes((prev) =>
            prev.map((sol) =>
                sol.id === idReserva
                    ? { ...sol, estado: nuevoEstado, mensajeRespuesta }
                    : sol
            )
        );

        console.log('Actualizar en BD:', {
            id: idReserva,
            estado: nuevoEstado,
            mensajeRespuesta,
        });
    }

    const solicitudesFiltradas =
        filtroEstado === 'Todas'
            ? solicitudes
            : solicitudes.filter((sol) => sol.estado === filtroEstado);

    return (
        <div className="contenedor-gestion-reservas">
            <div className="tarjeta-encabezado-reservas">
                <h2 className="titulo-gestion-reservas">Solicitudes de reserva</h2>

                <div className="filtros-reservas">
                    {['Todas', 'Pendiente', 'Aprobado', 'Denegado'].map((estado) => (
                        <button
                            key={estado}
                            type="button"
                            className={`boton-filtro ${filtroEstado === estado ? 'activo' : ''
                                }`}
                            onClick={() => setFiltroEstado(estado)}
                        >
                            {estado}
                        </button>
                    ))}
                </div>
            </div>

            <div className="lista-solicitudes">
                {solicitudesFiltradas.map((solicitud) => (
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