const reservaService = require("../services/reserva.service");

function manejarError(res, err) {
    if (err && err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error("Error inesperado en reserva.controller: ", err);
    return res.status(500).json({ error: "Error interno del servidor" });
}

function aNumero(valor) {
    return valor === undefined || valor === null || valor === "" ? undefined : Number(valor);
}

async function solicitarLaboratorio(req, res) {
    try {
        const { horId, fecha, asignatura, motivo } = req.body || {};
        const reserva = await reservaService.solicitarLaboratorio(req.user, {
            horId: aNumero(horId),
            fecha,
            asignatura,
            motivo,
        });
        return res.status(201).json(reserva);
    } catch (err) {
        return manejarError(res, err);
    }
}

async function reservarPuesto(req, res) {
    try {
        const { horId, fecha, equId, motivo } = req.body || {};
        const reserva = await reservaService.reservarPuesto(req.user, {
            horId: aNumero(horId),
            fecha,
            equId: aNumero(equId),
            motivo,
        });
        return res.status(201).json(reserva);
    } catch (err) {
        return manejarError(res, err);
    }
}

async function listarReservas(req, res) {
    try {
        const { labId, estado } = req.query;
        const reservas = await reservaService.listarReservas(req.user, {
            labId: aNumero(labId),
            estado,
        });
        return res.status(200).json(reservas);
    } catch (err) {
        return manejarError(res, err);
    }
}

async function obtenerReserva(req, res) {
    try {
        const reserva = await reservaService.obtenerReserva(req.user, aNumero(req.params.id));
        return res.status(200).json(reserva);
    } catch (err) {
        return manejarError(res, err);
    }
}

async function responderSolicitud(req, res) {
    try {
        const { decision, mensaje } = req.body || {};
        const reserva = await reservaService.responderSolicitud(req.user, aNumero(req.params.id), {
            decision,
            mensaje,
        });
        return res.status(200).json(reserva);
    } catch (err) {
        return manejarError(res, err);
    }
}

async function cancelarReserva(req, res) {
    try {
        const reserva = await reservaService.cancelarReserva(req.user, aNumero(req.params.id));
        return res.status(200).json(reserva);
    } catch (err) {
        return manejarError(res, err);
    }
}

module.exports = {
    solicitarLaboratorio,
    reservarPuesto,
    listarReservas,
    obtenerReserva,
    responderSolicitud,
    cancelarReserva,
};
