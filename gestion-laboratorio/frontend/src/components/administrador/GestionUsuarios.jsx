import './GestionUsuarios.css';

export function GestionUsuarios() {
    // Datos de ejemplo 
    const usuariosEjemplo = [
        {
            idUsuario: '01',
            nombreUsuario: 'jabril',
            nombres: 'Juan Jose',
            apellidos: 'Abril',
            rol: 'Estudiante',
            estado: 'Activo',
            fechaCreacion: '2026-11-20',
        },
        {
            idUsuario: '02',
            nombreUsuario: 'ney11',
            nombres: 'Neymar',
            apellidos: 'Junior',
            rol: 'Docente',
            estado: 'Activo',
            fechaCreacion: '2026-11-22',
        },
    ];

    function handleCrearUsuario(e) {
        e.preventDefault();
        // si el formulario llega aqui, ya paso todas las validaciones nativas
        const datos = new FormData(e.target);
        const nuevoUsuario = Object.fromEntries(datos.entries());
        console.log('Listo para enviar al backend:', nuevoUsuario);
    }

    function handleBuscarUsuario() {
        // Aquí va la búsqueda por idUsuario
    }

    function handleActualizarUsuario(e) {
        e.preventDefault();
        const datos = new FormData(e.target);
        const usuarioActualizado = Object.fromEntries(datos.entries());
        console.log('Datos actualizados:', usuarioActualizado);
    }

    return (
        <div className="contenedor-gestion">
            {/* 1. Tarjeta Registrar nuevo usuario */}
            <form className="tarjeta-formulario" onSubmit={handleCrearUsuario}>
                <h2 className="titulo-formulario">Registrar nuevo usuario</h2>

                <div className="fila-doble">
                    <div className="campo campo-ancho">
                        <label className="etiqueta" htmlFor="nombreUsuario">
                            Nombre de usuario:
                        </label>
                        <input
                            id="nombreUsuario"
                            name="nombreUsuario"
                            type="text"
                            className="caja-texto"
                            minLength={3}
                            required
                            placeholder="Ej. jabril"
                        />
                    </div>

                    <div className="campo campo-rol">
                        <label className="etiqueta" htmlFor="rol">
                            Rol:
                        </label>
                        <select id="rol" name="rol" className="lista-opciones" required>
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="campo">
                    <label className="etiqueta" htmlFor="contrasena">
                        Contraseña:
                    </label>
                    <input
                        id="contrasena"
                        name="contrasena"
                        type="password"
                        className="caja-texto"
                        minLength={3}
                        required
                        placeholder="Mínimo 3 caracteres"
                    />
                </div>

                <div className="fila-doble">
                    <div className="campo campo-ancho">
                        <label className="etiqueta" htmlFor="nombres">
                            Nombres:
                        </label>
                        <input
                            id="nombres"
                            name="nombres"
                            type="text"
                            className="caja-texto"
                            minLength={3}
                            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}"
                            title="Ingresa al menos 3 letras (sin números)"
                            required
                        />
                    </div>

                    <div className="campo campo-ancho">
                        <label className="etiqueta" htmlFor="apellidos">
                            Apellidos:
                        </label>
                        <input
                            id="apellidos"
                            name="apellidos"
                            type="text"
                            className="caja-texto"
                            minLength={3}
                            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}"
                            title="Ingresa al menos 3 letras (sin números)"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="boton-crear">
                    Crear usuario
                </button>
            </form>

            {/* 2. Tarjeta Modificar usuario */}
            <form
                className="tarjeta-formulario tarjeta-modificar"
                onSubmit={handleActualizarUsuario}
            >
                <h2 className="titulo-formulario">Modificar usuario</h2>

                <div className="fila-busqueda">
                    <div className="campo campo-ancho">
                        <label className="etiqueta" htmlFor="buscar-id">
                            ID de usuario:
                        </label>
                        <input
                            id="buscar-id"
                            name="idUsuario"
                            type="number"
                            min={1}
                            className="caja-texto"
                            required
                            placeholder="Ej. 1"
                        />
                    </div>

                    <button
                        type="button"
                        className="boton-accion"
                        onClick={handleBuscarUsuario}
                    >
                        Buscar usuario
                    </button>
                </div>

                <div className="fila-doble">
                    <div className="campo campo-ancho">
                        <label className="etiqueta" htmlFor="editar-nombreUsuario">
                            Nombre de usuario:
                        </label>
                        <input
                            id="editar-nombreUsuario"
                            name="nombreUsuario"
                            type="text"
                            className="caja-texto"
                            minLength={3}
                            required
                        />
                    </div>

                    <div className="campo campo-rol">
                        <label className="etiqueta" htmlFor="editar-rol">
                            Rol:
                        </label>
                        <select
                            id="editar-rol"
                            name="rol"
                            className="lista-opciones"
                            required
                        >
                            <option value="estudiante">Estudiante</option>
                            <option value="docente">Docente</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                </div>

                <div className="fila-doble">
                    <div className="campo campo-ancho">
                        <label className="etiqueta" htmlFor="editar-contrasena">
                            Nueva contraseña:
                        </label>
                        <input
                            id="editar-contrasena"
                            name="contrasena"
                            type="password"
                            className="caja-texto"
                            minLength={3}
                            placeholder="Dejar vacío para no cambiar"
                        />
                    </div>

                    <div className="campo campo-rol">
                        <label className="etiqueta" htmlFor="editar-estado">
                            Estado:
                        </label>
                        <select
                            id="editar-estado"
                            name="estado"
                            className="lista-opciones"
                            required
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="fila-doble">
                    <div className="campo campo-ancho">
                        <label className="etiqueta" htmlFor="editar-nombres">
                            Nombres:
                        </label>
                        <input
                            id="editar-nombres"
                            name="nombres"
                            type="text"
                            className="caja-texto"
                            minLength={3}
                            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}"
                            title="Ingresa al menos 3 letras (sin números)"
                            required
                        />
                    </div>

                    <div className="campo campo-ancho">
                        <label className="etiqueta" htmlFor="editar-apellidos">
                            Apellidos:
                        </label>
                        <input
                            id="editar-apellidos"
                            name="apellidos"
                            type="text"
                            className="caja-texto"
                            minLength={3}
                            pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,}"
                            title="Ingresa al menos 3 letras (sin números)"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="boton-accion boton-derecha">
                    Actualizar datos
                </button>
            </form>

            {/* 3. Tarjeta Tabla de usuarios */}
            <section className="tarjeta-tabla">
                <h2 className="titulo-formulario">Usuarios del sistema</h2>

                <table className="tabla-usuarios">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuario</th>
                            <th>Nombres</th>
                            <th>Apellidos</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Fecha creación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosEjemplo.map((usuario) => (
                            <tr key={usuario.idUsuario}>
                                <td>{usuario.idUsuario}</td>
                                <td>{usuario.nombreUsuario}</td>
                                <td>{usuario.nombres}</td>
                                <td>{usuario.apellidos}</td>
                                <td>{usuario.rol}</td>
                                <td>{usuario.estado}</td>
                                <td>{usuario.fechaCreacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}