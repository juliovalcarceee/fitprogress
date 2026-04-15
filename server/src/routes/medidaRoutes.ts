import { Router } from 'express';
import {
  registrarMedida,
  obtenerMedidas,
  actualizarMedida,
  eliminarMedida
} from '../controllers/medidaController';
import {
  obtenerEvolucionPeso,
  obtenerEvolucionMedidas,
  obtenerCargasMaximas,
  obtenerVolumenPorSesion,
  obtenerResumen
} from '../controllers/estadisticaController';
import { authMiddleware } from '../middleware/auth';
import { validarMedida } from '../middleware/validaciones';
import { comprobarValidacion } from '../middleware/manejarErrores';

const router = Router();

// Medidas corporales
router.post('/', authMiddleware, validarMedida, comprobarValidacion, registrarMedida);
router.get('/', authMiddleware, obtenerMedidas);
router.put('/:id', authMiddleware, validarMedida, comprobarValidacion, actualizarMedida);
router.delete('/:id', authMiddleware, eliminarMedida);

// Estadísticas y gráficos
router.get('/estadisticas/peso', authMiddleware, obtenerEvolucionPeso);
router.get('/estadisticas/medidas', authMiddleware, obtenerEvolucionMedidas);
router.get('/estadisticas/cargas/:ejercicioId', authMiddleware, obtenerCargasMaximas);
router.get('/estadisticas/volumen', authMiddleware, obtenerVolumenPorSesion);
router.get('/estadisticas/resumen', authMiddleware, obtenerResumen);

export default router;