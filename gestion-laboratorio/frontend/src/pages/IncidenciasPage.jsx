import { MainLayout } from '../components/layout/MainLayout';
import { RegistroIncidencias } from '../components/shared/RegistroIncidencias';

export function IncidenciasPage({
  rol = 'Estudiante',
  nombreUsuario = 'Diego Forlán',
}) {
  return (
    <MainLayout rol={rol} nombreUsuario={nombreUsuario}>
      <RegistroIncidencias />
    </MainLayout>
  );
}