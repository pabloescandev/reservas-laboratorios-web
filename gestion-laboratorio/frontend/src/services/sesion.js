export const NOMBRES_ROL = {
  A: "Administrador",
  D: "Docente",
  E: "Estudiante",
};

export function obtenerUsuarioActual() {
  try {
    const guardado = sessionStorage.getItem("usuario") || localStorage.getItem("usuario");
    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}
