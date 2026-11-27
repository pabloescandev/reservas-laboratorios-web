import { apiRequest } from "./apiClient";

export function obtenerLaboratorio(labId) {
  return apiRequest(`/laboratorios/${labId}`);
}

export function listarEquiposDeLaboratorio(labId) {
  return apiRequest(`/equipos?labId=${labId}`);
}

export function listarLaboratorios() {
  return apiRequest("/laboratorios");
}
