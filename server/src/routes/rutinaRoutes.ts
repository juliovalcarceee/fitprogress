import { Router } from 'express';
import {
  obtenerRutinas,
  obtenerRutinaPorId,
  crearRutina,
  actualizarRutina,
  eliminarRutina,
  duplicarRutina,
  marcarRutinaActiva,
  archivarRutina
} from '../controllers/rutinaController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, obtenerRutinas);
router.get('/:id', authMiddleware, obtenerRutinaPorId);
router.post('/', authMiddleware, crearRutina);
router.put('/:id', authMiddleware, actualizarRutina);
router.delete('/:id', authMiddleware, eliminarRutina);
router.post('/:id/duplicar', authMiddleware, duplicarRutina);
router.put('/:id/activar', authMiddleware, marcarRutinaActiva);
router.put('/:id/archivar', authMiddleware, archivarRutina);

export default router;