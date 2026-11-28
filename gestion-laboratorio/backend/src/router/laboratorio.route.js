const express = require("express");
const laboratorioController = require("../controllers/laboratorio.controller");
const { verificarToken } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/laboratorios", verificarToken, laboratorioController.listarLaboratorios);
router.get("/laboratorios/:id", verificarToken, laboratorioController.obtenerLaboratorioPorId);
router.post("/laboratorios", verificarToken, autorizarRoles("A"), laboratorioController.crearLaboratorio);
router.post("laboratorios/:nombre", verificarToken, laboratorioController.obtenerLaboratorioPorNombre)
module.exports = router;