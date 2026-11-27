import { MainLayout } from '../components/layout/MainLayout';
import { GestionLaboratorios } from '../components/administrador/GestionLaboratorios';

export function AdminLaboratoriosPage() {
  return (
    <MainLayout rol="Administrador" nombreUsuario="Lucas Mancinelli">
      <GestionLaboratorios />
    </MainLayout>
  );
}