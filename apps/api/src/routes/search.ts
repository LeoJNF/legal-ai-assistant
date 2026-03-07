import { Router, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { searchLegalContent } from '@legal-ai/ai';
import { legalSearchSchema } from '@legal-ai/shared';
import { logger } from '../utils/logger';
import type { ApiResponse } from '@legal-ai/shared';

export const searchRouter = Router();

searchRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const data = legalSearchSchema.parse(req.body);
    const results = await searchLegalContent(data.query, data.type);
    res.json({ success: true, data: results });
  } catch (error) {
    logger.error('Error searching legal content:', error);
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Erro ao realizar pesquisa' });
    }
  }
});
