const express = require("express");
const equipoController = require("../controllers/equipo.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/equipos", verificarToken, equipoController.listarEquipos);
router.get("/equipos/:id", verificarToken, equipoController.obtenerEquipoPorId);

module.exports = router;