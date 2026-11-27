const express = require("express");
const usuarioController = require("../controllers/usuario.controller");
const {verificarToken, autorizarRoles } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/auth/login", usuarioController.login);

router.get("/usuarios", verificarToken, autorizarRoles('A'), usuarioController.listarUsuarios);
router.get("/usuarios/:id", verificarToken, autorizarRoles('A'), usuarioController.obtenerUsuarioPorId);
router.post("/usuarios", verificarToken, autorizarRoles('A'), usuarioController.crearUsuario);

module.exports = router;    