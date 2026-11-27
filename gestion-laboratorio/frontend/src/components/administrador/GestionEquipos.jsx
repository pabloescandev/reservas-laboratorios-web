import './GestionEquipos.css';

export function GestionEquipos() {
    // Laboratorios disponibles que vendrán desde la BD para llenar el <select> (FK)
    const laboratoriosDisponibles = [
        { id: 1, nombre: 'Lab. de Redes y Telemática' },
        { id: 2, nombre: 'Lab. de Electrónica Digital' },
        { id: 3, nombre: 'Lab. de Cómputo 1' },
    ];

    // Datos de ejemplo 
    const equiposEjemplo = [
        {
            id: '01',
            codigo: 'EQ-PC01',
            tipo: 'Computadora de escritorio',
            estado: 'Nuevo',
            laboratorio: 'Lab. de Redes y Telemática',
        },
        {
            id: '02',
            codigo: 'EQ-OSC04',
            tipo: 'Osciloscopio digital',
            estado: 'Operativo',
            laboratorio: 'Lab. de Electrónica Digital',
        },
        {
            id: '03',
            codigo: 'EQ-RTR02',
            tipo: 'Router Cisco 2900',
            estado: 'En mantenimiento',
            laboratorio: 'Lab. de Redes y Telemática',
        },
    ];

    function handleCrearEquipo(e) {
        e.preventDefault();
        const datos = new FormData(e.target);
        const nuevoEquipo = Object.fromEntries(datos.entries());
        console.log('Equipo listo para guardar en BD:', nuevoEquipo);
    }

    function handleBuscarEquipo() {
        // Aquí irá la consulta por ID del equipo
    }

    function handleActualizarEquipo(e) {
        e.preventDefault();
        const datos = new FormData(e.target);
        const equipoActualizado = Object.fromEntries(datos.entries());
        console.log('Equipo actualizado:', equipoActualizado);
    }

    function obtenerClaseEstado(estado) {
        if (estado === 'Operativo') return 'estado-equipo equipo-nuevo';
        if (estado === 'Dañado') return 'estado-equipo equipo-operativo';
        if (estado === 'En operacion') return 'estado-equipo equipo-mantenimiento';
        return 'estado-equipo equipo-danado';
    }

    return (
        <div className="contenedor-equipos">
            {/* 1. Tarjeta Registrar nuevo equipo */}
            <form className="tarjeta-equipo" onSubmit={handleCrearEquipo}>
                <h2 className="titulo-equipo">Registrar nuevo equipo</h2>

                <div className="fila-doble-equipo">
                    <div className="campo-equipo">
                        <label className="etiqueta-equipo" htmlFor="codigo-equipo">
                            Código del equipo:
                        </label>
                        <input
                            id="codigo-equipo"
                            name="codigo"
                            type="text"
                            className="caja-equipo"
                            minLength={3}
                            required
                            placeholder="Ej. EQ-PC01"
                        />
                    </div>

                    <div className="campo-equipo campo-estado-equipo">
                        <label className="etiqueta-equipo" htmlFor="estado-equipo">
                            Estado inicial:
                        </label>
                        <select
                            id="estado-equipo"
                            name="estado"
                            className="selector-equipo"
                            defaultValue="Nuevo"
                            required
                        >
                            <option value="Nuevo">Operativo</option>
                            <option value="Operativo">Dañado</option>
                            <option value="En mantenimiento">En reparación</option>
                        </select>
                    </div>
                </div>

                <div className="campo-equipo">
                    <label className="etiqueta-equipo" htmlFor="tipo-equipo">
                        Tipo de equipo:
                    </label>
                    <input
                        id="tipo-equipo"
                        name="tipo"
                        type="text"
                        className="caja-equipo"
                        minLength={3}
                        required
                        placeholder="Ej. Computadora, Osciloscopio, Switch..."
                    />
                </div>

                <div className="campo-equipo">
                    <label className="etiqueta-equipo" htmlFor="lab-equipo">
                        Laboratorio asignado:
                    </label>
                    <select
                        id="lab-equipo"
                        name="idLaboratorio"
                        className="selector-equipo"
                        required
                    >
                        <option value="">Selecciona un laboratorio...</option>
                        {laboratoriosDisponibles.map((lab) => (
                            <option key={lab.id} value={lab.id}>
                                {lab.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="boton-guardar-equipo">
                    Registrar equipo
                </button>
            </form>

            {/* 2. Tarjeta Modificar equipo */}
            <form className="tarjeta-equipo" onSubmit={handleActualizarEquipo}>
                <h2 className="titulo-equipo">Modificar equipo</h2>

                <div className="fila-busqueda-equipo">
                    <div className="campo-equipo">
                        <label className="etiqueta-equipo" htmlFor="buscar-id-equipo">
                            ID del equipo:
                        </label>
                        <input
                            id="buscar-id-equipo"
                            name="id"
                            type="number"
                            min={1}
                            className="caja-equipo"
                            required
                            placeholder="Ej. 1"
                        />
                    </div>

                    <button
                        type="button"
                        className="boton-secundario-equipo"
                        onClick={handleBuscarEquipo}
                    >
                        Buscar equipo
                    </button>
                </div>

                <div className="fila-doble-equipo">
                    <div className="campo-equipo">
                        <label className="etiqueta-equipo" htmlFor="editar-codigo-equipo">
                            Código del equipo:
                        </label>
                        <input
                            id="editar-codigo-equipo"
                            name="codigo"
                            type="text"
                            className="caja-equipo"
                            minLength={3}
                            required
                        />
                    </div>

                    <div className="campo-equipo campo-estado-equipo">
                        <label className="etiqueta-equipo" htmlFor="editar-estado-equipo">
                            Estado:
                        </label>
                        <select
                            id="editar-estado-equipo"
                            name="estado"
                            className="selector-equipo"
                            required
                        >
                            <option value="Operativo">Operativo</option>
                            <option value="Dañado">Dañado</option>
                            <option value="En mantenimiento">En reparación</option>
                            
                        </select>
                    </div>
                </div>

                <div className="campo-equipo">
                    <label className="etiqueta-equipo" htmlFor="editar-tipo-equipo">
                        Tipo de equipo:
                    </label>
                    <input
                        id="editar-tipo-equipo"
                        name="tipo"
                        type="text"
                        className="caja-equipo"
                        minLength={3}
                        required
                    />
                </div>

                <div className="campo-equipo">
                    <label className="etiqueta-equipo" htmlFor="editar-lab-equipo">
                        Laboratorio asignado:
                    </label>
                    <select
                        id="editar-lab-equipo"
                        name="idLaboratorio"
                        className="selector-equipo"
                        required
                    >
                        <option value="">Selecciona un laboratorio...</option>
                        {laboratoriosDisponibles.map((lab) => (
                            <option key={lab.id} value={lab.id}>
                                {lab.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="boton-secundario-equipo boton-derecha-equipo"
                >
                    Actualizar equipo
                </button>
            </form>

            {/* 3. Tarjeta Tabla de equipos */}
            <section className="tarjeta-tabla-equipos">
                <h2 className="titulo-equipo">Equipos registrados</h2>

                <table className="tabla-equipos">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código</th>
                            <th>Tipo</th>
                            <th>Laboratorio</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equiposEjemplo.map((equipo) => (
                            <tr key={equipo.id}>
                                <td>{equipo.id}</td>
                                <td>
                                    <span className="codigo-badge">{equipo.codigo}</span>
                                </td>
                                <td>{equipo.tipo}</td>
                                <td>{equipo.laboratorio}</td>
                                <td>
                                    <span className={obtenerClaseEstado(equipo.estado)}>
                                        {equipo.estado}
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