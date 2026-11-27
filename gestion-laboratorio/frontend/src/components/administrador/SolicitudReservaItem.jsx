export function SolicitudReservaItem({ solicitud, onResponder }) {
    function handleSubmit(e) {
        e.preventDefault();
        const datos = new FormData(e.target);
        const mensajeRespuesta = datos.get('mensajeRespuesta');
        // Detecta qué botón fue presionado ("Aprobado" o "Denegado")
        const nuevoEstado = e.nativeEvent.submitter.value;

        onResponder(solicitud.id, nuevoEstado, mensajeRespuesta);
    }

    function obtenerClaseEstado(estado) {
        if (estado === 'Aprobado') return 'badge-reserva-admin estado-aprobado';
        if (estado === 'Denegado') return 'badge-reserva-admin estado-denegado';
        return 'badge-reserva-admin estado-pendiente';
    }

    return (
        <article className="tarjeta-item-reserva">
            {/* Izquierda: Información de la solicitud */}
            <div className="info-solicitud">
                <div className="cabecera-item">
                    <span className="id-y-lab">
                        #{solicitud.id} — {solicitud.laboratorio}
                    </span>
                    <span className={obtenerClaseEstado(solicitud.estado)}>
                        {solicitud.estado}
                    </span>
                </div>

                <div className="metadatos-item">
                    <span>
                        <strong>Solicitante:</strong> {solicitud.solicitante}
                    </span>
                    <span>
                        <strong>Fecha:</strong> {solicitud.fecha}
                    </span>
                </div>

                <p className="motivo-texto">
                    <strong>Motivo:</strong> {solicitud.motivo}
                </p>
            </div>

            {/* Derecha: Campo de mensaje y botones de decisión */}
            <form className="acciones-solicitud" onSubmit={handleSubmit}>
                <div className="campo-respuesta">
                    <label
                        className="etiqueta-respuesta"
                        htmlFor={`respuesta-${solicitud.id}`}
                    >
                        Mensaje de respuesta:
                    </label>
                    <input
                        id={`respuesta-${solicitud.id}`}
                        name="mensajeRespuesta"
                        type="text"
                        className="entrada-respuesta"
                        minLength={3}
                        required
                        defaultValue={solicitud.mensajeRespuesta || ''}
                        placeholder="Mínimo 3 caracteres..."
                    />
                </div>

                <div className="grupo-botones-decision">
                    <button
                        type="submit"
                        name="estado"
                        value="Aprobado"
                        className="boton-aprobar"
                    >
                        Aprobar
                    </button>

                    <button
                        type="submit"
                        name="estado"
                        value="Denegado"
                        className="boton-denegar"
                    >
                        Denegar
                    </button>
                </div>
            </form>
        </article>
    );
}