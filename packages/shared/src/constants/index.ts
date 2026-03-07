export const PETITION_TYPES = {
  INICIAL: 'Petição Inicial',
  CONTESTACAO: 'Contestação',
  RECURSO: 'Recurso',
  HABEAS_CORPUS: 'Habeas Corpus',
  MANDADO_SEGURANCA: 'Mandado de Segurança',
  EMBARGOS_DECLARACAO: 'Embargos de Declaração',
  AGRAVO: 'Agravo',
  OUTROS: 'Outros',
} as const;

export const DOCUMENT_TYPES = {
  CONTRACT: 'Contrato',
  PETITION: 'Petição',
  COURT_DECISION: 'Decisão Judicial',
  LEGISLATION: 'Legislação',
  OTHER: 'Outros',
} as const;

export const DEADLINE_TYPES = {
  PRAZO_RECURSAL: 'Prazo Recursal',
  PRAZO_CONTESTACAO: 'Prazo de Contestação',
  AUDIENCIA: 'Audiência',
  JULGAMENTO: 'Julgamento',
  PRAZO_MANIFESTACAO: 'Prazo de Manifestação',
  OUTROS: 'Outros',
} as const;

export const PRIORITY_LABELS = {
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
} as const;

export const STATUS_LABELS = {
  PENDING: 'Pendente',
  COMPLETED: 'Concluído',
  OVERDUE: 'Atrasado',
  CANCELLED: 'Cancelado',
  DRAFT: 'Rascunho',
  REVIEW: 'Em Revisão',
  FINAL: 'Final',
  ANALYZING: 'Analisando',
  ANALYZED: 'Analisado',
  ERROR: 'Erro',
} as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
