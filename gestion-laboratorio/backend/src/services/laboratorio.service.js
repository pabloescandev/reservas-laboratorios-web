const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const laboratorioRepository = require("../repositories/laboratorio.Repository");

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