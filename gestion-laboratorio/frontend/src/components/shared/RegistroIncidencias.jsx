import './RegistroIncidencias.css';

export function RegistroIncidencias() {
    // Equipos traídos desde la BD mostrando su código y laboratorio
    const equiposBD = [
        { id: 1, codigo: 'EQ-PC01', laboratorio: 'Lab. de Redes y Telemática' },
        { id: 2, codigo: 'EQ-OSC04', laboratorio: 'Lab. de Electrónica Digital' },
        { id: 3, codigo: 'EQ-RTR02', laboratorio: 'Lab. de Redes y Telemática' },
    ];

    // Datos de ejemplo alineados con los atributos de tu tabla Incidencias
    const incidenciasEjemplo = [
        {
            id: '01',
            codigoEquipo: 'EQ-PC01',
            descripcion: 'El monitor parpadea y el puerto HDMI no da señal de video.',
            prioridad: 3,
            estado: 'Pendiente',
        },
        {
            id: '02',
            codigoEquipo: 'EQ-OSC04',
            descripcion: 'Falta una punta de prueba del canal 2.',
            prioridad: 2,
            estado: 'Atendida',
        },
    ];

    function handleReportarIncidencia(e) {
        e.preventDefault();
        const datos = new FormData(e.target);

        const nuevaIncidencia = {
            idEquipo: Number(datos.get('idEquipo')),
            prioridad: Number(datos.get('prioridad')),
            descripcion: datos.get('descripcion'),
            // idUsuario sale de la sesión activa y estado nace como "Pendiente" en el backend
        };

        console.log('Incidencia lista para enviar al backend:', nuevaIncidencia);
    }

    function renderizarPrioridad(nivel) {
        if (nivel === 3) {
            return <span className="badge-incidencia prioridad-alta">Alta (3)</span>;
        }
        if (nivel === 2) {
            return <span className="badge-incidencia prioridad-media">Media (2)</span>;
        }
        return <span className="badge-incidencia prioridad-baja">Baja (1)</span>;
    }

    return (
        <div className="contenedor-incidencias">
            {/* 1. Formulario reutilizable para reportar fallas */}
            <form className="tarjeta-incidencia" onSubmit={handleReportarIncidencia}>
                <h2 className="titulo-incidencia">Reportar incidencia de equipo</h2>

                <div className="fila-doble-incidencia">
                    <div className="campo-incidencia">
                        <label className="etiqueta-incidencia" htmlFor="equipo-incidencia">
                            Equipo reportado:
                        </label>
                        <select
                            id="equipo-incidencia"
                            name="idEquipo"
                            className="selector-incidencia"
                            required
                        >
                            <option value="">Selecciona el código del equipo...</option>
                            {equiposBD.map((eq) => (
                                <option key={eq.id} value={eq.id}>
                                    {eq.codigo} — {eq.laboratorio}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-incidencia">
                        <label
                            className="etiqueta-incidencia"
                            htmlFor="prioridad-incidencia"
                        >
                            Nivel de prioridad:
                        </label>
                        <select
                            id="prioridad-incidencia"
                            name="prioridad"
                            className="selector-incidencia"
                            defaultValue="2"
                            required
                        >
                            <option value="1">Baja (No impide el uso del equipo)</option>
                            <option value="2">Media (Falla parcial o accesorio)</option>
                            <option value="3">Alta (Equipo inoperativo / urgente)</option>
                        </select>
                    </div>
                </div>

                <div className="campo-incidencia">
                    <label
                        className="etiqueta-incidencia"
                        htmlFor="descripcion-incidencia"
                    >
                        Descripción del problema:
                    </label>
                    <textarea
                        id="descripcion-incidencia"
                        name="descripcion"
                        className="area-descripcion"
                        minLength={3}
                        required
                        placeholder="Describe detalladamente la falla presentada (mínimo 3 caracteres)"
                    />
                </div>

                <button type="submit" className="boton-reportar">
                    Registrar incidencia
                </button>
            </form>

            {/* 2. Historial de incidencias reportadas por el usuario */}
            <section className="tarjeta-tabla-incidencias">
                <h2 className="titulo-incidencia">Mis incidencias reportadas</h2>

                <table className="tabla-incidencias">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Equipo</th>
                            <th>Descripción</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {incidenciasEjemplo.map((inc) => (
                            <tr key={inc.id}>
                                <td>{inc.id}</td>
                                <td>
                                    <span className="codigo-equipo-tag">{inc.codigoEquipo}</span>
                                </td>
                                <td>{inc.descripcion}</td>
                                <td>{renderizarPrioridad(inc.prioridad)}</td>
                                <td>
                                    <span
                                        className={`badge-incidencia ${inc.estado === 'Atendida'
                                                ? 'estado-atendida'
                                                : 'estado-pendiente-inc'
                                            }`}
                                    >
                                        {inc.estado}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}