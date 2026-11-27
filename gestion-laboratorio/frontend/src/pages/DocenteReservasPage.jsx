import { MainLayout } from '../components/layout/MainLayout';
import { obtenerUsuarioActual } from '../services/sesion';
import { ReservaLaboratorio } from '../components/docente/ReservaLaboratorio';

export function DocenteReservasPage() {
  const usuario = obtenerUsuarioActual();
  const nombre = usuario ? `${usuario.usu_nombres} ${usuario.usu_apellidos}` : '';

  return (
    <MainLayout rol="Docente" nombreUsuario={nombre}>
      <ReservaLaboratorio />
    </MainLayout>
  );
}