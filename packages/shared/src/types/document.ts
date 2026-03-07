export interface Document {
  id: string;
  title: string;
  type: DocumentType;
  status: DocumentStatus;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  analysis?: DocumentAnalysis;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentType = 'CONTRACT' | 'PETITION' | 'COURT_DECISION' | 'LEGISLATION' | 'OTHER';

export type DocumentStatus = 'PENDING' | 'ANALYZING' | 'ANALYZED' | 'ERROR';

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  summary: string;
  keyPoints: string[];
  risks: Risk[];
  suggestions: string[];
  clauses: Clause[];
  analyzedAt: Date;
}

export interface Risk {
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  location?: string;
}

export interface Clause {
  title: string;
  content: string;
  type: string;
}

export interface UploadDocumentRequest {
  title: string;
  type: DocumentType;
}
