import { MainLayout } from '../components/layout/MainLayout';
import { GestionHorarios } from '../components/administrador/GestionHorarios';

export function AdminHorariosPage() {
  return (
    <MainLayout rol="Administrador" nombreUsuario="Lucas Mancinelli">
      <GestionHorarios />
    </MainLayout>
  );
}