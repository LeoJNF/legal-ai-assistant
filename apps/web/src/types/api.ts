export interface DocumentAnalysis {
  id: string;
  fileName: string;
  summary: string;
  keyPoints: string[];
  risks: string[];
  recommendations: string[];
  analyzedAt: string;
}

export interface PetitionTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface GeneratedPetition {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface LegalResearch {
  id: string;
  query: string;
  results: LegalCase[];
  analyzedAt: string;
}

export interface LegalCase {
  id: string;
  title: string;
  court: string;
  date: string;
  summary: string;
  relevance: number;
}
