require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("../config/db");

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

function exec(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

function formatearFecha(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function diaSemanaIso(fecha) {
  const dia = fecha.getDay();
  return dia === 0 ? 7 : dia;
}

function sumarDias(fecha, dias) {
  const copia = new Date(fecha);
  copia.setDate(copia.getDate() + dias);
  return copia;
}

function proximoDia(diaSemana) {
  const hoy = new Date();
  const diferencia = (diaSemana - diaSemanaIso(hoy) + 7) % 7 || 7;
  return formatearFecha(sumarDias(hoy, diferencia));
}

function anteriorDia(diaSemana) {
  const hoy = new Date();
  const diferencia = (diaSemanaIso(hoy) - diaSemana + 7) % 7 || 7;
  return formatearFecha(sumarDias(hoy, -diferencia));
}

const LUNES = 1;
const MARTES = 2;
const MIERCOLES = 3;
const JUEVES = 4;
const VIERNES = 5;

const FRANJAS = [
  ["07:00", "09:00"],
  ["09:00", "11:00"],
  ["11:00", "13:00"],
  ["14:00", "16:00"],
  ["16:00", "18:00"],
];

async function limpiarTablas() {
  await exec(`
    DELETE FROM LAB_NOTIFICACIONES;
    DELETE FROM LAB_INCIDENCIAS;
    DELETE FROM LAB_RESERVAS;
    DELETE FROM LAB_BLOQUEOS;
    DELETE FROM LAB_HORARIOS;
    DELETE FROM LAB_EQUIPOS;
    DELETE FROM LAB_LABORATORIOS;
    DELETE FROM LAB_USUARIO;
    DELETE FROM sqlite_sequence;
  `);
}

async function insertarUsuarios() {
  const usuarios = [
    ["admin@ups.edu.ec", "Admin123", "A", "Carlos Andrés", "Vega Molina"],
    ["docente@ups.edu.ec", "Docente123", "D", "María Fernanda", "Ortiz Salazar"],
    ["estudiante1@est.ups.edu.ec", "Estudiante123", "E", "Luis Alberto", "Pérez Torres"],
    ["estudiante2@est.ups.edu.ec", "Estudiante123", "E", "Ana Lucía", "Guzmán Vera"],
  ];

  const ids = [];
  for (const [correo, contrasenia, rol, nombres, apellidos] of usuarios) {
    const hash = bcrypt.hashSync(contrasenia, 10);
    const id = await run(
      `INSERT INTO LAB_USUARIO (usu_correo, usu_contrasenia_hash, usu_rol, usu_nombres, usu_apellidos)
       VALUES (?, ?, ?, ?, ?)`,
      [correo, hash, rol, nombres, apellidos]
    );
    ids.push(id);
  }

  const [admin, docente, estudiante1, estudiante2] = ids;
  return { admin, docente, estudiante1, estudiante2 };
}

async function insertarLaboratorios() {
  const computo7 = await run(
    `INSERT INTO LAB_LABORATORIOS (lab_nombre, lab_ubicacion, lab_aforo, lab_software_instalado, lab_foto_url, lab_estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Laboratorio de cómputo #7",
      "Bloque B, segundo piso",
      30,
      "Visual Studio Code, Node.js, Git, DBeaver, Oracle SQL Developer",
      "/img/labs/computo7.jpg",
      "D",
    ]
  );

  const embebidos = await run(
    `INSERT INTO LAB_LABORATORIOS (lab_nombre, lab_ubicacion, lab_aforo, lab_software_instalado, lab_foto_url, lab_estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      "Laboratorio de Sistemas Embebidos",
      "Bloque C, primer piso",
      20,
      "Vivado, Arduino IDE, MATLAB",
      "/img/labs/embebidos.jpg",
      "D",
    ]
  );

  const fisica = await run(
    `INSERT INTO LAB_LABORATORIOS (lab_nombre, lab_ubicacion, lab_aforo, lab_software_instalado, lab_foto_url, lab_estado)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ["Laboratorio de física", "Bloque A, planta baja", 25, null, "/img/labs/fisica.jpg", "M"]
  );

  return { computo7, embebidos, fisica };
}

async function insertarEquipos(labs) {
  const equipos = [
    ["C7-PC01", "Computador de escritorio", "O", labs.computo7],
    ["C7-PC02", "Computador de escritorio", "O", labs.computo7],
    ["C7-PC03", "Computador de escritorio", "D", labs.computo7],
    ["C7-PC04", "Computador de escritorio", "O", labs.computo7],
    ["C7-PRO01", "Proyector", "O", labs.computo7],
    ["EMB-FPGA01", "Tarjeta FPGA Nexys 4 DDR", "O", labs.embebidos],
    ["EMB-FPGA02", "Tarjeta FPGA Nexys 4 DDR", "O", labs.embebidos],
    ["EMB-OSC01", "Osciloscopio digital", "R", labs.embebidos],
    ["EMB-PC01", "Computador de escritorio", "O", labs.embebidos],
    ["EMB-PC02", "Computador de escritorio", "O", labs.embebidos],
    ["FIS-KIT01", "Kit de mecánica", "O", labs.fisica],
    ["FIS-KIT02", "Kit de mecánica", "O", labs.fisica],
    ["FIS-SEN01", "Sensor de movimiento", "O", labs.fisica],
    ["FIS-SEN02", "Sensor de movimiento", "O", labs.fisica],
    ["FIS-PC01", "Computador de escritorio", "O", labs.fisica],
  ];

  const ids = {};
  for (const [codigo, tipo, estado, labId] of equipos) {
    ids[codigo] = await run(
      `INSERT INTO LAB_EQUIPOS (equ_codigo, equ_tipo, equ_estado, lab_id) VALUES (?, ?, ?, ?)`,
      [codigo, tipo, estado, labId]
    );
  }
  return ids;
}

async function insertarHorarios(labs) {
  const ids = {};
  for (const labId of Object.values(labs)) {
    for (let dia = LUNES; dia <= VIERNES; dia++) {
      for (const [entrada, salida] of FRANJAS) {
        ids[`${labId}-${dia}-${entrada}`] = await run(
          `INSERT INTO LAB_HORARIOS (hor_dia_semana, hor_entrada, hor_salida, lab_id) VALUES (?, ?, ?, ?)`,
          [dia, entrada, salida, labId]
        );
      }
    }
  }
  return ids;
}

async function insertarBloqueos(labs) {
  const hoy = new Date();

  await run(
    `INSERT INTO LAB_BLOQUEOS (blo_tipo, blo_motivo, blo_fecha_inicio, blo_fecha_fin, lab_id)
     VALUES ('F', ?, ?, ?, NULL)`,
    ["Navidad", "2026-12-25", "2026-12-25"]
  );

  await run(
    `INSERT INTO LAB_BLOQUEOS (blo_tipo, blo_motivo, blo_fecha_inicio, blo_fecha_fin, blo_dia_semana, blo_hora_inicio, blo_hora_fin, lab_id)
     VALUES ('C', ?, ?, ?, ?, ?, ?, ?)`,
    ["Clase fija de Sistemas Embebidos", "2026-09-01", "2027-02-28", LUNES, "07:00", "09:00", labs.embebidos]
  );

  await run(
    `INSERT INTO LAB_BLOQUEOS (blo_tipo, blo_motivo, blo_fecha_inicio, blo_fecha_fin, lab_id)
     VALUES ('M', ?, ?, ?, ?)`,
    [
      "Mantenimiento de equipos e instalaciones",
      formatearFecha(hoy),
      formatearFecha(sumarDias(hoy, 14)),
      labs.fisica,
    ]
  );
}

async function insertarReservas(usuarios, labs, equipos, horarios) {
  const franja = (labId, dia, entrada) => horarios[`${labId}-${dia}-${entrada}`];

  const pendiente = await run(
    `INSERT INTO LAB_RESERVAS (res_tipo, res_fecha, res_aforo, res_asignatura, res_motivo, res_estado, usu_id, hor_id)
     VALUES ('L', ?, ?, ?, ?, 'P', ?, ?)`,
    [
      proximoDia(MARTES),
      20,
      "Sistemas Embebidos",
      "Práctica de VHDL con FPGA",
      usuarios.docente,
      franja(labs.embebidos, MARTES, "09:00"),
    ]
  );

  const aprobada = await run(
    `INSERT INTO LAB_RESERVAS (res_tipo, res_fecha, res_aforo, res_asignatura, res_motivo, res_estado, res_mensaje_respuesta, usu_id, hor_id, usu_id_revisor)
     VALUES ('L', ?, ?, ?, ?, 'A', ?, ?, ?, ?)`,
    [
      proximoDia(JUEVES),
      30,
      "Programación y Plataformas Web",
      "Taller de React",
      "Solicitud aprobada",
      usuarios.docente,
      franja(labs.computo7, JUEVES, "14:00"),
      usuarios.admin,
    ]
  );

  const rechazada = await run(
    `INSERT INTO LAB_RESERVAS (res_tipo, res_fecha, res_aforo, res_asignatura, res_motivo, res_estado, res_mensaje_respuesta, usu_id, hor_id, usu_id_revisor)
     VALUES ('L', ?, ?, ?, ?, 'R', ?, ?, ?, ?)`,
    [
      proximoDia(MIERCOLES),
      30,
      "Gestión de Base de Datos",
      "Práctica de PL/SQL",
      "El laboratorio no está disponible en esa franja",
      usuarios.docente,
      franja(labs.computo7, MIERCOLES, "07:00"),
      usuarios.admin,
    ]
  );

  await run(
    `INSERT INTO LAB_RESERVAS (res_tipo, res_fecha, res_aforo, res_motivo, res_estado, usu_id, hor_id)
     VALUES ('P', ?, 1, ?, 'A', ?, ?)`,
    [proximoDia(MIERCOLES), "Avance del proyecto integrador", usuarios.estudiante1, franja(labs.computo7, MIERCOLES, "09:00")]
  );

  await run(
    `INSERT INTO LAB_RESERVAS (res_tipo, res_fecha, res_aforo, res_motivo, res_estado, usu_id, hor_id, equ_id)
     VALUES ('E', ?, 1, ?, 'A', ?, ?, ?)`,
    [
      proximoDia(JUEVES),
      "Pruebas con la tarjeta FPGA",
      usuarios.estudiante1,
      franja(labs.embebidos, JUEVES, "11:00"),
      equipos["EMB-FPGA01"],
    ]
  );

  await run(
    `INSERT INTO LAB_RESERVAS (res_tipo, res_fecha, res_aforo, res_motivo, res_estado, usu_id, hor_id)
     VALUES ('P', ?, 1, ?, 'C', ?, ?)`,
    [proximoDia(MIERCOLES), "Repaso para el examen", usuarios.estudiante2, franja(labs.computo7, MIERCOLES, "09:00")]
  );

  await run(
    `INSERT INTO LAB_RESERVAS (res_tipo, res_fecha, res_aforo, res_motivo, res_estado, usu_id, hor_id)
     VALUES ('P', ?, 1, ?, 'F', ?, ?)`,
    [anteriorDia(MARTES), "Deberes de programación", usuarios.estudiante2, franja(labs.computo7, MARTES, "11:00")]
  );

  return { pendiente, aprobada, rechazada };
}

async function insertarIncidencias(usuarios, equipos) {
  const pcDaniada = await run(
    `INSERT INTO LAB_INCIDENCIAS (inc_descripcion, inc_prioridad, inc_estado, equ_id, usu_id)
     VALUES (?, 3, 'A', ?, ?)`,
    ["El computador no enciende", equipos["C7-PC03"], usuarios.estudiante1]
  );

  const osciloscopio = await run(
    `INSERT INTO LAB_INCIDENCIAS (inc_descripcion, inc_prioridad, inc_estado, inc_fecha_actualizacion, equ_id, usu_id)
     VALUES (?, 2, 'P', datetime('now', 'localtime'), ?, ?)`,
    ["La pantalla del osciloscopio parpadea", equipos["EMB-OSC01"], usuarios.docente]
  );

  return { pcDaniada, osciloscopio };
}

async function insertarNotificaciones(usuarios, reservas, incidencias) {
  const notificaciones = [
    ["S", "Nueva solicitud del Laboratorio de Sistemas Embebidos", 0, usuarios.admin, reservas.pendiente, null],
    ["A", "Tu solicitud del Laboratorio de cómputo #7 fue aprobada", 1, usuarios.docente, reservas.aprobada, null],
    ["R", "Tu solicitud del Laboratorio de cómputo #7 fue rechazada", 0, usuarios.docente, reservas.rechazada, null],
    ["I", "Nueva incidencia en el equipo C7-PC03", 0, usuarios.admin, null, incidencias.pcDaniada],
  ];

  for (const [tipo, mensaje, leida, usuId, resId, incId] of notificaciones) {
    await run(
      `INSERT INTO LAB_NOTIFICACIONES (not_tipo, not_mensaje, not_leida, usu_id, res_id, inc_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tipo, mensaje, leida, usuId, resId, incId]
    );
  }
}

async function main() {
  try {
    await exec("PRAGMA foreign_keys = ON");
    await exec("BEGIN TRANSACTION");
    await limpiarTablas();
    const usuarios = await insertarUsuarios();
    const labs = await insertarLaboratorios();
    const equipos = await insertarEquipos(labs);
    const horarios = await insertarHorarios(labs);
    await insertarBloqueos(labs);
    const reservas = await insertarReservas(usuarios, labs, equipos, horarios);
    const incidencias = await insertarIncidencias(usuarios, equipos);
    await insertarNotificaciones(usuarios, reservas, incidencias);
    await exec("COMMIT");
    console.log("Datos semilla cargados correctamente.");
  } catch (err) {
    await exec("ROLLBACK").catch(() => {});
    console.error("Error al cargar los datos semilla:", err.message);
    process.exitCode = 1;
  } finally {
    db.close();
  }
}

main();