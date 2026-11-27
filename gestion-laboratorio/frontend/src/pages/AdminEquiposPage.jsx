import { MainLayout } from '../components/layout/MainLayout';
import { GestionEquipos } from '../components/administrador/GestionEquipos';

export function AdminEquiposPage() {
  return (
    <MainLayout rol="Administrador" nombreUsuario="Lucas Mancinelli">
      <GestionEquipos />
    </MainLayout>
  );
}