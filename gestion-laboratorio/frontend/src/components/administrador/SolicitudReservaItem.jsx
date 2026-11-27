const CLASES_ESTADO = {
    A: 'badge-reserva-admin estado-aprobado',
    R: 'badge-reserva-admin estado-denegado',
    P: 'badge-reserva-admin estado-pendiente',
};

export function SolicitudReservaItem({ solicitud, onResponder }) {
    function handleSubmit(e) {
        e.preventDefault();
        const datos = new FormData(e.target);
        const mensajeRespuesta = datos.get('mensajeRespuesta');
        // Detecta qué botón fue presionado: "A" (aprobar) o "R" (rechazar)
        const decision = e.nativeEvent.submitter.value;

        onResponder(solicitud.id, decision, mensajeRespuesta);
    }

    const pendiente = solicitud.codigoEstado === 'P';

    return (
        <article className="tarjeta-item-reserva">
            {/* Izquierda: Información de la solicitud */}
            <div className="info-solicitud">
                <div className="cabecera-item">
                    <span className="id-y-lab">
                        #{solicitud.id} — {solicitud.laboratorio}
                    </span>
                    <span className={CLASES_ESTADO[solicitud.codigoEstado] || 'badge-reserva-admin'}>
                        {solicitud.estado}
                    </span>
                </div>

                <div className="metadatos-item">
                    <span>
                        <strong>Solicitante:</strong> {solicitud.solicitante}
                    </span>
                    <span>
                        <strong>Fecha:</strong> {solicitud.fecha} · {solicitud.franja}
                    </span>
                    <span>
                        <strong>Asignatura:</strong> {solicitud.asignatura}
                    </span>
                </div>

                <p className="motivo-texto">
                    <strong>Motivo:</strong> {solicitud.motivo}
                </p>
            </div>

            {/* Derecha: Campo de mensaje y botones de decisión */}
            {pendiente ? (
                <form className="acciones-solicitud" onSubmit={handleSubmit}>
                    <div className="campo-respuesta">
                        <label className="etiqueta-respuesta" htmlFor={`respuesta-${solicitud.id}`}>
                            Mensaje de respuesta:
                        </label>
                        <input
                            id={`respuesta-${solicitud.id}`}
                            name="mensajeRespuesta"
                            type="text"
                            className="entrada-respuesta"
                            minLength={3}
                            maxLength={300}
                            required
                            placeholder="Mínimo 3 caracteres..."
                        />
                    </div>

                    <div className="grupo-botones-decision">
                        <button type="submit" value="A" className="boton-aprobar">
                            Aprobar
                        </button>

                        <button type="submit" value="R" className="boton-denegar">
                            Denegar
                        </button>
                    </div>
                </form>
            ) : (
                <p className="respuesta-registrada">
                    <strong>Respuesta:</strong> {solicitud.mensajeRespuesta || 'Sin mensaje'}
                </p>
            )}
        </article>
    );
}
