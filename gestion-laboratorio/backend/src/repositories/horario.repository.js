const { get, all, run } = require("../config/dbAsync");

async function findall() {
    const sql = `
        SELECT hor_id, hor_dia_semana, hor_entrada,  hor_salida, lab_id
        FROM LAB_HORARIOS
    `;
    return await all(sql, []);
}

async function findById(id) {
    const sql = `
        SELECT hor_id, hor_dia_semana, hor_entrada,  hor_salida, lab_id
        FROM LAB_HORARIOS
        WHERE hor_id = ?
    `;
    return await all(sql, [id]);
}