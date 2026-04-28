/**
 * FitProgress - Servidor Backend
 * API REST para la gestión de rutinas de entrenamiento
 * Autor: Julio Valcárcel Vigier
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import ejercicioRoutes from './routes/ejercicioRoutes';
import rutinaRoutes from './routes/rutinaRoutes';
import sesionRoutes from './routes/sesionRoutes';
import medidaRoutes from './routes/medidaRoutes';
import favoritoRoutes from './routes/favoritoRoutes';
import { manejarErrorGeneral } from './middleware/manejarErrores';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/sesiones', sesionRoutes);
app.use('/api/medidas', medidaRoutes);
app.use('/api/favoritos', favoritoRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API FitProgress funcionando', version: '1.0.0' });
});

app.use(manejarErrorGeneral);

app.listen(PORT, () => {
  console.log(`Servidor FitProgress corriendo en puerto ${PORT}`);
});

export default app;