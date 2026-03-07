import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { HumanMessage } from '@langchain/core/messages';
import { getChatModel } from '../langchain/config';
import { DOCUMENT_ANALYSIS_PROMPT } from '../prompts';
import type { DocumentAnalysis } from '@legal-ai/shared';

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}

export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function extractTextFromDocument(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(buffer);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return extractTextFromDOCX(buffer);
  }
  throw new Error(`Unsupported file type: ${mimeType}`);
}

function chunkText(text: string, chunkSize = 4000, overlap = 200): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.substring(start, end));
    start = end - overlap;
    if (start >= text.length) break;
  }
  return chunks;
}

export async function analyzeDocument(
  buffer: Buffer,
  mimeType: string
): Promise<DocumentAnalysis> {
  const text = await extractTextFromDocument(buffer, mimeType);
  const chunks = chunkText(text);
  const relevantContent = chunks.slice(0, 3).join('\n\n...\n\n');

  const model = getChatModel();
  const prompt = DOCUMENT_ANALYSIS_PROMPT.replace('{document}', relevantContent);

  const response = await model.invoke([new HumanMessage(prompt)]);
  const content = response.content as string;

  // Extract JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse document analysis response');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    id: '',
    documentId: '',
    summary: parsed.summary || '',
    keyPoints: parsed.keyPoints || [],
    risks: parsed.risks || [],
    suggestions: parsed.suggestions || [],
    clauses: parsed.clauses || [],
    analyzedAt: new Date(),
  };
}
