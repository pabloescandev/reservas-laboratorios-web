import { apiRequest } from "./apiClient";

export const ESTADOS_RESERVA = {
  P: "Pendiente",
  A: "Aprobada",
  R: "Rechazada",
  C: "Cancelada",
  F: "Finalizada",
};

export const TIPOS_RESERVA = {
  L: "Laboratorio completo",
  P: "Puesto",
  E: "Equipo",
};

export function obtenerDisponibilidad(labId, semana) {
  const parametros = new URLSearchParams({ labId });
  if (semana) parametros.set("semana", semana);
  return apiRequest(`/reservas/disponibilidad?${parametros}`);
}

export function listarReservas(filtros = {}) {
  const parametros = new URLSearchParams();
  Object.entries(filtros).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") parametros.set(clave, valor);
  });
  const consulta = parametros.toString();
  return apiRequest(`/reservas${consulta ? `?${consulta}` : ""}`);
}

export function reservarPuesto({ horId, fecha, equId, motivo }) {
  return apiRequest("/reservas/puesto", {
    method: "POST",
    body: JSON.stringify({ horId, fecha, equId, motivo }),
  });
}

export function solicitarLaboratorio({ horId, fecha, asignatura, motivo }) {
  return apiRequest("/reservas/laboratorio", {
    method: "POST",
    body: JSON.stringify({ horId, fecha, asignatura, motivo }),
  });
}

export function responderSolicitud(resId, decision, mensaje) {
  return apiRequest(`/reservas/${resId}/respuesta`, {
    method: "PATCH",
    body: JSON.stringify({ decision, mensaje }),
  });
}

export function cancelarReserva(resId) {
  return apiRequest(`/reservas/${resId}/cancelar`, { method: "PATCH" });
}
