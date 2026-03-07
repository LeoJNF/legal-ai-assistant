import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../utils/prisma';
import { authenticate, AuthenticatedRequest } from '../middlewares/auth';
import { analyzeDocument } from '@legal-ai/ai';
import { logger } from '../utils/logger';
import type { ApiResponse } from '@legal-ai/shared';

export const documentsRouter = Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760') },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido. Use PDF ou DOCX.'));
    }
  },
});

// List documents
documentsRouter.get('/', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const documents = await prisma.document.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: documents });
  } catch (error) {
    logger.error('Error listing documents:', error);
    res.status(500).json({ success: false, error: 'Erro ao listar documentos' });
  }
});

// Get document by ID
documentsRouter.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!document) {
      res.status(404).json({ success: false, error: 'Documento não encontrado' });
      return;
    }

    res.json({ success: true, data: document });
  } catch (error) {
    logger.error('Error getting document:', error);
    res.status(500).json({ success: false, error: 'Erro ao buscar documento' });
  }
});

// Upload document
documentsRouter.post(
  '/upload',
  authenticate,
  upload.single('file'),
  async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'Arquivo não fornecido' });
      return;
    }

    try {
      const { title, type } = req.body;

      const document = await prisma.document.create({
        data: {
          title: title || req.file.originalname,
          type: type || 'OTHER',
          fileUrl: req.file.path,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          userId: req.userId!,
          status: 'PENDING',
        },
      });

      res.status(201).json({ success: true, data: document });
    } catch (error) {
      logger.error('Error uploading document:', error);
      res.status(500).json({ success: false, error: 'Erro ao fazer upload do documento' });
    }
  }
);

// Analyze document with AI
documentsRouter.post('/:id/analyze', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!document) {
      res.status(404).json({ success: false, error: 'Documento não encontrado' });
      return;
    }

    // Update status to analyzing
    await prisma.document.update({
      where: { id: document.id },
      data: { status: 'ANALYZING' },
    });

    // Read file and analyze
    const fs = await import('fs');
    const buffer = fs.readFileSync(document.fileUrl);
    const analysis = await analyzeDocument(buffer, document.mimeType);

    // Update status to analyzed
    await prisma.document.update({
      where: { id: document.id },
      data: { status: 'ANALYZED' },
    });

    res.json({ success: true, data: analysis });
  } catch (error) {
    logger.error('Error analyzing document:', error);
    await prisma.document.update({
      where: { id: req.params.id },
      data: { status: 'ERROR' },
    }).catch(() => {});
    res.status(500).json({ success: false, error: 'Erro ao analisar documento' });
  }
});

// Delete document
documentsRouter.delete('/:id', authenticate, async (req: AuthenticatedRequest, res: Response<ApiResponse>) => {
  try {
    const document = await prisma.document.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });

    if (!document) {
      res.status(404).json({ success: false, error: 'Documento não encontrado' });
      return;
    }

    await prisma.document.delete({ where: { id: document.id } });
    res.json({ success: true, message: 'Documento excluído com sucesso' });
  } catch (error) {
    logger.error('Error deleting document:', error);
    res.status(500).json({ success: false, error: 'Erro ao excluir documento' });
  }
});
