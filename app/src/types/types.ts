export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  fotoUrl?: string;
  edad?: number;
  sexo?: 'masculino' | 'femenino' | 'otro';
  alturaCm?: number;
  objetivo?: 'ganancia' | 'perdida' | 'mantenimiento';
  createdAt?: string;
}

export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion?: string;
  grupoMuscular: string;
  imagenUrl?: string;
  esPredefinido: boolean;
  creadoPor?: number;
}

export interface Rutina {
  id: number;
  usuarioId: number;
  nombre: string;
  descripcion?: string;
  esActiva: boolean;
  archivada: boolean;
  createdAt: string;
  updatedAt: string;
  rutinaEjercicios?: RutinaEjercicio[];
}

export interface RutinaEjercicio {
  id: number;
  rutinaId: number;
  ejercicioId: number;
  diaSemana: number;
  orden: number;
  seriesObjetivo: number;
  repeticionesObj: string;
  descansoSeg: number;
  notas?: string;
  ejercicio?: Ejercicio;
}

export interface SesionEntrenamiento {
  id: number;
  usuarioId: number;
  rutinaId?: number;
  fecha: string;
  diaSemana: number;
  duracionMin?: number;
  notas?: string;
  createdAt: string;
  rutina?: { nombre: string };
  seriesLog?: SerieLog[];
}

export interface SerieLog {
  id: number;
  sesionId: number;
  ejercicioId: number;
  numSerie: number;
  pesoKg: number;
  repeticiones: number;
  alFallo: boolean;
  notas?: string;
  ejercicio?: Ejercicio;
}

export interface MedidaCorporal {
  id: number;
  usuarioId: number;
  fecha: string;
  pesoKg?: number;
  grasaPct?: number;
  medidaPechoCm?: number;
  medidaCinturaCm?: number;
  medidaBrazoCm?: number;
  medidaPiernaCm?: number;
  notas?: string;
}

export interface RespuestaAuth {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

export interface Resumen {
  totalSesiones: number;
  totalRutinas: number;
  ultimaMedida?: MedidaCorporal;
  ultimaSesion?: SesionEntrenamiento;
}