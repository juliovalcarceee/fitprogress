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

const router = Router();

router.get('/', authMiddleware, obtenerEjercicios);
router.get('/grupos', authMiddleware, obtenerGruposMusculares);
router.get('/:id', authMiddleware, obtenerEjercicioPorId);
router.post('/', authMiddleware, crearEjercicio);
router.put('/:id', authMiddleware, actualizarEjercicio);
router.delete('/:id', authMiddleware, eliminarEjercicio);

export default router;