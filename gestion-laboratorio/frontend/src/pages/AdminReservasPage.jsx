import { MainLayout } from '../components/layout/MainLayout';
import { obtenerUsuarioActual } from '../services/sesion';
import { GestionReservas } from '../components/administrador/GestionReservas';

export function AdminReservasPage() {
  const usuario = obtenerUsuarioActual();
  const nombre = usuario ? `${usuario.usu_nombres} ${usuario.usu_apellidos}` : '';

  return (
    <MainLayout rol="Administrador" nombreUsuario={nombre}>
      <GestionReservas />
    </MainLayout>
  );
}