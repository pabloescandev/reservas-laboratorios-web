const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuarioRepository = require("../repositories/usuario.repository");

const ROLES_VALIDOS = ["A", "D", "E"];

function crearError(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

async function login(correo, password) {

    if (!correo || !password) {
        throw crearError("Correo y contraseña requeridos", 400);
    }

    const usuario = await usuarioRepository.findByCorreo(correo);
    if (!usuario || usuario.usu_estado !== 1) {
        throw crearError("Credenciales inválidas", 401);
    }

    const passwordValida = await bcrypt.compare(password, usuario.usu_contrasenia_hash);
    if (!passwordValida) {
        throw crearError("Credenciales inválidas", 401);
    }

    const payload = {
        sub: usuario.usu_id,
        rol: usuario.usu_rol,
        correo: usuario.usu_correo,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "8h",
    });

  return {
    token,
    usuario: {
      usu_id: usuario.usu_id,
      usu_correo: usuario.usu_correo,
      usu_rol: usuario.usu_rol,
      usu_nombres: usuario.usu_nombres,
      usu_apellidos: usuario.usu_apellidos,
      usu_estado: usuario.usu_estado,
    },
  };
}

async function crearUsuario({ correo, password, rol, nombres, apellidos }) {
  if (!correo || !password || !rol || !nombres || !apellidos) {
    throw crearError("Todos los campos son obligatorios", 400);
  }

  if (!ROLES_VALIDOS.includes(rol)) {
    throw crearError("Rol inválido. Use A, D o E", 400);
  }

  const existente = await usuarioRepository.findByCorreo(correo);
  if (existente) {
    throw crearError("El correo ya está registrado", 409);
  }

  const contraseniaHash = await bcrypt.hash(password, 10);

  return await usuarioRepository.create({
    correo,
    contraseniaHash,
    rol,
    nombres: String(nombres).trim(),
    apellidos: String(apellidos).trim(),
    estado: 1,
  });
}

async function listarUsuarios() {
    return await usuarioRepository.findAll();
}

async function obtenerUsuarioPorId(id) {
    const usuario = await usuarioRepository.findById(id);
    if (!usuario) {
        throw crearError("Usuario no encontrado", 404);
    }
    return usuario;
}

module.exports = {
    login,
    crearUsuario,
    listarUsuarios,
    obtenerUsuarioPorId,
};