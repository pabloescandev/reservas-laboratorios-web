const express = require("express");
const horarioController = require("../controllers/horario.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/laboratorios", verificarToken, horarioController.listarHorarios);
router.get("/laboratorios/:id", verificarToken, horarioController.obtenerHorarioPorId);

module.exports = router;