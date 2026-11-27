import { MainLayout } from '../components/layout/MainLayout';
import { GestionIncidencias } from '../components/administrador/GestionIncidencias';

export function AdminIncidenciasPage() {
  return (
    <MainLayout rol="Administrador" nombreUsuario="Lucas Mancinelli">
      <GestionIncidencias />
    </MainLayout>
  );
}