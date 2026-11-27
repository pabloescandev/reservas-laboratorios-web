import { MainLayout } from '../components/layout/MainLayout';
import { ReservaEquipo } from '../components/estudiante/ReservaEquipo';

export function EstudianteReservasPage() {
  return (
    <MainLayout rol="Estudiante" nombreUsuario="Diego Forlán">
      <ReservaEquipo />
    </MainLayout>
  );
}