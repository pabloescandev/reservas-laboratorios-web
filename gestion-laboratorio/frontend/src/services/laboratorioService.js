import { apiRequest } from "./apiClient";

export function obtenerLaboratorio(labId) {
  return apiRequest(`/laboratorios/${labId}`);
}

export function listarEquiposDeLaboratorio(labId) {
  return apiRequest(`/equipos?labId=${labId}`);
}
