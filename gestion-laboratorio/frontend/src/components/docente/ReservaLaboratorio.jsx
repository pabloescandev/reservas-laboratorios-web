import './ReservaLaboratorio.css';

export function ReservaLaboratorio() {
    // Fecha actual en formato YYYY-MM-DD para impedir reservas en días pasados
    const fechaMinimaHoy = new Date().toISOString().split('T')[0];

    // Datos de ejemplo alineados con los campos reales de tu tabla Reservas
    const reservasEjemplo = [
        {
            id: '01',
            laboratorio: 'Lab. de Redes (Aforo: 30)',
            fecha: '2026-11-28',
            motivo: 'Práctica de configuración de routers y VLANs',
            estado: 'Aprobada',
            mensajeRespuesta: 'Aprobado. Llave disponible en recepción 10 min antes.',
        },
        {
            id: '02',
            laboratorio: 'Lab. de Electrónica (Aforo: 25)',
            fecha: '2026-12-02',
            motivo: 'Medición de circuitos con osciloscopio',
            estado: 'Pendiente',
            mensajeRespuesta: 'En revisión por administración',
        },
    ];

    function handleCrearReserva(e) {
        e.preventDefault();
        const datos = new FormData(e.target);
        const nuevaReserva = Object.fromEntries(datos.entries());
        console.log('Reserva lista para enviar al backend:', nuevaReserva);
    }

    function obtenerClaseEstado(estado) {
        if (estado === 'Aprobada') return 'badge-estado estado-aprobada';
        if (estado === 'Rechazada') return 'badge-estado estado-rechazada';
        return 'badge-estado estado-pendiente';
    }

    return (
        <div className="contenedor-reservas">
            {/* 1. Formulario para solicitar reserva de laboratorio */}
            <form className="tarjeta-solicitud" onSubmit={handleCrearReserva}>
                <h2 className="titulo-tarjeta">Reservar laboratorio</h2>

                <div className="fila-doble-reserva">
                    <div className="campo-reserva">
                        <label className="etiqueta-reserva" htmlFor="laboratorio">
                            Laboratorio:
                        </label>
                        <select
                            id="laboratorio"
                            name="idLaboratorio"
                            className="selector-reserva"
                            required
                        >
                            <option value="1">Lab. de Redes y Telemática (Aforo: 30)</option>
                            <option value="2">Lab. de Electrónica (Aforo: 25)</option>
                            <option value="3">Lab. de Cómputo 1 (Aforo: 40)</option>
                        </select>
                    </div>

                    <div className="campo-reserva">
                        <label className="etiqueta-reserva" htmlFor="fecha">
                            Fecha de reserva:
                        </label>
                        <input
                            id="fecha"
                            name="fecha"
                            type="date"
                            className="entrada-reserva"
                            min={fechaMinimaHoy}
                            required
                        />
                    </div>
                </div>

                <div className="campo-reserva">
                    <label className="etiqueta-reserva" htmlFor="motivo">
                        Motivo de la reserva:
                    </label>
                    <textarea
                        id="motivo"
                        name="motivo"
                        className="area-motivo"
                        minLength={3}
                        required
                        placeholder="Describe la práctica o actividad académica (mínimo 3 caracteres)"
                    />
                </div>

                <button type="submit" className="boton-solicitar">
                    Enviar solicitud
                </button>
            </form>

            {/* 2. Tabla de seguimiento con estado y mensaje de respuesta */}
            <section className="tarjeta-historial">
                <h2 className="titulo-tarjeta">Mis solicitudes de laboratorio</h2>

                <table className="tabla-solicitudes">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Laboratorio</th>
                            <th>Fecha</th>
                            <th>Motivo</th>
                            <th>Estado</th>
                            <th>Mensaje de respuesta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasEjemplo.map((reserva) => (
                            <tr key={reserva.id}>
                                <td>{reserva.id}</td>
                                <td>{reserva.laboratorio}</td>
                                <td>{reserva.fecha}</td>
                                <td>{reserva.motivo}</td>
                                <td>
                                    <span className={obtenerClaseEstado(reserva.estado)}>
                                        {reserva.estado}
                                    </span>
                                </td>
                                <td>{reserva.mensajeRespuesta}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}