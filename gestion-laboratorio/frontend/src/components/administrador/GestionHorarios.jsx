import { useState } from 'react';
import './GestionHorarios.css';

export function GestionHorarios() {
    const fechaMinimaHoy = new Date().toISOString().split('T')[0];

    const laboratorios = [
        { id: 1, nombre: 'Lab. de Redes y Telemática' },
        { id: 2, nombre: 'Lab. de Electrónica Digital' },
        { id: 3, nombre: 'Lab. de Cómputo 1' },
    ];

    // Mapeo entre el texto visible y el número que guarda tu BD
    const diasOpciones = [
        { numero: 1, nombre: 'Lunes' },
        { numero: 2, nombre: 'Martes' },
        { numero: 3, nombre: 'Miércoles' },
        { numero: 4, nombre: 'Jueves' },
        { numero: 5, nombre: 'Viernes' },
        { numero: 6, nombre: 'Sábado' },
    ];

    const [labSeleccionado, setLabSeleccionado] = useState(1);

    // Registros de ejemplo
    const horariosBD = [
        {
            id: 1,
            idLaboratorio: 1,
            diaSemana: 1,
            entrada: '07:00',
            salida: '13:00',
            fechaBloqueo: null,
            bloqueo: null,
        },
        {
            id: 2,
            idLaboratorio: 1,
            diaSemana: 2,
            entrada: '09:00',
            salida: '16:00',
            fechaBloqueo: '2026-12-01',
            bloqueo: '09:00',
        },
        {
            id: 3,
            idLaboratorio: 2,
            diaSemana: 4,
            entrada: '08:00',
            salida: '17:00',
            fechaBloqueo: null,
            bloqueo: null,
        },
    ];

    const franjasCalendario = [
        '07:00 - 09:00',
        '09:00 - 11:00',
        '11:00 - 13:00',
        '14:00 - 16:00',
        '16:00 - 18:00',
    ];

    const agendaVisualEjemplo = {
        1: {
            '1-07:00 - 09:00': { estado: 'Libre', detalle: 'Atención abierta' },
            '1-09:00 - 11:00': { estado: 'Libre', detalle: 'Atención abierta' },
            '1-11:00 - 13:00': { estado: 'Reservada', detalle: 'Doc. Luis Enrique' },
            '2-09:00 - 11:00': { estado: 'Bloqueada', detalle: 'Bloqueo 2026-12-01' },
            '2-14:00 - 16:00': { estado: 'Libre', detalle: 'Atención abierta' },
        },
        2: {
            '4-09:00 - 11:00': { estado: 'Libre', detalle: 'Atención abierta' },
            '4-14:00 - 16:00': { estado: 'Reservada', detalle: 'Práctica Circuitos' },
        },
    };

    function handleGuardarHorario(e) {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(e.target).entries());

        if (datos.entrada >= datos.salida) {
            alert('La hora de salida debe ser mayor que la hora de entrada.');
            return;
        }

        // Transformamos los tipos para que coincidan con la tabla de BD
        const registroHorario = {
            idLaboratorio: Number(datos.idLaboratorio),
            diaSemana: Number(datos.diaSemana),
            entrada: datos.entrada,
            salida: datos.salida,
            fechaBloqueo: datos.fechaBloqueo || null,
            bloqueo: datos.bloqueo || null,
        };

        console.log('Listo para insertar en tabla Horarios:', registroHorario);
    }

    function obtenerNombreDia(numeroDia) {
        const encontrado = diasOpciones.find((d) => d.numero === numeroDia);
        return encontrado ? encontrado.nombre : `Día ${numeroDia}`;
    }

    function obtenerEstiloCelda(bloque) {
        if (!bloque) return 'celda-bloque bloque-sin-atencion';
        if (bloque.estado === 'Libre') return 'celda-bloque bloque-libre';
        if (bloque.estado === 'Reservada') return 'celda-bloque bloque-reservada';
        return 'celda-bloque bloque-bloqueada';
    }

    const horariosFiltrados = horariosBD.filter(
        (h) => h.idLaboratorio === labSeleccionado
    );
    const agendaActual = agendaVisualEjemplo[labSeleccionado] || {};

    return (
        <div className="contenedor-horarios">
            {/* 1. Formulario mapeado directamente a los campos de la BD */}
            <form className="tarjeta-config-horario" onSubmit={handleGuardarHorario}>
                <div className="encabezado-tarjeta">
                    <h2 className="titulo-horario">
                        Definir horario y bloqueos de laboratorio
                    </h2>
                </div>

                <p className="subtitulo-seccion">1. Horario base de atención</p>
                <div className="fila-campos-horario">
                    <div className="campo-horario">
                        <label className="etiqueta-horario" htmlFor="lab-horario">
                            Laboratorio:
                        </label>
                        <select
                            id="lab-horario"
                            name="idLaboratorio"
                            className="selector-horario"
                            value={labSeleccionado}
                            onChange={(e) => setLabSeleccionado(Number(e.target.value))}
                            required
                        >
                            {laboratorios.map((lab) => (
                                <option key={lab.id} value={lab.id}>
                                    {lab.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-horario">
                        <label className="etiqueta-horario" htmlFor="dia-semana">
                            Día de la semana:
                        </label>
                        <select
                            id="dia-semana"
                            name="diaSemana"
                            className="selector-horario"
                            required
                        >
                            {diasOpciones.map((dia) => (
                                <option key={dia.numero} value={dia.numero}>
                                    {dia.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="campo-horario">
                        <label className="etiqueta-horario" htmlFor="hora-entrada">
                            Hora de entrada:
                        </label>
                        <input
                            id="hora-entrada"
                            name="entrada"
                            type="time"
                            className="caja-horario"
                            required
                        />
                    </div>

                    <div className="campo-horario">
                        <label className="etiqueta-horario" htmlFor="hora-salida">
                            Hora de salida:
                        </label>
                        <input
                            id="hora-salida"
                            name="salida"
                            type="time"
                            className="caja-horario"
                            required
                        />
                    </div>
                </div>

                <p className="subtitulo-seccion">
                    2. Bloqueo puntual (Opcional - dejar vacío si no hay bloqueo)
                </p>
                <div className="fila-campos-horario">
                    <div className="campo-horario">
                        <label className="etiqueta-horario" htmlFor="fecha-bloqueo">
                            Fecha de bloqueo:
                        </label>
                        <input
                            id="fecha-bloqueo"
                            name="fechaBloqueo"
                            type="date"
                            min={fechaMinimaHoy}
                            className="caja-horario caja-bloqueo-opcional"
                        />
                        <span className="texto-ayuda">
                            Día específico en que se suspende la atención
                        </span>
                    </div>

                    <div className="campo-horario">
                        <label className="etiqueta-horario" htmlFor="hora-bloqueo">
                            Hora de bloqueo:
                        </label>
                        <input
                            id="hora-bloqueo"
                            name="bloqueo"
                            type="time"
                            className="caja-horario caja-bloqueo-opcional"
                        />
                        <span className="texto-ayuda">
                            Hora en la que inicia el bloqueo en esa fecha
                        </span>
                    </div>
                </div>

                <button type="submit" className="boton-guardar-horario">
                    Guardar configuración
                </button>
            </form>

            {/* 2. Tabla de registros configurados para el laboratorio seleccionado */}
            <section className="tarjeta-tabla-horarios">
                <div className="encabezado-tarjeta">
                    <h2 className="titulo-horario">Horarios registrados del laboratorio</h2>
                </div>

                <table className="tabla-bd-horarios">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Día (BD)</th>
                            <th>Entrada</th>
                            <th>Salida</th>
                            <th>Fecha bloqueo</th>
                            <th>Hora bloqueo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {horariosFiltrados.length > 0 ? (
                            horariosFiltrados.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>
                                        {obtenerNombreDia(item.diaSemana)} ({item.diaSemana})
                                    </td>
                                    <td>{item.entrada}</td>
                                    <td>{item.salida}</td>
                                    <td>{item.fechaBloqueo || '—'}</td>
                                    <td>{item.bloqueo || '—'}</td>
                                    <td>
                                        {item.fechaBloqueo ? (
                                            <span className="badge-bloqueo">Con bloqueo</span>
                                        ) : (
                                            <span className="badge-sin-bloqueo">Normal</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7}>
                                    No hay horarios registrados aún para este laboratorio.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>

            {/* 3. Vista de calendario semanal */}
            <section className="tarjeta-calendario">
                <div className="encabezado-tarjeta">
                    <h2 className="titulo-horario">Calendario semanal de disponibilidad</h2>
                </div>

                <div className="controles-calendario">
                    <div className="campo-horario selector-lab-calendario">
                        <label className="etiqueta-horario" htmlFor="ver-lab-calendario">
                            Visualizar laboratorio:
                        </label>
                        <select
                            id="ver-lab-calendario"
                            className="selector-horario"
                            value={labSeleccionado}
                            onChange={(e) => setLabSeleccionado(Number(e.target.value))}
                        >
                            {laboratorios.map((lab) => (
                                <option key={lab.id} value={lab.id}>
                                    {lab.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="leyenda-estados">
                        <span className="item-leyenda">
                            <span className="punto-estado punto-libre" /> Libre
                        </span>
                        <span className="item-leyenda">
                            <span className="punto-estado punto-reservada" /> Reservada
                        </span>
                        <span className="item-leyenda">
                            <span className="punto-estado punto-bloqueada" /> Bloqueada
                        </span>
                    </div>
                </div>

                <div className="contenedor-tabla-semanal">
                    <table className="tabla-semanal">
                        <thead>
                            <tr>
                                <th>Horario</th>
                                {diasOpciones.map((dia) => (
                                    <th key={dia.numero}>{dia.nombre}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {franjasCalendario.map((franja) => (
                                <tr key={franja}>
                                    <td className="columna-hora">{franja}</td>
                                    {diasOpciones.map((dia) => {
                                        const clave = `${dia.numero}-${franja}`;
                                        const bloque = agendaActual[clave];

                                        return (
                                            <td key={clave}>
                                                <div className={obtenerEstiloCelda(bloque)}>
                                                    {bloque ? (
                                                        <>
                                                            <span className="titulo-bloque">{bloque.estado}</span>
                                                            <span className="detalle-bloque">{bloque.detalle}</span>
                                                        </>
                                                    ) : (
                                                        <span className="detalle-bloque">Sin atención</span>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}