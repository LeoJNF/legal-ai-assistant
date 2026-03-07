export interface Deadline {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  type: DeadlineType;
  status: DeadlineStatus;
  caseNumber?: string;
  court?: string;
  priority: DeadlinePriority;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DeadlineType =
  | 'PRAZO_RECURSAL'
  | 'PRAZO_CONTESTACAO'
  | 'AUDIENCIA'
  | 'JULGAMENTO'
  | 'PRAZO_MANIFESTACAO'
  | 'OUTROS';

export type DeadlineStatus = 'PENDING' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';

export type DeadlinePriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CreateDeadlineRequest {
  title: string;
  description?: string;
  dueDate: string;
  type: DeadlineType;
  caseNumber?: string;
  court?: string;
  priority: DeadlinePriority;
}
