import { Router, Response } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { createDeadlineSchema } from '@legal-ai/shared';
import { logger } from '../utils/logger';
import type { ApiResponse } from '@legal-ai/shared';

export const deadlinesRouter = Router();

// List deadlines
deadlinesRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const deadlines = await prisma.deadline.findMany({
      where: { userId: req.userId },
      orderBy: { dueDate: 'asc' },
    });

    // Auto-update overdue deadlines
    const now = new Date();
    const overdueIds = deadlines
      .filter((d) => d.status === 'PENDING' && new Date(d.dueDate) < now)
      .map((d) => d.id);

    if (overdueIds.length > 0) {
      await prisma.deadline.updateMany({
        where: { id: { in: overdueIds } },
        data: { status: 'OVERDUE' },
      });
      deadlines.forEach((d) => {
        if (overdueIds.includes(d.id)) {
          d.status = 'OVERDUE';
        }
      });
    }

    res.json({ success: true, data: deadlines });
  } catch (error) {
    logger.error('Error listing deadlines:', error);
    res.status(500).json({ success: false, error: 'Erro ao listar prazos' });
  }
});

// Get deadline by ID
deadlinesRouter.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const deadline = await prisma.deadline.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!deadline) {
      res.status(404).json({ success: false, error: 'Prazo não encontrado' });
      return;
    }

    res.json({ success: true, data: deadline });
  } catch (error) {
    logger.error('Error getting deadline:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar prazo' });
  }
});

// Create deadline
deadlinesRouter.post('/', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const data = createDeadlineSchema.parse(req.body);

    const deadline = await prisma.deadline.create({
      data: {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        type: data.type,
        caseNumber: data.caseNumber,
        court: data.court,
        priority: data.priority,
        userId: req.userId!,
        status: 'PENDING',
      },
    });

    res.status(201).json({ success: true, data: deadline });
  } catch (error) {
    logger.error('Error creating deadline:', error);
    if (error instanceof Error) {
      res.status(400).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Erro ao criar prazo' });
    }
  }
});

// Update deadline
deadlinesRouter.put('/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const deadline = await prisma.deadline.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!deadline) {
      res.status(404).json({ success: false, error: 'Prazo não encontrado' });
      return;
    }

    const updated = await prisma.deadline.update({
      where: { id: deadline.id },
      data: {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate ? new Date(req.body.dueDate) : undefined,
        status: req.body.status,
        priority: req.body.priority,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    logger.error('Error updating deadline:', error);
    res.status(500).json({ success: false, error: 'Erro ao atualizar prazo' });
  }
});

// Delete deadline
deadlinesRouter.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const deadline = await prisma.deadline.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!deadline) {
      res.status(404).json({ success: false, error: 'Prazo não encontrado' });
      return;
    }

    await prisma.deadline.delete({ where: { id: deadline.id } });
    res.json({ success: true, message: 'Prazo excluído com sucesso' });
  } catch (error) {
    logger.error('Error deleting deadline:', error);
    res.status(500).json({ success: false, error: 'Erro ao excluir prazo' });
  }
});
