import './ReservaEquipo.css';

export function ReservaEquipo() {
    // Datos de ejemplo para visualizar el diseño
    const reservasEjemplo = [
        {
            id: 'RES-101',
            laboratorio: 'Lab. de Redes y Telemática',
            equipo: 'Puesto PC-04 (Cisco Packet Tracer)',
            fecha: '2026-11-27',
            horario: '09:00 - 11:00',
            estado: 'Confirmada',
        },
        {
            id: 'RES-102',
            laboratorio: 'Lab. de Electrónica',
            equipo: 'Banco 02 - Osciloscopio Digital',
            fecha: '2026-11-28',
            horario: '14:00 - 16:00',
            estado: 'Confirmada',
        },
    ];

    function handleReservar(e) {
        e.preventDefault();
        // Aquí irá la lógica para registrar la reserva
    }

    function handleCancelar(idReserva) {
        // Aquí irá la lógica para cancelar la reserva
    }

    return (
        <div className="contenedor-estudiante">
            {/* 1. Formulario para reservar puesto o equipo */}
            <form className="tarjeta-reserva" onSubmit={handleReservar}>
                <h2 className="titulo-seccion">Reservar puesto o equipo</h2>

                <div className="fila-campos">
                    <div className="grupo-campo">
                        <label className="etiqueta-campo" htmlFor="laboratorio">
                            Laboratorio disponible:
                        </label>
                        <select id="laboratorio" className="selector-dato">
                            <option value="redes">Lab. de Redes y Telemática (Disponible)</option>
                            <option value="electronica">Lab. de Electrónica (Disponible)</option>
                            <option value="computo">Lab. de Cómputo 1 (Disponible)</option>
                        </select>
                    </div>

                    <div className="grupo-campo">
                        <label className="etiqueta-campo" htmlFor="equipo">
                            Puesto o equipo:
                        </label>
                        <select id="equipo" className="selector-dato">
                            <option value="pc-01">Puesto PC-01</option>
                            <option value="pc-02">Puesto PC-02</option>
                            <option value="pc-03">Puesto PC-03</option>
                            <option value="osc-01">Banco 01 - Osciloscopio</option>
                        </select>
                    </div>
                </div>

                <div className="fila-campos">
                    <div className="grupo-campo">
                        <label className="etiqueta-campo" htmlFor="fecha-reserva">
                            Fecha:
                        </label>
                        <input id="fecha-reserva" type="date" className="entrada-dato" />
                    </div>

                    <div className="grupo-campo">
                        <label className="etiqueta-campo" htmlFor="horario-reserva">
                            Franja horaria:
                        </label>
                        <select id="horario-reserva" className="selector-dato">
                            <option value="07:00-09:00">07:00 - 09:00</option>
                            <option value="09:00-11:00">09:00 - 11:00</option>
                            <option value="11:00-13:00">11:00 - 13:00</option>
                            <option value="14:00-16:00">14:00 - 16:00</option>
                            <option value="16:00-18:00">16:00 - 18:00</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="boton-reservar">
                    Confirmar reserva
                </button>
            </form>

            {/* 2. Tabla con las reservas actuales del estudiante */}
            <section className="tarjeta-mis-reservas">
                <h2 className="titulo-seccion">Mis reservas de equipos</h2>

                <table className="tabla-reservas">
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Laboratorio</th>
                            <th>Puesto / Equipo</th>
                            <th>Fecha</th>
                            <th>Horario</th>
                            <th>Estado</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasEjemplo.map((reserva) => (
                            <tr key={reserva.id}>
                                <td>{reserva.id}</td>
                                <td>{reserva.laboratorio}</td>
                                <td>{reserva.equipo}</td>
                                <td>{reserva.fecha}</td>
                                <td>{reserva.horario}</td>
                                <td>
                                    <span className="etiqueta-estado">{reserva.estado}</span>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="boton-cancelar"
                                        onClick={() => handleCancelar(reserva.id)}
                                    >
                                        Cancelar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}