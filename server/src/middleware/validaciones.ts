import { body } from 'express-validator';

export const validarRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no es válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

export const validarLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no es válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
];

export const validarPerfil = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('edad')
    .optional()
    .isInt({ min: 10, max: 120 }).withMessage('La edad debe ser entre 10 y 120 años'),
  body('sexo')
    .optional()
    .isIn(['masculino', 'femenino', 'otro']).withMessage('El sexo debe ser masculino, femenino u otro'),
  body('alturaCm')
    .optional()
    .isFloat({ min: 50, max: 300 }).withMessage('La altura debe ser entre 50 y 300 cm'),
  body('objetivo')
    .optional()
    .isIn(['ganancia', 'perdida', 'mantenimiento']).withMessage('El objetivo debe ser ganancia, perdida o mantenimiento')
];

export const validarEjercicio = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre del ejercicio es obligatorio')
    .isLength({ max: 200 }).withMessage('El nombre no puede superar 200 caracteres'),
  body('grupoMuscular')
    .trim()
    .notEmpty().withMessage('El grupo muscular es obligatorio'),
  body('descripcion')
    .optional()
    .trim(),
  body('imagenUrl')
    .optional()
    .isURL().withMessage('La URL de la imagen no es válida')
];

export const validarRutina = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre de la rutina es obligatorio')
    .isLength({ max: 200 }).withMessage('El nombre no puede superar 200 caracteres'),
  body('descripcion')
    .optional()
    .trim(),
  body('ejercicios')
    .optional()
    .isArray().withMessage('Los ejercicios deben ser un array'),
  body('ejercicios.*.ejercicioId')
    .optional()
    .isInt().withMessage('El ID del ejercicio debe ser un número'),
  body('ejercicios.*.diaSemana')
    .optional()
    .isInt({ min: 1, max: 7 }).withMessage('El día de la semana debe ser entre 1 y 7'),
  body('ejercicios.*.seriesObjetivo')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Las series deben ser entre 1 y 20'),
  body('ejercicios.*.descansoSeg')
    .optional()
    .isInt({ min: 0, max: 600 }).withMessage('El descanso debe ser entre 0 y 600 segundos')
];

export const validarSesion = [
  body('diaSemana')
    .notEmpty().withMessage('El día de la semana es obligatorio')
    .isInt({ min: 1, max: 7 }).withMessage('El día debe ser entre 1 y 7'),
  body('rutinaId')
    .optional()
    .isInt().withMessage('El ID de la rutina debe ser un número')
];

export const validarSerie = [
  body('sesionId')
    .notEmpty().withMessage('El ID de la sesión es obligatorio')
    .isInt().withMessage('El ID de la sesión debe ser un número'),
  body('ejercicioId')
    .notEmpty().withMessage('El ID del ejercicio es obligatorio')
    .isInt().withMessage('El ID del ejercicio debe ser un número'),
  body('numSerie')
    .notEmpty().withMessage('El número de serie es obligatorio')
    .isInt({ min: 1 }).withMessage('El número de serie debe ser al menos 1'),
  body('pesoKg')
    .notEmpty().withMessage('El peso es obligatorio')
    .isFloat({ min: 0 }).withMessage('El peso debe ser mayor o igual a 0'),
  body('repeticiones')
    .notEmpty().withMessage('Las repeticiones son obligatorias')
    .isInt({ min: 1 }).withMessage('Las repeticiones deben ser al menos 1'),
  body('alFallo')
    .optional()
    .isBoolean().withMessage('Al fallo debe ser verdadero o falso')
];

export const validarMedida = [
  body('fecha')
    .notEmpty().withMessage('La fecha es obligatoria')
    .isISO8601().withMessage('La fecha debe tener formato válido'),
  body('pesoKg')
    .optional()
    .isFloat({ min: 20, max: 500 }).withMessage('El peso debe ser entre 20 y 500 kg'),
  body('grasaPct')
    .optional()
    .isFloat({ min: 1, max: 60 }).withMessage('El porcentaje de grasa debe ser entre 1 y 60'),
  body('medidaPechoCm')
    .optional()
    .isFloat({ min: 30, max: 200 }).withMessage('La medida de pecho debe ser entre 30 y 200 cm'),
  body('medidaCinturaCm')
    .optional()
    .isFloat({ min: 30, max: 200 }).withMessage('La medida de cintura debe ser entre 30 y 200 cm'),
  body('medidaBrazoCm')
    .optional()
    .isFloat({ min: 10, max: 80 }).withMessage('La medida de brazo debe ser entre 10 y 80 cm'),
  body('medidaPiernaCm')
    .optional()
    .isFloat({ min: 20, max: 120 }).withMessage('La medida de pierna debe ser entre 20 y 120 cm')
];