import { Router, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { generatePetition, PETITION_TEMPLATES } from '@legal-ai/ai';
import { generatePetitionSchema } from '@legal-ai/shared';
import { logger } from '../utils/logger';
import type { ApiResponse } from '@legal-ai/shared';

export const petitionsRouter = Router();

// List petitions
petitionsRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const petitions = await prisma.petition.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: petitions });
  } catch (error) {
    logger.error('Error listing petitions:', error);
    res.status(500).json({ success: false, error: 'Erro ao listar petições' });
  }
});

// Get templates
petitionsRouter.get('/templates', authenticate, (_req, res: Response<ApiResponse>) => {
  res.json({ success: true, data: PETITION_TEMPLATES });
});

// Get petition by ID
petitionsRouter.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const petition = await prisma.petition.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!petition) {
      res.status(404).json({ success: false, error: 'Petição não encontrada' });
      return;
    }

    res.json({ success: true, data: petition });
  } catch (error) {
    logger.error('Error getting petition:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar petição' });
  }
});

// Generate petition with AI
petitionsRouter.post('/generate', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const data = generatePetitionSchema.parse(req.body);
    const content = await generatePetition(data);

    const petition = await prisma.petition.create({
      data: {
        title: `${data.type} - ${data.clientName}`,
        type: data.type,
        content,
        clientName: data.clientName,
        clientCpf: data.clientCpf,
        caseNumber: data.caseNumber,
        court: data.court,
        userId: req.userId!,
        status: 'DRAFT',
      },
    });

    res.status(201).json({ success: true, data: petition });
  } catch (error) {
    logger.error('Error generating petition:', error);
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Erro ao gerar petição' });
    }
  }
});

// Update petition
petitionsRouter.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const petition = await prisma.petition.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!petition) {
      res.status(404).json({ success: false, error: 'Petição não encontrada' });
      return;
    }

    const updated = await prisma.petition.update({
      where: { id: petition.id },
      data: {
        title: req.body.title,
        content: req.body.content,
        status: req.body.status,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    logger.error('Error updating petition:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar petição' });
  }
});

// Delete petition
petitionsRouter.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const petition = await prisma.petition.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!petition) {
      res.status(404).json({ success: false, error: 'Petição não encontrada' });
      return;
    }

    await prisma.petition.delete({ where: { id: petition.id } });
    res.json({ success: true, message: 'Petição excluída com sucesso' });
  } catch (error) {
    logger.error('Error deleting petition:', error);
    res.status(500).json({ success: false, error: 'Erro ao excluir petição' });
  }
});
