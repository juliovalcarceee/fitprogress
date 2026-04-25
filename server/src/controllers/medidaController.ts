/**
 * Controlador de medidas corporales
 * Registro y consulta de medidas físicas del usuario
 */
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const registrarMedida = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { fecha, pesoKg, grasaPct, medidaPechoCm, medidaCinturaCm, medidaBrazoCm, medidaPiernaCm, notas } = req.body;

    const medida = await prisma.medidaCorporal.create({
      data: {
        usuarioId: userId,
        fecha: new Date(fecha),
        pesoKg,
        grasaPct,
        medidaPechoCm,
        medidaCinturaCm,
        medidaBrazoCm,
        medidaPiernaCm,
        notas
      }
    });

    res.status(201).json({
      mensaje: 'Medida registrada correctamente',
      medida
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar medida' });
  }
};

export const obtenerMedidas = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const medidas = await prisma.medidaCorporal.findMany({
      where: { usuarioId: userId },
      orderBy: { fecha: 'desc' }
    });

    res.json(medidas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener medidas' });
  }
};

export const actualizarMedida = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { fecha, pesoKg, grasaPct, medidaPechoCm, medidaCinturaCm, medidaBrazoCm, medidaPiernaCm, notas } = req.body;

    const medida = await prisma.medidaCorporal.findFirst({
      where: { id: Number(id), usuarioId: userId }
    });

    if (!medida) {
      res.status(404).json({ error: 'Medida no encontrada' });
      return;
    }

    const medidaActualizada = await prisma.medidaCorporal.update({
      where: { id: Number(id) },
      data: {
        fecha: fecha ? new Date(fecha) : undefined,
        pesoKg,
        grasaPct,
        medidaPechoCm,
        medidaCinturaCm,
        medidaBrazoCm,
        medidaPiernaCm,
        notas
      }
    });

    res.json({
      mensaje: 'Medida actualizada',
      medida: medidaActualizada
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar medida' });
  }
};

export const eliminarMedida = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const medida = await prisma.medidaCorporal.findFirst({
      where: { id: Number(id), usuarioId: userId }
    });

    if (!medida) {
      res.status(404).json({ error: 'Medida no encontrada' });
      return;
    }

    await prisma.medidaCorporal.delete({
      where: { id: Number(id) }
    });

    res.json({ mensaje: 'Medida eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar medida' });
  }
};