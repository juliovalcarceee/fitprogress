import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerEvolucionPeso = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const medidas = await prisma.medidaCorporal.findMany({
      where: {
        usuarioId: userId,
        pesoKg: { not: null }
      },
      select: { fecha: true, pesoKg: true },
      orderBy: { fecha: 'asc' }
    });

    res.json(medidas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener evolución de peso' });
  }
};

export const obtenerEvolucionMedidas = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const medidas = await prisma.medidaCorporal.findMany({
      where: { usuarioId: userId },
      select: {
        fecha: true,
        medidaPechoCm: true,
        medidaCinturaCm: true,
        medidaBrazoCm: true,
        medidaPiernaCm: true,
        grasaPct: true
      },
      orderBy: { fecha: 'asc' }
    });

    res.json(medidas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener evolución de medidas' });
  }
};

export const obtenerCargasMaximas = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { ejercicioId } = req.params;

    const series = await prisma.serieLog.findMany({
      where: {
        ejercicioId: Number(ejercicioId),
        sesion: { usuarioId: userId }
      },
      include: {
        sesion: { select: { fecha: true } }
      },
      orderBy: { sesion: { fecha: 'asc' } }
    });

    const cargasPorFecha: { [key: string]: number } = {};
    series.forEach(serie => {
      const fecha = serie.sesion.fecha.toISOString().split('T')[0];
      const peso = Number(serie.pesoKg);
      if (!cargasPorFecha[fecha] || peso > cargasPorFecha[fecha]) {
        cargasPorFecha[fecha] = peso;
      }
    });

    const resultado = Object.entries(cargasPorFecha).map(([fecha, pesoMax]) => ({
      fecha,
      pesoMax
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cargas máximas' });
  }
};

export const obtenerVolumenPorSesion = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const sesiones = await prisma.sesionEntrenamiento.findMany({
      where: { usuarioId: userId },
      include: {
        seriesLog: true
      },
      orderBy: { fecha: 'asc' }
    });

    const resultado = sesiones.map(sesion => {
      const volumenTotal = sesion.seriesLog.reduce((total, serie) => {
        return total + (Number(serie.pesoKg) * serie.repeticiones);
      }, 0);

      return {
        fecha: sesion.fecha,
        duracionMin: sesion.duracionMin,
        totalSeries: sesion.seriesLog.length,
        volumenTotal
      };
    });

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener volumen por sesión' });
  }
};

export const obtenerResumen = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const totalSesiones = await prisma.sesionEntrenamiento.count({
      where: { usuarioId: userId }
    });

    const totalRutinas = await prisma.rutina.count({
      where: { usuarioId: userId, archivada: false }
    });

    const ultimaMedida = await prisma.medidaCorporal.findFirst({
      where: { usuarioId: userId },
      orderBy: { fecha: 'desc' }
    });

    const ultimaSesion = await prisma.sesionEntrenamiento.findFirst({
      where: { usuarioId: userId },
      orderBy: { fecha: 'desc' },
      include: { rutina: { select: { nombre: true } } }
    });

    res.json({
      totalSesiones,
      totalRutinas,
      ultimaMedida,
      ultimaSesion
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener resumen' });
  }
};