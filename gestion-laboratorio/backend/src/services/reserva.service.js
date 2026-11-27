const reservaRepository = require("../repositories/reserva.repository");

const ROL_ADMIN = "A";
const ROL_DOCENTE = "D";
const ROL_ESTUDIANTE = "E";

function crearError(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

function dosDigitos(numero) {
    return String(numero).padStart(2, "0");
}

function ahoraTexto() {
    const ahora = new Date();
    const fecha = `${ahora.getFullYear()}-${dosDigitos(ahora.getMonth() + 1)}-${dosDigitos(ahora.getDate())}`;
    const hora = `${dosDigitos(ahora.getHours())}:${dosDigitos(ahora.getMinutes())}`;
    return `${fecha} ${hora}`;
}

function esFechaValida(fecha) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha || "")) return false;
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const fechaReal = new Date(anio, mes - 1, dia);
    return fechaReal.getFullYear() === anio && fechaReal.getMonth() === mes - 1 && fechaReal.getDate() === dia;
}

function diaSemanaIso(fecha) {
    const [anio, mes, dia] = fecha.split("-").map(Number);
    const diaJs = new Date(anio, mes - 1, dia).getDay();
    return diaJs === 0 ? 7 : diaJs;
}

function yaEmpezo(fecha, horaEntrada) {
    return `${fecha} ${horaEntrada}` <= ahoraTexto();
}

async function validarFranja({ horId, fecha }) {
    if (!horId || !fecha) {
        throw crearError("La franja y la fecha son obligatorias", 400);
    }
    if (!esFechaValida(fecha)) {
        throw crearError("Fecha inválida. Use el formato YYYY-MM-DD", 400);
    }

    const horario = await reservaRepository.findHorarioConLaboratorio(horId);
    if (!horario) {
        throw crearError("La franja no existe", 404);
    }
    if (diaSemanaIso(fecha) !== horario.hor_dia_semana) {
        throw crearError("La fecha no corresponde al día de la semana de la franja", 400);
    }
    if (yaEmpezo(fecha, horario.hor_entrada)) {
        throw crearError("No se puede reservar una franja pasada o que ya empezó", 400);
    }
    if (horario.lab_estado === "M") {
        throw crearError("El laboratorio está en mantenimiento", 409);
    }

    const bloqueos = await reservaRepository.findBloqueosQueCubren({
        labId: horario.lab_id,
        fecha,
        diaSemana: horario.hor_dia_semana,
        entrada: horario.hor_entrada,
        salida: horario.hor_salida,
    });
    if (bloqueos.length > 0) {
        throw crearError(`La franja está bloqueada: ${bloqueos[0].blo_motivo || "sin motivo"}`, 409);
    }

    return horario;
}

async function guardarReserva(datos) {
    try {
        return await reservaRepository.create(datos);
    } catch (err) {
        if (String(err.message).includes("UNIQUE")) {
            throw crearError("Ya existe una reserva activa que choca con esta", 409);
        }
        throw err;
    }
}

async function solicitarLaboratorio(usuario, { horId, fecha, asignatura, motivo }) {
    if (usuario.rol !== ROL_DOCENTE) {
        throw crearError("Solo un docente puede solicitar el laboratorio completo", 403);
    }
    const asignaturaLimpia = String(asignatura || "").trim();
    const motivoLimpio = String(motivo || "").trim();
    if (!asignaturaLimpia || !motivoLimpio) {
        throw crearError("La asignatura y el motivo son obligatorios", 400);
    }

    const horario = await validarFranja({ horId, fecha });

    if (await reservaRepository.existsLaboratorioAprobado(horId, fecha)) {
        throw crearError("El laboratorio ya está reservado completo en esa franja", 409);
    }
    if (await reservaRepository.existsReservaActivaUsuario(usuario.sub, horId, fecha)) {
        throw crearError("Ya tienes una reserva activa en esa franja", 409);
    }

    const resId = await guardarReserva({
        tipo: "L",
        fecha,
        aforo: horario.lab_aforo,
        asignatura: asignaturaLimpia,
        motivo: motivoLimpio,
        estado: "P",
        usuId: usuario.sub,
        horId,
    });
    return await reservaRepository.findById(resId);
}

async function reservarPuesto(usuario, { horId, fecha, equId, motivo }) {
    if (usuario.rol !== ROL_ESTUDIANTE) {
        throw crearError("Solo un estudiante puede reservar un puesto o un equipo", 403);
    }

    const horario = await validarFranja({ horId, fecha });

    if (await reservaRepository.existsLaboratorioAprobado(horId, fecha)) {
        throw crearError("Un docente tiene reservado el laboratorio completo en esa franja", 409);
    }

    const ocupado = await reservaRepository.sumAforoEstudiantes(horId, fecha);
    if (ocupado + 1 > horario.lab_aforo) {
        throw crearError("No hay cupos disponibles en esa franja", 409);
    }

    if (equId) {
        const equipo = await reservaRepository.findEquipo(equId);
        if (!equipo) {
            throw crearError("El equipo no existe", 404);
        }
        if (equipo.lab_id !== horario.lab_id) {
            throw crearError("El equipo no pertenece a este laboratorio", 400);
        }
        if (equipo.equ_estado !== "O") {
            throw crearError("El equipo no está operativo", 409);
        }
        if (await reservaRepository.existsReservaActivaEquipo(equId, horId, fecha)) {
            throw crearError("El equipo ya está reservado en esa franja", 409);
        }
    }

    if (await reservaRepository.existsReservaActivaUsuario(usuario.sub, horId, fecha)) {
        throw crearError("Ya tienes una reserva activa en esa franja", 409);
    }

    const resId = await guardarReserva({
        tipo: equId ? "E" : "P",
        fecha,
        aforo: 1,
        motivo: String(motivo || "").trim() || null,
        estado: "A",
        usuId: usuario.sub,
        horId,
        equId: equId || null,
    });
    return await reservaRepository.findById(resId);
}

async function finalizarVencidas() {
    return await reservaRepository.finalizarVencidas(ahoraTexto());
}

async function listarReservas(usuario, { labId, estado } = {}) {
    await finalizarVencidas();
    if (usuario.rol === ROL_ADMIN) {
        return await reservaRepository.findAll({ labId, estado });
    }
    return await reservaRepository.findAll({ usuId: usuario.sub, labId, estado });
}

async function obtenerReserva(usuario, resId) {
    await finalizarVencidas();
    const reserva = await reservaRepository.findById(resId);
    if (!reserva) {
        throw crearError("La reserva no existe", 404);
    }
    if (usuario.rol !== ROL_ADMIN && reserva.usu_id !== usuario.sub) {
        throw crearError("No puedes ver una reserva de otro usuario", 403);
    }
    return reserva;
}

async function responderSolicitud(usuario, resId, { decision, mensaje }) {
    if (usuario.rol !== ROL_ADMIN) {
        throw crearError("Solo el administrador puede responder solicitudes", 403);
    }
    if (!["A", "R"].includes(decision)) {
        throw crearError("Decisión inválida. Use A (aprobar) o R (rechazar)", 400);
    }
    const mensajeLimpio = String(mensaje || "").trim();
    if (mensajeLimpio.length < 3) {
        throw crearError("El mensaje de respuesta debe tener al menos 3 caracteres", 400);
    }

    const reserva = await reservaRepository.findById(resId);
    if (!reserva) {
        throw crearError("La reserva no existe", 404);
    }
    if (reserva.res_tipo !== "L") {
        throw crearError("Solo se responden solicitudes de laboratorio completo", 400);
    }
    if (reserva.res_estado !== "P") {
        throw crearError("Solo se pueden responder solicitudes pendientes", 409);
    }

    if (decision === "A") {
        await validarFranja({ horId: reserva.hor_id, fecha: reserva.res_fecha });

        if (await reservaRepository.existsLaboratorioAprobado(reserva.hor_id, reserva.res_fecha)) {
            throw crearError("Ya hay otra solicitud aprobada en esa franja", 409);
        }
        const ocupado = await reservaRepository.sumAforoEstudiantes(reserva.hor_id, reserva.res_fecha);
        if (ocupado > 0) {
            throw crearError(`No se puede aprobar: hay ${ocupado} reserva(s) de estudiantes en esa franja`, 409);
        }
    }

    await reservaRepository.updateEstado(resId, {
        estado: decision,
        mensaje: mensajeLimpio,
        revisorId: usuario.sub,
    });
    return await reservaRepository.findById(resId);
}

async function cancelarReserva(usuario, resId) {
    const reserva = await reservaRepository.findById(resId);
    if (!reserva) {
        throw crearError("La reserva no existe", 404);
    }
    if (usuario.rol !== ROL_ADMIN && reserva.usu_id !== usuario.sub) {
        throw crearError("No puedes cancelar una reserva de otro usuario", 403);
    }
    if (!["P", "A"].includes(reserva.res_estado)) {
        throw crearError("Solo se pueden cancelar reservas pendientes o aprobadas", 409);
    }
    if (yaEmpezo(reserva.res_fecha, reserva.hor_entrada)) {
        throw crearError("No se puede cancelar una reserva que ya empezó", 409);
    }

    await reservaRepository.updateEstado(resId, { estado: "C" });
    return await reservaRepository.findById(resId);
}

module.exports = {
    solicitarLaboratorio,
    reservarPuesto,
    listarReservas,
    obtenerReserva,
    responderSolicitud,
    cancelarReserva,
    finalizarVencidas,
};
