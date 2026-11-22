const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && data.message) || `Error en la petición (${response.status})`;
    throw new Error(message);
  }

  return data;
}