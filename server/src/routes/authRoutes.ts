import { Router } from 'express';
import { registro, login, obtenerPerfil, actualizarPerfil } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', authMiddleware, obtenerPerfil);
router.put('/perfil', authMiddleware, actualizarPerfil);

export default router;