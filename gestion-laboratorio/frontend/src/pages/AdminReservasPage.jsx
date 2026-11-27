import { MainLayout } from '../components/layout/MainLayout';
import { GestionReservas } from '../components/administrador/GestionReservas';

export function AdminReservasPage() {
  return (
    <MainLayout rol="Administrador" nombreUsuario="Lucas Mancinelli">
      <GestionReservas />
    </MainLayout>
  );
}