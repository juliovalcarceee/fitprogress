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
import { validarSesion, validarSerie } from '../middleware/validaciones';
import { comprobarValidacion } from '../middleware/manejarErrores';

const router = Router();

router.post('/iniciar', authMiddleware, validarSesion, comprobarValidacion, iniciarSesion);
router.put('/:id/finalizar', authMiddleware, finalizarSesion);
router.get('/historial', authMiddleware, obtenerHistorial);
router.get('/:id', authMiddleware, obtenerSesionPorId);
router.delete('/:id', authMiddleware, eliminarSesion);
router.post('/serie', authMiddleware, validarSerie, comprobarValidacion, registrarSerie);
router.put('/serie/:id', authMiddleware, actualizarSerie);
router.delete('/serie/:id', authMiddleware, eliminarSerie);

export default router;