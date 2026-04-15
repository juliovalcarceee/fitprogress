import { Router } from 'express';
import {
  obtenerEjercicios,
  obtenerEjercicioPorId,
  crearEjercicio,
  actualizarEjercicio,
  eliminarEjercicio,
  obtenerGruposMusculares
} from '../controllers/ejercicioController';
import { authMiddleware } from '../middleware/auth';
import { validarEjercicio } from '../middleware/validaciones';
import { comprobarValidacion } from '../middleware/manejarErrores';

const router = Router();

router.get('/', authMiddleware, obtenerEjercicios);
router.get('/grupos', authMiddleware, obtenerGruposMusculares);
router.get('/:id', authMiddleware, obtenerEjercicioPorId);
router.post('/', authMiddleware, validarEjercicio, comprobarValidacion, crearEjercicio);
router.put('/:id', authMiddleware, validarEjercicio, comprobarValidacion, actualizarEjercicio);
router.delete('/:id', authMiddleware, eliminarEjercicio);

export default router;