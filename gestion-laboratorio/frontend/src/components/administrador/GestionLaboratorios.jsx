import './GestionLaboratorios.css';

export function GestionLaboratorios() {
    // Datos de ejemplo
    const laboratoriosEjemplo = [
        {
            id: '01',
            nombre: 'Lab. de Redes y Telemática',
            ubicacion: 'Campus Central - Bloque B, Piso 2',
            aforo: 30,
            softwareInstalado: 'Cisco Packet Tracer, Wireshark, Ubuntu Server',
            urlFoto: 'https://ejemplo.com/fotos/lab-redes.jpg',
            estado: 'Disponible',
        },
        {
            id: '02',
            nombre: 'Lab. de Electrónica Digital',
            ubicacion: 'Campus Norte - Edificio Ingeniería, Aula 104',
            aforo: 25,
            softwareInstalado: 'Proteus, MATLAB, Arduino IDE',
            urlFoto: 'https://ejemplo.com/fotos/lab-electronica.jpg',
            estado: 'En mantenimiento',
        },
    ];

    function handleCrearLaboratorio(e) {
        e.preventDefault();
        const datos = new FormData(e.target);
        const nuevoLab = Object.fromEntries(datos.entries());
        console.log('Laboratorio listo para guardar en BD:', nuevoLab);
    }

    function handleBuscarLaboratorio() {
        // Aquí irá la consulta por ID del laboratorio
    }

    function handleActualizarLaboratorio(e) {
        e.preventDefault();
        const datos = new FormData(e.target);
        const labActualizado = Object.fromEntries(datos.entries());
        console.log('Laboratorio actualizado:', labActualizado);
    }

    function obtenerClaseEstado(estado) {
        if (estado === 'Disponible') return 'estado-lab lab-disponible';
        if (estado === 'En mantenimiento') return 'estado-lab lab-mantenimiento';
        return 'estado-lab lab-inactivo';
    }

    return (
        <div className="contenedor-laboratorios">
            {/* 1. Tarjeta Registrar nuevo laboratorio */}
            <form className="tarjeta-lab" onSubmit={handleCrearLaboratorio}>
                <h2 className="titulo-lab">Registrar nuevo laboratorio</h2>

                <div className="fila-doble-lab">
                    <div className="campo-lab">
                        <label className="etiqueta-lab" htmlFor="nombre-lab">
                            Nombre del laboratorio:
                        </label>
                        <input
                            id="nombre-lab"
                            name="nombre"
                            type="text"
                            className="caja-lab"
                            minLength={3}
                            required
                            placeholder="Ej. Lab. de Cómputo 1"
                        />
                    </div>

                    <div className="campo-lab campo-corto">
                        <label className="etiqueta-lab" htmlFor="aforo-lab">
                            Aforo máximo:
                        </label>
                        <input
                            id="aforo-lab"
                            name="aforo"
                            type="number"
                            min={1}
                            max={100}
                            step={1}
                            className="caja-lab"
                            required
                            placeholder="Ej. 30"
                        />
                    </div>
                </div>

                <div className="fila-doble-lab">
                    <div className="campo-lab">
                        <label className="etiqueta-lab" htmlFor="ubicacion-lab">
                            Ubicación en el campus:
                        </label>
                        <input
                            id="ubicacion-lab"
                            name="ubicacion"
                            type="text"
                            className="caja-lab"
                            minLength={3}
                            required
                            placeholder="Ej. Bloque A, Planta Baja"
                        />
                    </div>

                    <div className="campo-lab campo-corto">
                        <label className="etiqueta-lab" htmlFor="estado-lab">
                            Estado:
                        </label>
                        <select
                            id="estado-lab"
                            name="estado"
                            className="selector-lab"
                            required
                        >
                            <option value="Disponible">Disponible</option>
                            <option value="En mantenimiento">En mantenimiento</option>
                            <option value="Fuera de servicio">Fuera de servicio</option>
                        </select>
                    </div>
                </div>

                <div className="campo-lab">
                    <label className="etiqueta-lab" htmlFor="url-foto-lab">
                        URL de la fotografía:
                    </label>
                    <input
                        id="url-foto-lab"
                        name="urlFoto"
                        type="url"
                        className="caja-lab"
                        required
                        placeholder="https://ejemplo.com/imagen-laboratorio.jpg"
                    />
                </div>

                <div className="campo-lab">
                    <label className="etiqueta-lab" htmlFor="software-lab">
                        Software instalado:
                    </label>
                    <textarea
                        id="software-lab"
                        name="softwareInstalado"
                        className="area-software"
                        minLength={3}
                        required
                        placeholder="Ej. Visual Studio Code, Docker, PostgreSQL..."
                    />
                </div>

                <button type="submit" className="boton-guardar-lab">
                    Registrar laboratorio
                </button>
            </form>

            {/* 2. Tarjeta Modificar laboratorio */}
            <form className="tarjeta-lab" onSubmit={handleActualizarLaboratorio}>
                <h2 className="titulo-lab">Modificar laboratorio</h2>

                <div className="fila-busqueda-lab">
                    <div className="campo-lab">
                        <label className="etiqueta-lab" htmlFor="buscar-id-lab">
                            ID del laboratorio:
                        </label>
                        <input
                            id="buscar-id-lab"
                            name="id"
                            type="number"
                            min={1}
                            className="caja-lab"
                            required
                            placeholder="Ej. 1"
                        />
                    </div>

                    <button
                        type="button"
                        className="boton-secundario-lab"
                        onClick={handleBuscarLaboratorio}
                    >
                        Buscar laboratorio
                    </button>
                </div>

                <div className="fila-doble-lab">
                    <div className="campo-lab">
                        <label className="etiqueta-lab" htmlFor="editar-nombre-lab">
                            Nombre del laboratorio:
                        </label>
                        <input
                            id="editar-nombre-lab"
                            name="nombre"
                            type="text"
                            className="caja-lab"
                            minLength={3}
                            required
                        />
                    </div>

                    <div className="campo-lab campo-corto">
                        <label className="etiqueta-lab" htmlFor="editar-aforo-lab">
                            Aforo máximo:
                        </label>
                        <input
                            id="editar-aforo-lab"
                            name="aforo"
                            type="number"
                            min={1}
                            max={100}
                            step={1}
                            className="caja-lab"
                            required
                        />
                    </div>
                </div>

                <div className="fila-doble-lab">
                    <div className="campo-lab">
                        <label className="etiqueta-lab" htmlFor="editar-ubicacion-lab">
                            Ubicación en el campus:
                        </label>
                        <input
                            id="editar-ubicacion-lab"
                            name="ubicacion"
                            type="text"
                            className="caja-lab"
                            minLength={3}
                            required
                        />
                    </div>

                    <div className="campo-lab campo-corto">
                        <label className="etiqueta-lab" htmlFor="editar-estado-lab">
                            Estado:
                        </label>
                        <select
                            id="editar-estado-lab"
                            name="estado"
                            className="selector-lab"
                            required
                        >
                            <option value="Disponible">Disponible</option>
                            <option value="En mantenimiento">En mantenimiento</option>
                            <option value="Fuera de servicio">Fuera de servicio</option>
                        </select>
                    </div>
                </div>

                <div className="campo-lab">
                    <label className="etiqueta-lab" htmlFor="editar-url-foto-lab">
                        URL de la fotografía:
                    </label>
                    <input
                        id="editar-url-foto-lab"
                        name="urlFoto"
                        type="url"
                        className="caja-lab"
                        required
                    />
                </div>

                <div className="campo-lab">
                    <label className="etiqueta-lab" htmlFor="editar-software-lab">
                        Software instalado:
                    </label>
                    <textarea
                        id="editar-software-lab"
                        name="softwareInstalado"
                        className="area-software"
                        minLength={3}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="boton-secundario-lab boton-derecha-lab"
                >
                    Actualizar laboratorio
                </button>
            </form>

            {/* 3. Tarjeta Tabla de laboratorios */}
            <section className="tarjeta-tabla-labs">
                <h2 className="titulo-lab">Laboratorios registrados</h2>

                <table className="tabla-labs">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Ubicación</th>
                            <th>Aforo</th>
                            <th>Software instalado</th>
                            <th>Fotografía</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {laboratoriosEjemplo.map((lab) => (
                            <tr key={lab.id}>
                                <td>{lab.id}</td>
                                <td>{lab.nombre}</td>
                                <td>{lab.ubicacion}</td>
                                <td>{lab.aforo} personas</td>
                                <td>{lab.softwareInstalado}</td>
                                <td>
                                    <a
                                        href={lab.urlFoto}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="enlace-foto"
                                    >
                                        Ver imagen
                                    </a>
                                </td>
                                <td>
                                    <span className={obtenerClaseEstado(lab.estado)}>
                                        {lab.estado}
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