import { useCallback, useEffect, useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { CalendarioSemanal } from '../components/laboratorio/CalendarioSemanal';
import { PanelLaboratorio } from '../components/laboratorio/PanelLaboratorio';
import { DialogoFranja } from '../components/laboratorio/DialogoFranja';
import { obtenerDisponibilidad } from '../services/reservaService';
import { listarEquiposDeLaboratorio, obtenerLaboratorio } from '../services/laboratorioService';
import { NOMBRES_ROL, obtenerUsuarioActual } from '../services/sesion';
import './LaboratorioDetallePage.css';

export function LaboratorioDetallePage({ labId, onReportarDano }) {
    const usuario = obtenerUsuarioActual();
    const rol = usuario?.usu_rol;

    const [laboratorio, setLaboratorio] = useState(null);
    const [equipos, setEquipos] = useState([]);
    const [errorEquipos, setErrorEquipos] = useState('');
    const [semana, setSemana] = useState(null);
    const [disponibilidad, setDisponibilidad] = useState(null);
    const [seleccion, setSeleccion] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        obtenerLaboratorio(labId)
            .then(setLaboratorio)
            .catch((err) => setError(err.message));

        listarEquiposDeLaboratorio(labId)
            .then(setEquipos)
            .catch(() => setErrorEquipos('No se pudieron cargar los equipos.'));
    }, [labId]);

    const cargarDisponibilidad = useCallback(() => {
        obtenerDisponibilidad(labId, semana)
            .then((datos) => {
                setDisponibilidad(datos);
                setSeleccion((anterior) => {
                    if (!anterior) return null;
                    const dia = datos.dias.find((d) => d.fecha === anterior.dia.fecha);
                    const franja = dia?.franjas.find((f) => f.hor_id === anterior.franja.hor_id);
                    return dia && franja ? { dia, franja } : null;
                });
            })
            .catch((err) => setError(err.message));
    }, [labId, semana]);

    useEffect(() => {
        cargarDisponibilidad();
    }, [cargarDisponibilidad]);

    return (
        <MainLayout
            rol={NOMBRES_ROL[rol] || 'Estudiante'}
            nombreUsuario={usuario ? `${usuario.usu_nombres} ${usuario.usu_apellidos}` : ''}
        >
            {error && (
                <p className="mensaje-pagina-error" role="alert">
                    {error}
                </p>
            )}

            <div className="detalle-laboratorio">
                <div className="columna-calendario">
                    {disponibilidad ? (
                        <CalendarioSemanal
                            disponibilidad={disponibilidad}
                            franjaSeleccionada={seleccion}
                            onSeleccionarFranja={(dia, franja) => setSeleccion({ dia, franja })}
                            onCambiarSemana={setSemana}
                        />
                    ) : (
                        !error && <p className="texto-cargando">Cargando calendario…</p>
                    )}
                </div>

                <div className="columna-panel">
                    {laboratorio && (
                        <PanelLaboratorio
                            laboratorio={laboratorio}
                            equipos={equipos}
                            errorEquipos={errorEquipos}
                            puedeReportar={rol === 'E' || rol === 'D'}
                            onReportarDano={(equipo) => onReportarDano?.(equipo)}
                        />
                    )}
                </div>
            </div>

            {seleccion && (
                <DialogoFranja
                    dia={seleccion.dia}
                    franja={seleccion.franja}
                    equipos={equipos}
                    rol={rol}
                    onCerrar={() => setSeleccion(null)}
                    onCambio={cargarDisponibilidad}
                />
            )}
        </MainLayout>
    );
}
