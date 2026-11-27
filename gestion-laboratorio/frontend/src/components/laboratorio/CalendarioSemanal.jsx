import './CalendarioSemanal.css';

const NOMBRES_DIA = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

function aFecha(texto) {
    const [anio, mes, dia] = texto.split('-').map(Number);
    return new Date(anio, mes - 1, dia);
}

function formatoCorto(texto) {
    return aFecha(texto).toLocaleDateString('es-EC', { day: 'numeric', month: 'short' });
}

function textoCelda(franja) {
    if (franja.estado === 'bloqueada') {
        return franja.bloqueo?.motivo || 'Bloqueada';
    }
    if (franja.estado === 'reservada') {
        return franja.laboratorioAprobado ? 'Laboratorio reservado' : 'Sin cupos';
    }
    return `${franja.cupos.disponibles} cupos libres`;
}

export function CalendarioSemanal({ disponibilidad, franjaSeleccionada, onSeleccionarFranja, onCambiarSemana }) {
    const { semana, dias } = disponibilidad;

    const horasUnicas = [];
    dias.forEach((dia) =>
        dia.franjas.forEach((franja) => {
            const clave = `${franja.entrada}-${franja.salida}`;
            if (!horasUnicas.some((h) => h.clave === clave)) {
                horasUnicas.push({ clave, entrada: franja.entrada, salida: franja.salida });
            }
        })
    );
    horasUnicas.sort((a, b) => a.entrada.localeCompare(b.entrada));

    return (
        <section className="tarjeta-calendario" aria-label="Calendario semanal del laboratorio">
            <header className="cabecera-calendario">
                <button type="button" className="boton-semana" onClick={() => onCambiarSemana(semana.anterior)}>
                    ‹ Anterior
                </button>
                <h2 className="titulo-semana">
                    {formatoCorto(semana.inicio)} – {formatoCorto(semana.fin)} {aFecha(semana.fin).getFullYear()}
                </h2>
                <button type="button" className="boton-semana" onClick={() => onCambiarSemana(semana.siguiente)}>
                    Siguiente ›
                </button>
            </header>

            <div className="contenedor-grilla">
                <div className="grilla-semanal" style={{ gridTemplateColumns: `72px repeat(${dias.length}, minmax(110px, 1fr))` }}>
                    <div className="celda-esquina" />
                    {dias.map((dia) => (
                        <div key={dia.fecha} className="encabezado-dia">
                            <span className="nombre-dia">{NOMBRES_DIA[dia.diaSemana - 1]}</span>
                            <span className="fecha-dia">{formatoCorto(dia.fecha)}</span>
                        </div>
                    ))}

                    {horasUnicas.map((hora) => (
                        <div key={hora.clave} className="fila-contenido">
                            <div className="etiqueta-hora">
                                {hora.entrada}
                                <span>{hora.salida}</span>
                            </div>
                            {dias.map((dia) => {
                                const franja = dia.franjas.find((f) => f.entrada === hora.entrada && f.salida === hora.salida);
                                if (!franja) {
                                    return <div key={dia.fecha} className="celda-vacia" />;
                                }
                                const seleccionada =
                                    franjaSeleccionada &&
                                    franjaSeleccionada.franja.hor_id === franja.hor_id &&
                                    franjaSeleccionada.dia.fecha === dia.fecha;
                                const clases = [
                                    'celda-franja',
                                    `estado-${franja.estado}`,
                                    franja.pasada ? 'franja-pasada' : '',
                                    seleccionada ? 'franja-seleccionada' : '',
                                ].join(' ');

                                return (
                                    <button
                                        key={dia.fecha}
                                        type="button"
                                        className={clases}
                                        onClick={() => onSeleccionarFranja(dia, franja)}
                                        aria-label={`${NOMBRES_DIA[dia.diaSemana - 1]} ${franja.entrada} a ${franja.salida}: ${textoCelda(franja)}`}
                                    >
                                        <span className="texto-estado">{textoCelda(franja)}</span>
                                        {franja.miReserva && ['P', 'A'].includes(franja.miReserva.res_estado) && (
                                            <span className="insignia-mia">
                                                {franja.miReserva.res_estado === 'P' ? 'Tu solicitud' : 'Tu reserva'}
                                            </span>
                                        )}
                                        {franja.solicitudesPendientes > 0 && franja.estado === 'libre' && (
                                            <span className="insignia-pendiente">{franja.solicitudesPendientes} solicitud pendiente</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>

            <ul className="leyenda-calendario">
                <li><span className="muestra estado-libre" /> Libre</li>
                <li><span className="muestra estado-reservada" /> Reservada</li>
                <li><span className="muestra estado-bloqueada" /> Bloqueada</li>
                <li><span className="muestra franja-pasada" /> Ya pasó</li>
            </ul>
        </section>
    );
}
