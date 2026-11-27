const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function obtenerToken() {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = obtenerToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && (data.error || data.message)) ||
      `Error en la petición (${response.status})`;
    throw new Error(message);
  }

  return data;
}
