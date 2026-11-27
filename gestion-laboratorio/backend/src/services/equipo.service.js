const equiposRepository = require("../repositories/equipo.repository");

function crearError(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function listarEquipos() {
    return await equiposRepository.findAll();
}

async function obtenerEquipoPorId(id) {
    const equipo = await equiposRepository.findById(id);
    if (!equipo) {
        throw crearError("Equipo no encontrado", 404);
    }
    return equipo;
}

module.exports = {
    listarEquipos,
    obtenerEquipoPorId,
}