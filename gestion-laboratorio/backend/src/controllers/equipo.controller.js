const equiposService = require("../services/equipos.service");

function manejarError(res, err){
    if (err && err.status){
        return res.status(err.status).json({ error : err.message});
    }
    console.error("Error inseperado en equipos.controller: ", err);
    return res.status(500).json({error: "Error interno del servidor"});
}

async function listarEquipos(req, res) {
    try{
        const equipos = await equiposService.listarEquipos();
        return res.status(200).json(equipos);
    } catch (err){
        return manejarError(res, err);
    }
}

async function obtenerEquipoPorId(req, res) {
    try{
        const{id} = req.params;
        const equipo = await equiposService.obtenerEquipoPorId(id);
        return res.status(200).json(equipo);
    } catch(err){
        return manejarError(res, err);
    }
}

module.exports = {
    listarEquipos,
    obtenerEquipoPorId,
}