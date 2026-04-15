import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const comprobarValidacion = (req: Request, res: Response, next: NextFunction): void => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    res.status(400).json({
      error: 'Datos no válidos',
      detalles: errores.array().map(err => ({
        campo: (err as any).path,
        mensaje: err.msg
      }))
    });
    return;
  }

  next();
};

export const manejarErrorGeneral = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('Error:', err.message);

  res.status(500).json({
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
};