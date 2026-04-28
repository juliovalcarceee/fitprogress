/**
 * Controlador de ejercicios favoritos
 * Permite marcar y desmarcar ejercicios como favoritos
 */

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerFavoritos = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const favoritos = await prisma.ejercicioFavorito.findMany({
      where: { usuarioId: userId },
      include: { ejercicio: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(favoritos.map(f => f.ejercicio));
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
};

export const toggleFavorito = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { ejercicioId } = req.params;

    const existente = await prisma.ejercicioFavorito.findUnique({
      where: {
        usuarioId_ejercicioId: {
          usuarioId: userId,
          ejercicioId: Number(ejercicioId)
        }
      }
    });

    if (existente) {
      await prisma.ejercicioFavorito.delete({ where: { id: existente.id } });
      res.json({ mensaje: 'Ejercicio eliminado de favoritos', esFavorito: false });
    } else {
      await prisma.ejercicioFavorito.create({
        data: { usuarioId: userId, ejercicioId: Number(ejercicioId) }
      });
      res.json({ mensaje: 'Ejercicio añadido a favoritos', esFavorito: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar favorito' });
  }
};

export const verificarFavorito = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { ejercicioId } = req.params;

    const existente = await prisma.ejercicioFavorito.findUnique({
      where: {
        usuarioId_ejercicioId: {
          usuarioId: userId,
          ejercicioId: Number(ejercicioId)
        }
      }
    });

    res.json({ esFavorito: !!existente });
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar favorito' });
  }
};