/**
 * Controlador de rutinas
 * CRUD de rutinas con duplicar, archivar y marcar como activa
 */
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerRutinas = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const rutinas = await prisma.rutina.findMany({
      where: { usuarioId: userId },
      include: {
        rutinaEjercicios: {
          include: { ejercicio: true },
          orderBy: [{ diaSemana: 'asc' }, { orden: 'asc' }]
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(rutinas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rutinas' });
  }
};

export const obtenerRutinaPorId = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const rutina = await prisma.rutina.findFirst({
      where: { id: Number(id), usuarioId: userId },
      include: {
        rutinaEjercicios: {
          include: { ejercicio: true },
          orderBy: [{ diaSemana: 'asc' }, { orden: 'asc' }]
        }
      }
    });
    if (!rutina) { res.status(404).json({ error: 'Rutina no encontrada' }); return; }
    res.json(rutina);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener rutina' });
  }
};

export const crearRutina = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { nombre, descripcion, ejercicios } = req.body;
    const rutina = await prisma.rutina.create({
      data: {
        usuarioId: userId, nombre, descripcion,
        rutinaEjercicios: {
          create: ejercicios?.map((ej: any) => ({
            ejercicioId: ej.ejercicioId, diaSemana: ej.diaSemana, orden: ej.orden,
            seriesObjetivo: ej.seriesObjetivo, repeticionesObj: ej.repeticionesObj,
            descansoSeg: ej.descansoSeg, notas: ej.notas
          })) || []
        }
      },
      include: { rutinaEjercicios: { include: { ejercicio: true }, orderBy: [{ diaSemana: 'asc' }, { orden: 'asc' }] } }
    });
    res.status(201).json({ mensaje: 'Rutina creada correctamente', rutina });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear rutina' });
  }
};

export const actualizarRutina = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { nombre, descripcion, ejercicios } = req.body;
    const rutinaExistente = await prisma.rutina.findFirst({ where: { id: Number(id), usuarioId: userId } });
    if (!rutinaExistente) { res.status(404).json({ error: 'Rutina no encontrada' }); return; }
    if (ejercicios) { await prisma.rutinaEjercicio.deleteMany({ where: { rutinaId: Number(id) } }); }
    const rutina = await prisma.rutina.update({
      where: { id: Number(id) },
      data: {
        nombre, descripcion,
        rutinaEjercicios: ejercicios ? {
          create: ejercicios.map((ej: any) => ({
            ejercicioId: ej.ejercicioId, diaSemana: ej.diaSemana, orden: ej.orden,
            seriesObjetivo: ej.seriesObjetivo, repeticionesObj: ej.repeticionesObj,
            descansoSeg: ej.descansoSeg, notas: ej.notas
          }))
        } : undefined
      },
      include: { rutinaEjercicios: { include: { ejercicio: true }, orderBy: [{ diaSemana: 'asc' }, { orden: 'asc' }] } }
    });
    res.json({ mensaje: 'Rutina actualizada', rutina });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rutina' });
  }
};

export const eliminarRutina = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const rutina = await prisma.rutina.findFirst({ where: { id: Number(id), usuarioId: userId } });
    if (!rutina) { res.status(404).json({ error: 'Rutina no encontrada' }); return; }
    await prisma.rutina.delete({ where: { id: Number(id) } });
    res.json({ mensaje: 'Rutina eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar rutina' });
  }
};

export const duplicarRutina = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const rutinaOriginal = await prisma.rutina.findFirst({
      where: { id: Number(id), usuarioId: userId },
      include: { rutinaEjercicios: true }
    });
    if (!rutinaOriginal) { res.status(404).json({ error: 'Rutina no encontrada' }); return; }
    const nuevaRutina = await prisma.rutina.create({
      data: {
        usuarioId: userId, nombre: rutinaOriginal.nombre + ' (copia)', descripcion: rutinaOriginal.descripcion,
        rutinaEjercicios: {
          create: rutinaOriginal.rutinaEjercicios.map(ej => ({
            ejercicioId: ej.ejercicioId, diaSemana: ej.diaSemana, orden: ej.orden,
            seriesObjetivo: ej.seriesObjetivo, repeticionesObj: ej.repeticionesObj,
            descansoSeg: ej.descansoSeg, notas: ej.notas
          }))
        }
      },
      include: { rutinaEjercicios: { include: { ejercicio: true }, orderBy: [{ diaSemana: 'asc' }, { orden: 'asc' }] } }
    });
    res.status(201).json({ mensaje: 'Rutina duplicada correctamente', rutina: nuevaRutina });
  } catch (error) {
    res.status(500).json({ error: 'Error al duplicar rutina' });
  }
};

export const marcarRutinaActiva = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const rutina = await prisma.rutina.findFirst({ where: { id: Number(id), usuarioId: userId } });
    if (!rutina) { res.status(404).json({ error: 'Rutina no encontrada' }); return; }
    await prisma.rutina.updateMany({ where: { usuarioId: userId }, data: { esActiva: false } });
    const rutinaActualizada = await prisma.rutina.update({ where: { id: Number(id) }, data: { esActiva: true } });
    res.json({ mensaje: 'Rutina marcada como activa', rutina: rutinaActualizada });
  } catch (error) {
    res.status(500).json({ error: 'Error al activar rutina' });
  }
};

export const archivarRutina = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const rutina = await prisma.rutina.findFirst({ where: { id: Number(id), usuarioId: userId } });
    if (!rutina) { res.status(404).json({ error: 'Rutina no encontrada' }); return; }
    const rutinaActualizada = await prisma.rutina.update({
      where: { id: Number(id) },
      data: { archivada: !rutina.archivada, esActiva: rutina.archivada ? rutina.esActiva : false }
    });
    res.json({ mensaje: rutinaActualizada.archivada ? 'Rutina archivada' : 'Rutina desarchivada', rutina: rutinaActualizada });
  } catch (error) {
    res.status(500).json({ error: 'Error al archivar rutina' });
  }
};