import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const iniciarSesion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { rutinaId, diaSemana } = req.body;

    const sesion = await prisma.sesionEntrenamiento.create({
      data: {
        usuarioId: userId,
        rutinaId: rutinaId || null,
        fecha: new Date(),
        diaSemana,
        notas: ''
      }
    });

    res.status(201).json({
      mensaje: 'Sesión iniciada',
      sesion
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión de entrenamiento' });
  }
};

export const finalizarSesion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { duracionMin, notas } = req.body;

    const sesion = await prisma.sesionEntrenamiento.findFirst({
      where: { id: Number(id), usuarioId: userId }
    });

    if (!sesion) {
      res.status(404).json({ error: 'Sesión no encontrada' });
      return;
    }

    const sesionActualizada = await prisma.sesionEntrenamiento.update({
      where: { id: Number(id) },
      data: { duracionMin, notas },
      include: {
        seriesLog: {
          include: { ejercicio: true },
          orderBy: [{ ejercicioId: 'asc' }, { numSerie: 'asc' }]
        }
      }
    });

    res.json({
      mensaje: 'Sesión finalizada',
      sesion: sesionActualizada
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al finalizar sesión' });
  }
};

export const obtenerHistorial = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const sesiones = await prisma.sesionEntrenamiento.findMany({
      where: { usuarioId: userId },
      include: {
        rutina: { select: { nombre: true } },
        seriesLog: {
          include: { ejercicio: { select: { nombre: true, grupoMuscular: true } } },
          orderBy: [{ ejercicioId: 'asc' }, { numSerie: 'asc' }]
        }
      },
      orderBy: { fecha: 'desc' }
    });

    res.json(sesiones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};

export const obtenerSesionPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const sesion = await prisma.sesionEntrenamiento.findFirst({
      where: { id: Number(id), usuarioId: userId },
      include: {
        rutina: { select: { nombre: true } },
        seriesLog: {
          include: { ejercicio: true },
          orderBy: [{ ejercicioId: 'asc' }, { numSerie: 'asc' }]
        }
      }
    });

    if (!sesion) {
      res.status(404).json({ error: 'Sesión no encontrada' });
      return;
    }

    res.json(sesion);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener sesión' });
  }
};

export const eliminarSesion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const sesion = await prisma.sesionEntrenamiento.findFirst({
      where: { id: Number(id), usuarioId: userId }
    });

    if (!sesion) {
      res.status(404).json({ error: 'Sesión no encontrada' });
      return;
    }

    await prisma.sesionEntrenamiento.delete({
      where: { id: Number(id) }
    });

    res.json({ mensaje: 'Sesión eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar sesión' });
  }
};

export const registrarSerie = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { sesionId, ejercicioId, numSerie, pesoKg, repeticiones, alFallo, notas } = req.body;

    const sesion = await prisma.sesionEntrenamiento.findFirst({
      where: { id: sesionId, usuarioId: userId }
    });

    if (!sesion) {
      res.status(404).json({ error: 'Sesión no encontrada' });
      return;
    }

    const serie = await prisma.serieLog.create({
      data: {
        sesionId,
        ejercicioId,
        numSerie,
        pesoKg,
        repeticiones,
        alFallo: alFallo || false,
        notas
      },
      include: { ejercicio: { select: { nombre: true } } }
    });

    res.status(201).json({
      mensaje: 'Serie registrada',
      serie
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar serie' });
  }
};

export const actualizarSerie = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { pesoKg, repeticiones, alFallo, notas } = req.body;

    const serie = await prisma.serieLog.findUnique({
      where: { id: Number(id) },
      include: { sesion: true }
    });

    if (!serie || serie.sesion.usuarioId !== userId) {
      res.status(404).json({ error: 'Serie no encontrada' });
      return;
    }

    const serieActualizada = await prisma.serieLog.update({
      where: { id: Number(id) },
      data: { pesoKg, repeticiones, alFallo, notas }
    });

    res.json({
      mensaje: 'Serie actualizada',
      serie: serieActualizada
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar serie' });
  }
};

export const eliminarSerie = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const serie = await prisma.serieLog.findUnique({
      where: { id: Number(id) },
      include: { sesion: true }
    });

    if (!serie || serie.sesion.usuarioId !== userId) {
      res.status(404).json({ error: 'Serie no encontrada' });
      return;
    }

    await prisma.serieLog.delete({
      where: { id: Number(id) }
    });

    res.json({ mensaje: 'Serie eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar serie' });
  }
};