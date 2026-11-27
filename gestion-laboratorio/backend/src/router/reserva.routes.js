const express = require("express");
const reservaController = require("../controllers/reserva.controller");
const { verificarToken, autorizarRoles } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/reservas/disponibilidad", verificarToken, reservaController.obtenerDisponibilidadSemanal);
router.get("/reservas", verificarToken, reservaController.listarReservas);
router.get("/reservas/:id", verificarToken, reservaController.obtenerReserva);

router.post("/reservas/laboratorio", verificarToken, autorizarRoles("D"), reservaController.solicitarLaboratorio);
router.post("/reservas/puesto", verificarToken, autorizarRoles("E"), reservaController.reservarPuesto);

router.patch("/reservas/:id/respuesta", verificarToken, autorizarRoles("A"), reservaController.responderSolicitud);
router.patch("/reservas/:id/cancelar", verificarToken, reservaController.cancelarReserva);

module.exports = router;
