import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import type { ApiResponse } from '@legal-ai/shared';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void {
  logger.error('Unhandled error:', error);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: 'Dados inválidos',
      message: error.errors.map((e) => e.message).join(', '),
    });
    return;
  }

  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor',
  });
}
