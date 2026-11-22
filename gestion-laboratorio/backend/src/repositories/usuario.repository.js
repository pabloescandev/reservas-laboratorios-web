const { get, all, run } = require("../database/dbAsync");

async function findByCorreo(correo) {
    const correoNormalizado = String(correo || "").trim().toLowerCase();
    const sql = `
        SELECT usu_id, usu_correo, usu_nombres, usu_apellidos, usu_contrasenia_hash, usu_estado, usu_rol, usu_fecha_creacion
        FROM LAB_USUARIO
        WHERE usu_correo = ?
    `;
    return await get(sql, [correoNormalizado]);
}

async function findById(id) {
    const sql = `
        SELECT usu_id, usu_correo, usu_nombres, usu_apellidos, usu_estado, usu_rol, usu_fecha_creacion
        FROM LAB_USUARIO
        WHERE usu_id = ?
    `;
    return await get(sql, [id]);
}

async function findAll() {
    const sql = `
        SELECT usu_id, usu_correo, usu_nombres, usu_apellidos, usu_estado, usu_rol, usu_fecha_creacion
        FROM LAB_USUARIO
    `;
    return await all(sql, []);
}

async function create({ correo, contraseniaHash, rol, nombres, apellidos, estado = 1 }) {
    const correoNormalizado = String(correo || "").trim().toLowerCase();
    const sql = `
    INSERT INTO LAB_USUARIO (usu_correo, usu_nombres, usu_apellidos, usu_contrasenia_hash, usu_estado, usu_rol)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    const result = await run(sql, [correoNormalizado, nombres, apellidos, contraseniaHash, estado, rol]);
    return {
    usu_id: result.lastID,
    usu_correo: correoNormalizado,
    usu_nombres: nombres,
    usu_apellidos: apellidos,
    usu_rol: rol,
    usu_estado: estado,
    };
}

module.exports = {
  findByCorreo,
  findById,
  findAll,
  create
};