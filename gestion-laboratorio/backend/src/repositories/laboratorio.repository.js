const { get, all, run } = require("../config/dbAsync");

async function findAll() {
    const sql = `
        SELECT lab_id, lab_nombre, lab_ubicacion, lab_aforo, lab_software_instalado, lab_foto_url, lab_estado
        FROM LAB_LABORATORIOS
    `;
    return await all(sql, []);
}

async function findById(id) {
    const sql = `
        SELECT lab_id, lab_nombre, lab_ubicacion, lab_aforo, lab_software_instalado, lab_foto_url, lab_estado
        FROM LAB_LABORATORIOS
        WHERE lab_id = ?
    `;
    return await get(sql, [id]);
}

async function findByNombre(nombre) {
    const nombreNormalizado = String(nombre || "").trim().toLocaleLowerCase()
    const sql = `
        SELECT lab_id, lab_nombre, lab_ubicacion, lab_aforo, lab_software_instalado, lab_foto_url, lab_estado
        FROM LAB_LABORATORIOS
        WHERE lab_nombre = ?
    `;
    return await get(sql, [nombreNormalizado]);
}

async function create(nombre, ubicacion, aforo, softwareInstalado = null, fotoUrl = null, estado = "D",) {
    const nombreLimpio = String(nombre).trim();
    const ubicacionLimpia = String(ubicacion).trim();
    const sql = `
        INSERT INTO LAB_LABORATORIOS (
        lab_nombre, lab_ubicacion, lab_aforo, lab_software_instalado,
        lab_foto_url, lab_estado)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await run(sql, [nombreLimpio, ubicacionLimpia, aforo, softwareInstalado,
        fotoUrl, estado,]);

    return {
        lab_id: result.lastID,
        lab_nombre: nombreLimpio,
        lab_ubicacion: ubicacionLimpia,
        lab_aforo: aforo,
        lab_software_instalado: softwareInstalado,
        lab_foto_url: fotoUrl,
        lab_estado: estado,
    };
}

module.exports = {
    findAll,
    findById,
    findByNombre,
    create,
};