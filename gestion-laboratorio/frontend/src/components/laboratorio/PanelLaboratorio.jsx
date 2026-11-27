import './PanelLaboratorio.css';

const ESTADOS_EQUIPO = {
    O: { texto: 'Operativo', clase: 'equipo-operativo' },
    D: { texto: 'Dañado', clase: 'equipo-danado' },
    R: { texto: 'En reparación', clase: 'equipo-reparacion' },
};

export function PanelLaboratorio({ laboratorio, equipos, errorEquipos, puedeReportar, onReportarDano }) {
    const software = (laboratorio.lab_software_instalado || '')
        .split(',')
        .map((programa) => programa.trim())
        .filter(Boolean);

    return (
        <aside className="panel-laboratorio">
            {laboratorio.lab_foto_url ? (
                <img
                    className="foto-laboratorio"
                    src={laboratorio.lab_foto_url}
                    alt={`Fotografía del ${laboratorio.lab_nombre}`}
                />
            ) : (
                <div className="foto-laboratorio foto-vacia">Sin imagen</div>
            )}

            <div className="bloque-panel">
                <h2 className="nombre-laboratorio">{laboratorio.lab_nombre}</h2>
                <span className={`estado-laboratorio ${laboratorio.lab_estado === 'M' ? 'en-mantenimiento' : 'disponible'}`}>
                    {laboratorio.lab_estado === 'M' ? 'En mantenimiento' : 'Disponible'}
                </span>
                <dl className="datos-laboratorio">
                    <dt>Ubicación</dt>
                    <dd>{laboratorio.lab_ubicacion}</dd>
                    <dt>Capacidad</dt>
                    <dd>{laboratorio.lab_aforo} puestos</dd>
                </dl>
            </div>

            <div className="bloque-panel">
                <h3 className="subtitulo-panel">Software instalado</h3>
                {software.length > 0 ? (
                    <ul className="lista-software">
                        {software.map((programa) => (
                            <li key={programa}>{programa}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="texto-secundario">No se registró software.</p>
                )}
            </div>

            <div className="bloque-panel">
                <h3 className="subtitulo-panel">Equipos</h3>
                {errorEquipos && <p className="texto-secundario">{errorEquipos}</p>}
                {!errorEquipos && equipos.length === 0 && <p className="texto-secundario">No hay equipos registrados.</p>}
                <ul className="lista-equipos">
                    {equipos.map((equipo) => {
                        const estado = ESTADOS_EQUIPO[equipo.equ_estado] || { texto: equipo.equ_estado, clase: '' };
                        return (
                            <li key={equipo.equ_id} className="item-equipo">
                                <div>
                                    <span className="codigo-equipo">{equipo.equ_codigo}</span>
                                    <span className="tipo-equipo">{equipo.equ_tipo}</span>
                                </div>
                                <div className="acciones-equipo">
                                    <span className={`estado-equipo ${estado.clase}`}>{estado.texto}</span>
                                    {puedeReportar && equipo.equ_estado === 'O' && (
                                        <button
                                            type="button"
                                            className="boton-reportar"
                                            onClick={() => onReportarDano(equipo)}
                                        >
                                            Reportar daño
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
