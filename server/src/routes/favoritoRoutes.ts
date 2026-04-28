import { Router } from 'express';
import { obtenerFavoritos, toggleFavorito, verificarFavorito } from '../controllers/favoritoController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', authMiddleware, obtenerFavoritos);
router.post('/:ejercicioId', authMiddleware, toggleFavorito);
router.get('/:ejercicioId', authMiddleware, verificarFavorito);

export default router;