export function IncidenciaItem({ incidencia, onMarcarAtendida }) {
    function obtenerBadgePrioridad(nivel) {
        if (nivel === 3) {
            return <span className="badge-admin-inc prio-alta">Prioridad Alta (3)</span>;
        }
        if (nivel === 2) {
            return <span className="badge-admin-inc prio-media">Prioridad Media (2)</span>;
        }
        return <span className="badge-admin-inc prio-baja">Prioridad Baja (1)</span>;
    }

    return (
        <article className="tarjeta-item-incidencia">
            {/* Izquierda: Detalles de la incidencia */}
            <div className="info-incidencia-admin">
                <div className="cabecera-item-inc">
                    <div className="titulo-equipo-inc">
                        <span>#{incidencia.id}</span>
                        <span className="codigo-badge-inc">{incidencia.codigoEquipo}</span>
                        <span>— {incidencia.laboratorio}</span>
                    </div>

                    <div className="grupo-badges-inc">
                        {obtenerBadgePrioridad(incidencia.prioridad)}
                        <span
                            className={`badge-admin-inc ${incidencia.estado === 'Atendida'
                                    ? 'est-atendida'
                                    : 'est-pendiente'
                                }`}
                        >
                            {incidencia.estado}
                        </span>
                    </div>
                </div>

                <div className="metadatos-incidencia">
                    <span>
                        <strong>Reportado por:</strong> {incidencia.reportadoPor}
                    </span>
                </div>

                <p className="descripcion-inc-texto">
                    <strong>Falla reportada:</strong> {incidencia.descripcion}
                </p>
            </div>

            {/* Derecha: Acción de resolución */}
            <div className="accion-incidencia-admin">
                {incidencia.estado === 'Pendiente' ? (
                    <button
                        type="button"
                        className="boton-marcar-atendida"
                        onClick={() => onMarcarAtendida(incidencia.id)}
                    >
                        Marcar como atendida
                    </button>
                ) : (
                    <span className="texto-resuelta">Incidencia resuelta</span>
                )}
            </div>
        </article>
    );
}