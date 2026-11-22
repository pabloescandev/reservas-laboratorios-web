PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS LAB_NOTIFICACIONES;
DROP TABLE IF EXISTS LAB_INCIDENCIAS;
DROP TABLE IF EXISTS LAB_RESERVAS;
DROP TABLE IF EXISTS LAB_BLOQUEOS;
DROP TABLE IF EXISTS LAB_HORARIOS;
DROP TABLE IF EXISTS LAB_EQUIPOS;
DROP TABLE IF EXISTS LAB_LABORATORIOS;
DROP TABLE IF EXISTS LAB_USUARIO;

CREATE TABLE LAB_USUARIO (
    usu_id               INTEGER PRIMARY KEY AUTOINCREMENT,
    usu_correo           VARCHAR(100) NOT NULL UNIQUE,
    usu_contrasenia_hash VARCHAR(200) NOT NULL,
    usu_rol              CHAR(1)      NOT NULL CHECK (usu_rol IN ('A', 'D', 'E')),
    usu_nombres          VARCHAR(100) NOT NULL,
    usu_apellidos        VARCHAR(100) NOT NULL,
    usu_estado           INTEGER      NOT NULL DEFAULT 1 CHECK (usu_estado IN (0, 1)),
    usu_fecha_creacion   VARCHAR(19)  DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE LAB_LABORATORIOS (
    lab_id                 INTEGER PRIMARY KEY AUTOINCREMENT,
    lab_nombre             VARCHAR(100) NOT NULL UNIQUE,
    lab_ubicacion          VARCHAR(200) NOT NULL,
    lab_aforo              INTEGER      NOT NULL CHECK (lab_aforo > 0),
    lab_software_instalado VARCHAR(500) NULL,
    lab_foto_url           VARCHAR(300) NULL,
    lab_estado             CHAR(1)      NOT NULL DEFAULT 'D' CHECK (lab_estado IN ('D', 'M'))
);

CREATE TABLE LAB_EQUIPOS (
    equ_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    equ_codigo VARCHAR(50)  NOT NULL UNIQUE,
    equ_tipo   VARCHAR(100) NOT NULL,
    equ_estado CHAR(1)      NOT NULL DEFAULT 'O' CHECK (equ_estado IN ('O', 'D', 'R')),
    lab_id     INTEGER      NOT NULL,
    FOREIGN KEY (lab_id) REFERENCES LAB_LABORATORIOS (lab_id) ON DELETE RESTRICT
);

CREATE TABLE LAB_HORARIOS (
    hor_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    hor_dia_semana INTEGER    NOT NULL CHECK (hor_dia_semana BETWEEN 1 AND 7),
    hor_entrada    VARCHAR(5) NOT NULL CHECK (hor_entrada GLOB '[0-2][0-9]:[0-5][0-9]' AND hor_entrada < '24:00'),
    hor_salida     VARCHAR(5) NOT NULL CHECK (hor_salida GLOB '[0-2][0-9]:[0-5][0-9]' AND hor_salida < '24:00'),
    lab_id         INTEGER    NOT NULL,
    CHECK (hor_salida > hor_entrada),
    FOREIGN KEY (lab_id) REFERENCES LAB_LABORATORIOS (lab_id) ON DELETE CASCADE
);

CREATE TABLE LAB_BLOQUEOS (
    blo_id           INTEGER PRIMARY KEY AUTOINCREMENT,
    blo_tipo         CHAR(1)      NOT NULL CHECK (blo_tipo IN ('C', 'M', 'F')),
    blo_motivo       VARCHAR(200) NULL,
    blo_fecha_inicio VARCHAR(10)  NOT NULL CHECK (date(blo_fecha_inicio) IS NOT NULL AND blo_fecha_inicio = date(blo_fecha_inicio)),
    blo_fecha_fin    VARCHAR(10)  NOT NULL CHECK (date(blo_fecha_fin) IS NOT NULL AND blo_fecha_fin = date(blo_fecha_fin)),
    blo_dia_semana   INTEGER      NULL CHECK (blo_dia_semana BETWEEN 1 AND 7),
    blo_hora_inicio  VARCHAR(5)   NULL CHECK (blo_hora_inicio GLOB '[0-2][0-9]:[0-5][0-9]' AND blo_hora_inicio < '24:00'),
    blo_hora_fin     VARCHAR(5)   NULL CHECK (blo_hora_fin GLOB '[0-2][0-9]:[0-5][0-9]' AND blo_hora_fin < '24:00'),
    lab_id           INTEGER      NULL,
    CHECK (blo_fecha_fin >= blo_fecha_inicio),
    CHECK (
        (blo_hora_inicio IS NULL AND blo_hora_fin IS NULL)
        OR (
            blo_hora_inicio IS NOT NULL
            AND blo_hora_fin IS NOT NULL
            AND blo_hora_fin > blo_hora_inicio
        )
    ),
    FOREIGN KEY (lab_id) REFERENCES LAB_LABORATORIOS (lab_id) ON DELETE CASCADE
);

CREATE TABLE LAB_RESERVAS (
    res_id                INTEGER PRIMARY KEY AUTOINCREMENT,
    res_tipo              CHAR(1)      NOT NULL CHECK (res_tipo IN ('L', 'P', 'E')),
    res_fecha             VARCHAR(10)  NOT NULL CHECK (date(res_fecha) IS NOT NULL AND res_fecha = date(res_fecha)),
    res_aforo             INTEGER      NOT NULL DEFAULT 1 CHECK (res_aforo > 0),
    res_asignatura        VARCHAR(100) NULL,
    res_motivo            VARCHAR(300) NULL,
    res_estado            CHAR(1)      NOT NULL DEFAULT 'P' CHECK (res_estado IN ('P', 'A', 'R', 'C', 'F')),
    res_mensaje_respuesta VARCHAR(300) NULL,
    res_fecha_creacion    VARCHAR(19)  DEFAULT (datetime('now', 'localtime')),
    usu_id                INTEGER      NOT NULL,
    hor_id                INTEGER      NOT NULL,
    equ_id                INTEGER      NULL,
    usu_id_revisor        INTEGER      NULL,
    CHECK (
        (res_tipo = 'E' AND equ_id IS NOT NULL)
        OR (res_tipo <> 'E' AND equ_id IS NULL)
    ),
    CHECK (res_tipo <> 'L' OR res_asignatura IS NOT NULL),
    FOREIGN KEY (usu_id) REFERENCES LAB_USUARIO (usu_id) ON DELETE RESTRICT,
    FOREIGN KEY (hor_id) REFERENCES LAB_HORARIOS (hor_id) ON DELETE RESTRICT,
    FOREIGN KEY (equ_id) REFERENCES LAB_EQUIPOS (equ_id) ON DELETE RESTRICT,
    FOREIGN KEY (usu_id_revisor) REFERENCES LAB_USUARIO (usu_id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX UX_RESERVAS_USUARIO_FRANJA
    ON LAB_RESERVAS (usu_id, hor_id, res_fecha)
    WHERE res_estado IN ('P', 'A');

CREATE UNIQUE INDEX UX_RESERVAS_EQUIPO_FRANJA
    ON LAB_RESERVAS (equ_id, hor_id, res_fecha)
    WHERE equ_id IS NOT NULL AND res_estado IN ('P', 'A');

CREATE TABLE LAB_INCIDENCIAS (
    inc_id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    inc_descripcion         VARCHAR(500) NOT NULL,
    inc_prioridad           INTEGER      NOT NULL CHECK (inc_prioridad BETWEEN 1 AND 3),
    inc_estado              CHAR(1)      NOT NULL DEFAULT 'A' CHECK (inc_estado IN ('A', 'P', 'R')),
    inc_fecha_creacion      VARCHAR(19)  DEFAULT (datetime('now', 'localtime')),
    inc_fecha_actualizacion VARCHAR(19)  NULL,
    equ_id                  INTEGER      NOT NULL,
    usu_id                  INTEGER      NOT NULL,
    FOREIGN KEY (equ_id) REFERENCES LAB_EQUIPOS (equ_id) ON DELETE RESTRICT,
    FOREIGN KEY (usu_id) REFERENCES LAB_USUARIO (usu_id) ON DELETE RESTRICT
);

CREATE TABLE LAB_NOTIFICACIONES (
    not_id             INTEGER PRIMARY KEY AUTOINCREMENT,
    not_tipo           CHAR(1)      NOT NULL CHECK (not_tipo IN ('S', 'A', 'R', 'I')),
    not_mensaje        VARCHAR(300) NOT NULL,
    not_leida          INTEGER      NOT NULL DEFAULT 0 CHECK (not_leida IN (0, 1)),
    not_fecha_creacion VARCHAR(19)  DEFAULT (datetime('now', 'localtime')),
    usu_id             INTEGER      NOT NULL,
    res_id             INTEGER      NULL,
    inc_id             INTEGER      NULL,
    FOREIGN KEY (usu_id) REFERENCES LAB_USUARIO (usu_id) ON DELETE RESTRICT,
    FOREIGN KEY (res_id) REFERENCES LAB_RESERVAS (res_id) ON DELETE RESTRICT,
    FOREIGN KEY (inc_id) REFERENCES LAB_INCIDENCIAS (inc_id) ON DELETE RESTRICT
);
