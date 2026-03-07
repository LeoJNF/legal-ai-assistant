import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  oab: z.string().optional(),
});

export const createDeadlineSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  type: z.enum([
    'PRAZO_RECURSAL',
    'PRAZO_CONTESTACAO',
    'AUDIENCIA',
    'JULGAMENTO',
    'PRAZO_MANIFESTACAO',
    'OUTROS',
  ]),
  caseNumber: z.string().optional(),
  court: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
});

export const generatePetitionSchema = z.object({
  type: z.enum([
    'INICIAL',
    'CONTESTACAO',
    'RECURSO',
    'HABEAS_CORPUS',
    'MANDADO_SEGURANCA',
    'EMBARGOS_DECLARACAO',
    'AGRAVO',
    'OUTROS',
  ]),
  clientName: z.string().min(1, 'Nome do cliente é obrigatório'),
  clientCpf: z.string().optional(),
  caseNumber: z.string().optional(),
  court: z.string().optional(),
  facts: z.string().min(10, 'Fatos devem ter no mínimo 10 caracteres'),
  legalGrounds: z.string().optional(),
  request: z.string().min(10, 'Pedido deve ter no mínimo 10 caracteres'),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(1, 'Mensagem é obrigatória'),
});

export const legalSearchSchema = z.object({
  query: z.string().min(1, 'Busca é obrigatória'),
  type: z.enum(['JURISPRUDENCIA', 'LEGISLACAO', 'ALL']).optional(),
  limit: z.number().min(1).max(50).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateDeadlineInput = z.infer<typeof createDeadlineSchema>;
export type GeneratePetitionInput = z.infer<typeof generatePetitionSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type LegalSearchInput = z.infer<typeof legalSearchSchema>;
