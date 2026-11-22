import { apiRequest } from "./apiClient";

export function getHealthStatus() {
  return apiRequest("/health");
}