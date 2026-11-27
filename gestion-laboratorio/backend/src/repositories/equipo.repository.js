const { get, all, run } = require("../config/dbAsync");

async function findAll() {
    const sql = `
        SELECT equ_id, equ_codigo, equ_tipo, equ_estado, lab_id  
        FROM LAB_EQUIPOS
    `;
    return await all(sql, []);
}

async function findById(id) {
    const sql = `
        SELECT equ_id, equ_codigo, equ_tipo, equ_estado, lab_id 
        FROM LAB_EQUIPOS
        WHERE equ_id = ?
    `;
    return await get(sql, [id]);
}

module.exports = {
    findAll,
    findById,
}