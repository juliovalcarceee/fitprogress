import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registro = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, email, password } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email }
    });

    if (usuarioExistente) {
      res.status(400).json({ error: 'El email ya está registrado' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        passwordHash
      }
    });

    const token = jwt.sign(
      { userId: usuario.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      res.status(400).json({ error: 'Email o contraseña incorrectos' });
      return;
    }

    const passwordValido = await bcrypt.compare(password, usuario.passwordHash);

    if (!passwordValido) {
      res.status(400).json({ error: 'Email o contraseña incorrectos' });
      return;
    }

    const token = jwt.sign(
      { userId: usuario.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({
      mensaje: 'Login correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

export const obtenerPerfil = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nombre: true,
        email: true,
        fotoUrl: true,
        edad: true,
        sexo: true,
        alturaCm: true,
        objetivo: true,
        createdAt: true
      }
    });

    if (!usuario) {
      res.status(404).json({ error: 'Usuario no encontrado' });
      return;
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

export const actualizarPerfil = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { nombre, edad, sexo, alturaCm, objetivo } = req.body;

    const usuario = await prisma.usuario.update({
      where: { id: userId },
      data: {
        nombre,
        edad,
        sexo,
        alturaCm,
        objetivo
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        fotoUrl: true,
        edad: true,
        sexo: true,
        alturaCm: true,
        objetivo: true
      }
    });

    res.json({
      mensaje: 'Perfil actualizado',
      usuario
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar perfil' });
  }
};