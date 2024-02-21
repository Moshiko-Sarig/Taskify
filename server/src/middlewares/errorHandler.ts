import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../errors/application.error';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err); //? Log unexpected errors for debugging
  return res.status(500).json({ error: 'Internal Server Error' });
}