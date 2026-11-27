import { MainLayout } from '../components/layout/MainLayout';
import { obtenerUsuarioActual } from '../services/sesion';
import { ReservaEquipo } from '../components/estudiante/ReservaEquipo';

export function EstudianteReservasPage() {
  const usuario = obtenerUsuarioActual();
  const nombre = usuario ? `${usuario.usu_nombres} ${usuario.usu_apellidos}` : '';

  return (
    <MainLayout rol="Estudiante" nombreUsuario={nombre}>
      <ReservaEquipo />
    </MainLayout>
  );
}