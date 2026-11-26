const express = require("express");
const usuarioController = require("../controllers/usuario.controller");
const router = express.Router();

router.post("/auth/login", usuarioController.login);

router.get("/usuarios", usuarioController.listarUsuarios);
router.get("/usuarios/:id", usuarioController.obtenerUsuarioPorId);
router.post("/usuarios", usuarioController.crearUsuario);

module.exports = router;