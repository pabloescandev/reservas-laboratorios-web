const { get, all, run } = require("../config/dbAsync");

const ESTADOS_ACTIVOS = "('P', 'A')";

async function findHorarioConLaboratorio(horId) {
    const sql = `
        SELECT h.hor_id, h.hor_dia_semana, h.hor_entrada, h.hor_salida,
               l.lab_id, l.lab_nombre, l.lab_aforo, l.lab_estado
        FROM LAB_HORARIOS h
        JOIN LAB_LABORATORIOS l ON l.lab_id = h.lab_id
        WHERE h.hor_id = ?
    `;
    return await get(sql, [horId]);
}

async function findBloqueosQueCubren({ labId, fecha, diaSemana, entrada, salida }) {
    const sql = `
        SELECT blo_id, blo_tipo, blo_motivo
        FROM LAB_BLOQUEOS
        WHERE (lab_id = ? OR lab_id IS NULL)
          AND ? BETWEEN blo_fecha_inicio AND blo_fecha_fin
          AND (blo_dia_semana IS NULL OR blo_dia_semana = ?)
          AND (blo_hora_inicio IS NULL OR (blo_hora_inicio < ? AND blo_hora_fin > ?))
    `;
    return await all(sql, [labId, fecha, diaSemana, salida, entrada]);
}

async function sumAforoEstudiantes(horId, fecha) {
    const sql = `
        SELECT COALESCE(SUM(res_aforo), 0) AS ocupado
        FROM LAB_RESERVAS
        WHERE hor_id = ? AND res_fecha = ?
          AND res_tipo IN ('P', 'E')
          AND res_estado IN ${ESTADOS_ACTIVOS}
    `;
    const fila = await get(sql, [horId, fecha]);
    return fila.ocupado;
}

async function existsLaboratorioAprobado(horId, fecha) {
    const sql = `
        SELECT 1 FROM LAB_RESERVAS
        WHERE hor_id = ? AND res_fecha = ?
          AND res_tipo = 'L' AND res_estado = 'A'
        LIMIT 1
    `;
    return Boolean(await get(sql, [horId, fecha]));
}

async function existsReservaActivaUsuario(usuId, horId, fecha) {
    const sql = `
        SELECT 1 FROM LAB_RESERVAS
        WHERE usu_id = ? AND hor_id = ? AND res_fecha = ?
          AND res_estado IN ${ESTADOS_ACTIVOS}
        LIMIT 1
    `;
    return Boolean(await get(sql, [usuId, horId, fecha]));
}

async function findEquipo(equId) {
    const sql = `
        SELECT equ_id, equ_codigo, equ_tipo, equ_estado, lab_id
        FROM LAB_EQUIPOS
        WHERE equ_id = ?
    `;
    return await get(sql, [equId]);
}

async function existsReservaActivaEquipo(equId, horId, fecha) {
    const sql = `
        SELECT 1 FROM LAB_RESERVAS
        WHERE equ_id = ? AND hor_id = ? AND res_fecha = ?
          AND res_estado IN ${ESTADOS_ACTIVOS}
        LIMIT 1
    `;
    return Boolean(await get(sql, [equId, horId, fecha]));
}

async function create({ tipo, fecha, aforo, asignatura, motivo, estado, usuId, horId, equId }) {
    const sql = `
        INSERT INTO LAB_RESERVAS
            (res_tipo, res_fecha, res_aforo, res_asignatura, res_motivo, res_estado, usu_id, hor_id, equ_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const resultado = await run(sql, [
        tipo, fecha, aforo, asignatura ?? null, motivo ?? null, estado, usuId, horId, equId ?? null,
    ]);
    return resultado.lastID;
}

const SELECT_DETALLE = `
    SELECT r.res_id, r.res_tipo, r.res_fecha, r.res_aforo, r.res_asignatura, r.res_motivo,
           r.res_estado, r.res_mensaje_respuesta, r.res_fecha_creacion,
           r.usu_id, u.usu_nombres, u.usu_apellidos, u.usu_rol,
           r.hor_id, h.hor_dia_semana, h.hor_entrada, h.hor_salida,
           l.lab_id, l.lab_nombre,
           r.equ_id, e.equ_codigo, e.equ_tipo,
           r.usu_id_revisor
    FROM LAB_RESERVAS r
    JOIN LAB_USUARIO u ON u.usu_id = r.usu_id
    JOIN LAB_HORARIOS h ON h.hor_id = r.hor_id
    JOIN LAB_LABORATORIOS l ON l.lab_id = h.lab_id
    LEFT JOIN LAB_EQUIPOS e ON e.equ_id = r.equ_id
`;

async function findById(resId) {
    return await get(`${SELECT_DETALLE} WHERE r.res_id = ?`, [resId]);
}

async function findAll({ usuId, labId, estado } = {}) {
    const condiciones = [];
    const parametros = [];

    if (usuId) {
        condiciones.push("r.usu_id = ?");
        parametros.push(usuId);
    }
    if (labId) {
        condiciones.push("l.lab_id = ?");
        parametros.push(labId);
    }
    if (estado) {
        condiciones.push("r.res_estado = ?");
        parametros.push(estado);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
    const sql = `${SELECT_DETALLE} ${where} ORDER BY r.res_fecha DESC, h.hor_entrada DESC`;
    return await all(sql, parametros);
}

async function updateEstado(resId, { estado, mensaje = null, revisorId = null }) {
    const sql = `
        UPDATE LAB_RESERVAS
        SET res_estado = ?,
            res_mensaje_respuesta = COALESCE(?, res_mensaje_respuesta),
            usu_id_revisor = COALESCE(?, usu_id_revisor)
        WHERE res_id = ?
    `;
    const resultado = await run(sql, [estado, mensaje, revisorId, resId]);
    return resultado.changes;
}

async function finalizarVencidas(ahora) {
    const finalizadas = await run(
        `
        UPDATE LAB_RESERVAS
        SET res_estado = 'F'
        WHERE res_estado = 'A'
          AND res_fecha || ' ' || (SELECT hor_salida FROM LAB_HORARIOS h WHERE h.hor_id = LAB_RESERVAS.hor_id) <= ?
        `,
        [ahora]
    );

    const rechazadas = await run(
        `
        UPDATE LAB_RESERVAS
        SET res_estado = 'R',
            res_mensaje_respuesta = 'No fue revisada a tiempo'
        WHERE res_estado = 'P'
          AND res_fecha || ' ' || (SELECT hor_entrada FROM LAB_HORARIOS h WHERE h.hor_id = LAB_RESERVAS.hor_id) <= ?
        `,
        [ahora]
    );

    return { finalizadas: finalizadas.changes, rechazadas: rechazadas.changes };
}

module.exports = {
    findHorarioConLaboratorio,
    findBloqueosQueCubren,
    sumAforoEstudiantes,
    existsLaboratorioAprobado,
    existsReservaActivaUsuario,
    findEquipo,
    existsReservaActivaEquipo,
    create,
    findById,
    findAll,
    updateEstado,
    finalizarVencidas,
};
