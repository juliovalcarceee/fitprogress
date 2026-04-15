import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import ejercicioRoutes from './routes/ejercicioRoutes';
import rutinaRoutes from './routes/rutinaRoutes';
import sesionRoutes from './routes/sesionRoutes';
import medidaRoutes from './routes/medidaRoutes';
import { manejarErrorGeneral } from './middleware/manejarErrores';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/ejercicios', ejercicioRoutes);
app.use('/api/rutinas', rutinaRoutes);
app.use('/api/sesiones', sesionRoutes);
app.use('/api/medidas', medidaRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API FitProgress funcionando' });
});

// Manejo de errores
app.use(manejarErrorGeneral);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

export default app;