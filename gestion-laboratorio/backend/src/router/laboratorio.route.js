const express = require("express");
const laboratorioController = require("../controllers/laboratorio.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/laboratorios", verificarToken, laboratorioController.listarLaboratorios);
router.get("/laboratorios/:id", verificarToken, laboratorioController.obtenerLaboratorioPorId);

module.exports = router;