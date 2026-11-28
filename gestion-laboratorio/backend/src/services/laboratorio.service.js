const laboratorioRepository = require("../repositories/laboratorio.repository");

const ESTADOS_VALIDOS = ["D", "M"];

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

async function obtenerLaboratorioPorNombre(nombre) {
    const laboratorio = await laboratorioRepository.findByNombre(nombre);
    if (!laboratorio) {
        throw crearError("laboratorio no encontrado", 404);
    }
    return laboratorio;
}

async function crearLaboratorio({
    nombre,
    ubicacion,
    aforo,
    softwareInstalado = null,
    fotoUrl = null,
    estado = "D",
}) {
    const nombreLimpio = String(nombre || "").trim();
    const ubicacionLimpia = String(ubicacion || "").trim();
    const aforoNum = Number(aforo);

    if (!nombreLimpio || !ubicacionLimpia) {
        throw crearError("Nombre y ubicación son obligatorios", 400);
    }

    if (!Number.isInteger(aforoNum) || aforoNum <= 0) {
        throw crearError("El aforo debe ser un número entero mayor que 0", 400);
    }

    if (!ESTADOS_VALIDOS.includes(estado)) {
        throw crearError("Estado inválido. Use D o M", 400);
    }

    const existente = await laboratorioRepository.findByNombre(nombreLimpio);
    if (existente) {
        throw crearError("Ya existe un laboratorio con ese nombre", 409);
    }

    const softwareLimpio =
        softwareInstalado !== null && softwareInstalado !== undefined && String(softwareInstalado).trim() !== ""
            ? String(softwareInstalado).trim()
            : null;

    const fotoLimpia =
        fotoUrl !== null && fotoUrl !== undefined && String(fotoUrl).trim() !== ""
            ? String(fotoUrl).trim()
            : null;

    return await laboratorioRepository.create({
        nombre: nombreLimpio,
        ubicacion: ubicacionLimpia,
        aforo: aforoNum,
        softwareInstalado: softwareLimpio,
        fotoUrl: fotoLimpia,
        estado,
    });
}

module.exports = {
    listarLaboratorios,
    obtenerLaboratorioPorId,
    obtenerLaboratorioPorNombre,
    crearLaboratorio,
};