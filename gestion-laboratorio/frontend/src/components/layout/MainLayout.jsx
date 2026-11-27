import './MainLayout.css';

const OPCIONES_POR_ROL = {
    Administrador: [
        'Gestión de usuarios',
        'Gestión de laboratorios',
        'Gestión de equipos',
        'Gestión de horarios',
        'Gestión de reservas',
    ],
    Estudiante: ['Reserva de equipo', 'Reporte de incidencia',],
    Docente: ['Reserva de laboratorio', 'Reporte de incidencia',],
};

export function MainLayout({
    rol = 'Administrador',
    nombreUsuario = 'Lucas Mancinelli',
    children,
}) {
    const opciones = OPCIONES_POR_ROL[rol] || [];

    return (
        <div className="pantalla-principal">
            {/* Barra lateral */}
            <aside className="barra-lateral">
                <h1 className="titulo-sistema">Gestión de laboratorios</h1>

                <nav className="menu-navegacion">
                    {opciones.map((opcion) => (
                        <button key={opcion} type="button" className="opcion-menu">
                            {opcion}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Columna derecha: Barra superior + Contenido */}
            <div className="zona-derecha">
                <header className="barra-superior">
                    <span>{rol}</span>

                    <div className="perfil-usuario">
                        <div className="avatar-usuario" />
                        <span>{nombreUsuario}</span>
                    </div>

                    <button type="button" className="boton-salir">
                        Cerrar sesión
                    </button>
                </header>

                <main className="area-contenido">{children}</main>
            </div>
        </div>
    );
}