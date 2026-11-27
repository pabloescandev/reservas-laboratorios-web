const horarioRepository = require("../repositories/horario.repository");

function crearError(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function listarHorarios() {
    return await horarioRepository.findAll();
}

async function obtenerHorarioPorId(id) {
    const horario = await horarioRepository.findById(id);
    if (!horario) {
        throw crearError("laboratorio no encontrado", 404);
    }
    return horario;
}

module.exports = {
    listarHorarios,
    obtenerHorarioPorId,
}   