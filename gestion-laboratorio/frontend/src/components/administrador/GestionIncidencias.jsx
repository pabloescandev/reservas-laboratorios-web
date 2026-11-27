import { useState } from 'react';
import { IncidenciaItem } from './IncidenciaItem';
import './GestionIncidencias.css';

export function GestionIncidencias() {
    const [filtroEstado, setFiltroEstado] = useState('Todas');

    const [incidencias, setIncidencias] = useState([
        {
            id: '01',
            codigoEquipo: 'EQ-PC01',
            laboratorio: 'Lab. de Redes y Telemática',
            reportadoPor: 'Est. Diego Forlán',
            descripcion: 'El monitor parpadea y el puerto HDMI no da señal de video.',
            prioridad: 3,
            estado: 'Pendiente',
        },
        {
            id: '02',
            codigoEquipo: 'EQ-RTR02',
            laboratorio: 'Lab. de Redes y Telemática',
            reportadoPor: 'Doc. Luis Enrique',
            descripcion: 'El puerto serial de consola está flojo y desconecta la sesión.',
            prioridad: 2,
            estado: 'Pendiente',
        },
        {
            id: '03',
            codigoEquipo: 'EQ-OSC04',
            laboratorio: 'Lab. de Electrónica Digital',
            reportadoPor: 'Est. Juan Jose Abril',
            descripcion: 'Falta una punta de prueba del canal 2.',
            prioridad: 1,
            estado: 'Atendida',
        },
    ]);

    function handleMarcarAtendida(idIncidencia) {
        setIncidencias((prev) =>
            prev.map((inc) =>
                inc.id === idIncidencia ? { ...inc, estado: 'Atendida' } : inc
            )
        );

        console.log('Actualizar estado en BD:', {
            id: idIncidencia,
            estado: 'Atendida',
        });
    }

    // Filtra por estado y ordena de mayor prioridad (3) a menor (1)
    const incidenciasVisibles = incidencias
        .filter((inc) =>
            filtroEstado === 'Todas' ? true : inc.estado === filtroEstado
        )
        .sort((a, b) => b.prioridad - a.prioridad);

    return (
        <div className="contenedor-gestion-incidencias">
            <div className="tarjeta-cabecera-incidencias">
                <h2 className="titulo-gestion-incidencias">
                    Incidencias reportadas en laboratorios
                </h2>

                <div className="filtros-incidencias">
                    {['Todas', 'Pendiente', 'Atendida'].map((estado) => (
                        <button
                            key={estado}
                            type="button"
                            className={`boton-filtro-inc ${filtroEstado === estado ? 'activo' : ''
                                }`}
                            onClick={() => setFiltroEstado(estado)}
                        >
                            {estado}
                        </button>
                    ))}
                </div>
            </div>

            <div className="lista-incidencias-admin">
                {incidenciasVisibles.map((incidencia) => (
                    <IncidenciaItem
                        key={incidencia.id}
                        incidencia={incidencia}
                        onMarcarAtendida={handleMarcarAtendida}
                    />
                ))}
            </div>
        </div>
    );
}