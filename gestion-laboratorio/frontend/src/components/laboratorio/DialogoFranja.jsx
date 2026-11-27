import { useEffect, useState } from 'react';
import {
    ESTADOS_RESERVA,
    TIPOS_RESERVA,
    cancelarReserva,
    reservarPuesto,
    solicitarLaboratorio,
} from '../../services/reservaService';
import './DialogoFranja.css';

const NOMBRES_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export function DialogoFranja({ dia, franja, equipos, rol, onCerrar, onCambio }) {
    const [tipoEstudiante, setTipoEstudiante] = useState('P');
    const [equipoId, setEquipoId] = useState('');
    const [asignatura, setAsignatura] = useState('');
    const [motivo, setMotivo] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');
    const [exito, setExito] = useState('');

    useEffect(() => {
        function cerrarConEscape(evento) {
            if (evento.key === 'Escape') onCerrar();
        }
        document.addEventListener('keydown', cerrarConEscape);
        return () => document.removeEventListener('keydown', cerrarConEscape);
    }, [onCerrar]);

    const miReservaActiva =
        franja.miReserva && ['P', 'A'].includes(franja.miReserva.res_estado) ? franja.miReserva : null;
    const sePuedeReservar = !franja.pasada && franja.estado !== 'bloqueada' && !miReservaActiva;
    const equiposDisponibles = equipos.filter(
        (equipo) => equipo.equ_estado === 'O' && !franja.equiposReservados.includes(equipo.equ_id)
    );

    async function ejecutar(accion, mensajeExito) {
        setEnviando(true);
        setError('');
        setExito('');
        try {
            await accion();
            setExito(mensajeExito);
            onCambio();
        } catch (err) {
            setError(err.message);
        } finally {
            setEnviando(false);
        }
    }

    function handleReservarEstudiante(evento) {
        evento.preventDefault();
        if (tipoEstudiante === 'E' && !equipoId) {
            setError('Selecciona un equipo.');
            return;
        }
        ejecutar(
            () =>
                reservarPuesto({
                    horId: franja.hor_id,
                    fecha: dia.fecha,
                    equId: tipoEstudiante === 'E' ? Number(equipoId) : undefined,
                    motivo,
                }),
            'Reserva confirmada.'
        );
    }

    function handleSolicitarDocente(evento) {
        evento.preventDefault();
        ejecutar(
            () => solicitarLaboratorio({ horId: franja.hor_id, fecha: dia.fecha, asignatura, motivo }),
            'Solicitud enviada. Queda pendiente de aprobación.'
        );
    }

    function handleCancelar() {
        ejecutar(() => cancelarReserva(miReservaActiva.res_id), 'Reserva cancelada.');
    }

    return (
        <div className="fondo-dialogo" onClick={onCerrar}>
            <div
                className="dialogo-franja"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-dialogo-franja"
                onClick={(evento) => evento.stopPropagation()}
            >
                <header className="cabecera-dialogo">
                    <div>
                        <h2 id="titulo-dialogo-franja" className="titulo-dialogo">
                            {NOMBRES_DIA[dia.diaSemana - 1]} {dia.fecha.split('-').reverse().join('/')}
                        </h2>
                        <p className="subtitulo-dialogo">
                            {franja.entrada} – {franja.salida} · {franja.cupos.disponibles} de {franja.cupos.total} cupos libres
                        </p>
                    </div>
                    <button type="button" className="boton-cerrar" onClick={onCerrar} aria-label="Cerrar">
                        ×
                    </button>
                </header>

                {franja.bloqueo && (
                    <p className="aviso-dialogo aviso-bloqueo">Bloqueada: {franja.bloqueo.motivo}</p>
                )}
                {franja.pasada && <p className="aviso-dialogo">Esta franja ya empezó o terminó.</p>}
                {franja.laboratorioAprobado && (
                    <p className="aviso-dialogo">Un docente tiene reservado el laboratorio completo.</p>
                )}

                {miReservaActiva && (
                    <div className="mi-reserva">
                        <p>
                            <strong>Tu {TIPOS_RESERVA[miReservaActiva.res_tipo].toLowerCase()}</strong>
                            {miReservaActiva.equ_codigo ? ` (${miReservaActiva.equ_codigo})` : ''} ·{' '}
                            {ESTADOS_RESERVA[miReservaActiva.res_estado]}
                        </p>
                        {!franja.pasada && (
                            <button type="button" className="boton-secundario" onClick={handleCancelar} disabled={enviando}>
                                Cancelar mi reserva
                            </button>
                        )}
                    </div>
                )}

                {rol === 'E' && sePuedeReservar && !franja.laboratorioAprobado && franja.cupos.disponibles > 0 && (
                    <form className="formulario-dialogo" onSubmit={handleReservarEstudiante}>
                        <fieldset className="grupo-opciones">
                            <legend className="etiqueta-campo">¿Qué quieres reservar?</legend>
                            <label>
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="P"
                                    checked={tipoEstudiante === 'P'}
                                    onChange={() => setTipoEstudiante('P')}
                                />
                                Un puesto
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="tipo"
                                    value="E"
                                    checked={tipoEstudiante === 'E'}
                                    onChange={() => setTipoEstudiante('E')}
                                />
                                Un equipo
                            </label>
                        </fieldset>

                        {tipoEstudiante === 'E' && (
                            <label className="grupo-campo">
                                <span className="etiqueta-campo">Equipo operativo</span>
                                <select
                                    className="selector-dato"
                                    value={equipoId}
                                    onChange={(evento) => setEquipoId(evento.target.value)}
                                >
                                    <option value="">Selecciona un equipo</option>
                                    {equiposDisponibles.map((equipo) => (
                                        <option key={equipo.equ_id} value={equipo.equ_id}>
                                            {equipo.equ_codigo} · {equipo.equ_tipo}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}

                        <label className="grupo-campo">
                            <span className="etiqueta-campo">Motivo (opcional)</span>
                            <input
                                className="entrada-dato"
                                value={motivo}
                                onChange={(evento) => setMotivo(evento.target.value)}
                                maxLength={300}
                            />
                        </label>

                        <button type="submit" className="boton-principal" disabled={enviando}>
                            {enviando ? 'Reservando…' : 'Confirmar reserva'}
                        </button>
                    </form>
                )}

                {rol === 'D' && sePuedeReservar && !franja.laboratorioAprobado && (
                    <form className="formulario-dialogo" onSubmit={handleSolicitarDocente}>
                        <label className="grupo-campo">
                            <span className="etiqueta-campo">Asignatura</span>
                            <input
                                className="entrada-dato"
                                value={asignatura}
                                onChange={(evento) => setAsignatura(evento.target.value)}
                                required
                                maxLength={100}
                            />
                        </label>
                        <label className="grupo-campo">
                            <span className="etiqueta-campo">Motivo</span>
                            <textarea
                                className="entrada-dato area-texto"
                                value={motivo}
                                onChange={(evento) => setMotivo(evento.target.value)}
                                required
                                maxLength={300}
                            />
                        </label>
                        <p className="texto-ayuda">La solicitud quedará pendiente hasta que el administrador la apruebe.</p>
                        <button type="submit" className="boton-principal" disabled={enviando}>
                            {enviando ? 'Enviando…' : 'Solicitar laboratorio completo'}
                        </button>
                    </form>
                )}

                {rol === 'A' && (
                    <div className="lista-reservas-franja">
                        <h3 className="subtitulo-dialogo-seccion">Reservas en esta franja</h3>
                        {franja.reservas && franja.reservas.length > 0 ? (
                            <ul>
                                {franja.reservas.map((reserva) => (
                                    <li key={reserva.res_id} className="item-reserva-franja">
                                        <span>
                                            <strong>
                                                {reserva.usu_nombres} {reserva.usu_apellidos}
                                            </strong>
                                            <br />
                                            {TIPOS_RESERVA[reserva.res_tipo]}
                                            {reserva.equ_codigo ? ` · ${reserva.equ_codigo}` : ''}
                                            {reserva.res_asignatura ? ` · ${reserva.res_asignatura}` : ''}
                                        </span>
                                        <span className={`estado-reserva estado-reserva-${reserva.res_estado}`}>
                                            {ESTADOS_RESERVA[reserva.res_estado]}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="texto-ayuda">No hay reservas en esta franja.</p>
                        )}
                    </div>
                )}

                {error && (
                    <p className="mensaje-dialogo mensaje-error" role="alert">
                        {error}
                    </p>
                )}
                {exito && (
                    <p className="mensaje-dialogo mensaje-exito" role="status">
                        {exito}
                    </p>
                )}
            </div>
        </div>
    );
}
