import { Router } from 'express';
import { registro, login, obtenerPerfil, actualizarPerfil } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { validarRegistro, validarLogin, validarPerfil } from '../middleware/validaciones';
import { comprobarValidacion } from '../middleware/manejarErrores';

const router = Router();

router.post('/registro', validarRegistro, comprobarValidacion, registro);
router.post('/login', validarLogin, comprobarValidacion, login);
router.get('/perfil', authMiddleware, obtenerPerfil);
router.put('/perfil', authMiddleware, validarPerfil, comprobarValidacion, actualizarPerfil);

export default router;