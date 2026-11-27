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

module.exports = {
    findAll,
    findById,
}