const laboratorioService = require("../services/laboratorio.service");

function manejarError(res, err){
    if (err && err.status){
        return res.status(err.status).json({ error : err.message});
    }
    console.error("Error inseperado en laboratorio.controller: ", err);
    return res.status(500).json({error: "Error interno del servidor"});
}

async function listarLaboratorios(req, res) {
    try{
        const laboratorios = await laboratorioService.listarLaboratorios();
        return res.status(200).json(laboratorios);
    } catch (err){
        return manejarError(res, err);
    }
}

async function obtenerLaboratorioPorId(req, res) {
    try{
        const {id} = req.params;
        const laboratorio = await laboratorioService.obtenerLaboratorioPorId(id);
        return res.status(200).json(laboratorio);
    } catch(err){
        return manejarError(res, err);
    }
}

module.exports = {
    listarLaboratorios,
    obtenerLaboratorioPorId,
}