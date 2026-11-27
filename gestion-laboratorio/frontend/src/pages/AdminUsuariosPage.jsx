import { MainLayout } from '../components/layout/MainLayout';
import { GestionUsuarios } from '../components/administrador/GestionUsuarios';

export function AdminUsuariosPage() {
  return (
    <MainLayout rol="Administrador" nombreUsuario="Lucas Mancinelli">
      <GestionUsuarios />
    </MainLayout>
  );
}