const horarioService = require("../services/horario.service");

function manejarError(res, err){
    if (err && err.status){
        return res.status(err.status).json({ error : err.message});
    }
    console.error("Error inseperado en horario.controller: ", err);
    return res.status(500).json({error: "Error interno del servidor"});
}

async function listarHorarios(req, res) {
    try{
        const horarios = await horarioService.listarHorarios();
        return res.status(200).json(horarios);
    } catch (err){
        return manejarError(res, err);
    }
}

async function obtenerHorarioPorId(req, res) {
    try{
        const {id} = req.params;
        const horario = await horarioService.obtenerHorarioPorId(id);
        return res.status(200).json(horario);
    } catch(err){
        return manejarError(res, err);
    }
}

module.exports = {
    listarHorarios,
    obtenerHorarioPorId,
}