export interface Petition {
  id: string;
  title: string;
  type: PetitionType;
  status: PetitionStatus;
  content: string;
  clientName: string;
  clientCpf?: string;
  caseNumber?: string;
  court?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PetitionType =
  | 'INICIAL'
  | 'CONTESTACAO'
  | 'RECURSO'
  | 'HABEAS_CORPUS'
  | 'MANDADO_SEGURANCA'
  | 'EMBARGOS_DECLARACAO'
  | 'AGRAVO'
  | 'OUTROS';

export type PetitionStatus = 'DRAFT' | 'REVIEW' | 'FINAL';

export interface GeneratePetitionRequest {
  type: PetitionType;
  clientName: string;
  clientCpf?: string;
  caseNumber?: string;
  court?: string;
  facts: string;
  legalGrounds?: string;
  request: string;
}

export interface PetitionTemplate {
  id: string;
  name: string;
  type: PetitionType;
  description: string;
}
