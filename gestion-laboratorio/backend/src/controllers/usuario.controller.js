const usuariosService = require("../services/usuario.service");

function manejarError(res, err){
    if (err && err.status){
        return res.status(err.status).json({ error : err.message});
    }
    console.error("Error inseperado en usuario.controller: ", err);
    return res.status(500).json({error: "Error interno del servidor"});
}

async function login(req, res) {
    try{
        const {correo, password, contrasenia} = req.body || {};
        const resultado = await usuariosService.login(correo, password ?? contrasenia);
        return res.status(200).json(resultado);
    } catch (err){
        return manejarError(res, err);
    }
}
async function crearUsuario(req, res) {
    try {
        const {correo, password, contrasenia, rol, nombres, apellidos} = req.body || {};
        const usuario = await usuariosService.crearUsuario({
            correo,
            password: password ?? contrasenia,
            rol,
            nombres,
            apellidos
        });
        return res.status(201).json(usuario);
    } catch (err) {
        return manejarError(res, err)
    }
}

async function obtenerUsuarioPorId(req, res) {
    try{
        const {id} = req.params;
        const usuario = await usuariosService.obtenerUsuarioPorId(id);
        return res.status(200).json(usuario);
    } catch(err){
        return manejarError(res, ett)
    }
}

async function listarUsuarios(req, res) {
    try{
        const usuarios = await usuariosService.listarUsuarios();
        return res.status(200).json(usuario);
    } catch (err){
        return manejarError(res, err);
    }
}

module.exports = {
    login,
    crearUsuario,
    listarUsuarios,
    obtenerUsuarioPorId,
};