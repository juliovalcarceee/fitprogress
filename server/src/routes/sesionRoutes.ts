import { Router } from 'express';
import {
  iniciarSesion,
  finalizarSesion,
  obtenerHistorial,
  obtenerSesionPorId,
  eliminarSesion,
  registrarSerie,
  actualizarSerie,
  eliminarSerie
} from '../controllers/sesionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/iniciar', authMiddleware, iniciarSesion);
router.put('/:id/finalizar', authMiddleware, finalizarSesion);
router.get('/historial', authMiddleware, obtenerHistorial);
router.get('/:id', authMiddleware, obtenerSesionPorId);
router.delete('/:id', authMiddleware, eliminarSesion);
router.post('/serie', authMiddleware, registrarSerie);
router.put('/serie/:id', authMiddleware, actualizarSerie);
router.delete('/serie/:id', authMiddleware, eliminarSerie);

export default router;