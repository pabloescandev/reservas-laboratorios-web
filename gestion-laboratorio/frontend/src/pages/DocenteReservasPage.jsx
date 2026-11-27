import { MainLayout } from '../components/layout/MainLayout';
import { ReservaLaboratorio } from '../components/docente/ReservaLaboratorio';

export function DocenteReservasPage() {
  return (
    <MainLayout rol="Docente" nombreUsuario="Luis Enrique">
      <ReservaLaboratorio />
    </MainLayout>
  );
}