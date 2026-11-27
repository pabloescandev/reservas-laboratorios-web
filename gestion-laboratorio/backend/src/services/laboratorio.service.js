const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const laboratorioRepository = require("../repositories/laboratorio.repository");

function crearError(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function listarLaboratorios() {
    return await laboratorioRepository.findAll();
}

async function obtenerLaboratorioPorId(id) {
    const laboratorio = await laboratorioRepository.findById(id);
    if (!laboratorio) {
        throw crearError("laboratorio no encontrado", 404);
    }
    return laboratorio;
}

module.exports = {
    listarLaboratorios,
    obtenerLaboratorioPorId,
}