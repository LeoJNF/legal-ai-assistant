import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { ApiResponse } from '@legal-ai/shared';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Token de autenticação não fornecido' });
    return;
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
      role: string;
    };
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ success: false, error: 'Token inválido ou expirado' });
  }
}
