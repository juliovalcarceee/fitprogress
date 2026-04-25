/**
 * Controlador de ejercicios
 * CRUD del catálogo de ejercicios predefinidos y personalizados
 */
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerEjercicios = async (req: Request, res: Response): Promise<void> => {
  try {
    const { grupoMuscular, busqueda } = req.query;
    const userId = (req as any).userId;

    const where: any = {
      OR: [
        { esPredefinido: true },
        { creadoPor: userId }
      ]
    };

    if (grupoMuscular) {
      where.grupoMuscular = grupoMuscular as string;
    }

    if (busqueda) {
      where.nombre = {
        contains: busqueda as string,
        mode: 'insensitive'
      };
    }

    const ejercicios = await prisma.ejercicio.findMany({
      where,
      orderBy: [
        { grupoMuscular: 'asc' },
        { nombre: 'asc' }
      ]
    });

    res.json(ejercicios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ejercicios' });
  }
};

export const obtenerEjercicioPorId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const ejercicio = await prisma.ejercicio.findUnique({
      where: { id: Number(id) }
    });

    if (!ejercicio) {
      res.status(404).json({ error: 'Ejercicio no encontrado' });
      return;
    }

    res.json(ejercicio);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener ejercicio' });
  }
};

export const crearEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { nombre, descripcion, grupoMuscular, imagenUrl } = req.body;

    const ejercicio = await prisma.ejercicio.create({
      data: {
        nombre,
        descripcion,
        grupoMuscular,
        imagenUrl,
        esPredefinido: false,
        creadoPor: userId
      }
    });

    res.status(201).json({
      mensaje: 'Ejercicio creado correctamente',
      ejercicio
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear ejercicio' });
  }
};

export const actualizarEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { nombre, descripcion, grupoMuscular, imagenUrl } = req.body;

    const ejercicio = await prisma.ejercicio.findUnique({
      where: { id: Number(id) }
    });

    if (!ejercicio) {
      res.status(404).json({ error: 'Ejercicio no encontrado' });
      return;
    }

    if (ejercicio.esPredefinido || ejercicio.creadoPor !== userId) {
      res.status(403).json({ error: 'No puedes editar este ejercicio' });
      return;
    }

    const ejercicioActualizado = await prisma.ejercicio.update({
      where: { id: Number(id) },
      data: { nombre, descripcion, grupoMuscular, imagenUrl }
    });

    res.json({
      mensaje: 'Ejercicio actualizado',
      ejercicio: ejercicioActualizado
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar ejercicio' });
  }
};

export const eliminarEjercicio = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const ejercicio = await prisma.ejercicio.findUnique({
      where: { id: Number(id) }
    });

    if (!ejercicio) {
      res.status(404).json({ error: 'Ejercicio no encontrado' });
      return;
    }

    if (ejercicio.esPredefinido || ejercicio.creadoPor !== userId) {
      res.status(403).json({ error: 'No puedes eliminar este ejercicio' });
      return;
    }

    await prisma.ejercicio.delete({
      where: { id: Number(id) }
    });

    res.json({ mensaje: 'Ejercicio eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar ejercicio' });
  }
};

export const obtenerGruposMusculares = async (req: Request, res: Response): Promise<void> => {
  try {
    const grupos = await prisma.ejercicio.findMany({
      select: { grupoMuscular: true },
      distinct: ['grupoMuscular'],
      orderBy: { grupoMuscular: 'asc' }
    });

    res.json(grupos.map(g => g.grupoMuscular));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener grupos musculares' });
  }
};