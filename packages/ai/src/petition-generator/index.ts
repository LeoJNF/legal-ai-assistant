import { HumanMessage } from '@langchain/core/messages';
import { getChatModel } from '../langchain/config';
import { PETITION_GENERATION_PROMPT } from '../prompts';
import type { GeneratePetitionRequest } from '@legal-ai/shared';

const PETITION_TYPE_NAMES: Record<string, string> = {
  INICIAL: 'Petição Inicial',
  CONTESTACAO: 'Contestação',
  RECURSO: 'Recurso de Apelação',
  HABEAS_CORPUS: 'Habeas Corpus',
  MANDADO_SEGURANCA: 'Mandado de Segurança',
  EMBARGOS_DECLARACAO: 'Embargos de Declaração',
  AGRAVO: 'Agravo de Instrumento',
  OUTROS: 'Petição',
};

export async function generatePetition(request: GeneratePetitionRequest): Promise<string> {
  const model = getChatModel();

  const prompt = PETITION_GENERATION_PROMPT
    .replace('{petitionType}', PETITION_TYPE_NAMES[request.type] || 'Petição')
    .replace('{clientName}', request.clientName)
    .replace('{clientCpf}', request.clientCpf || 'Não informado')
    .replace('{caseNumber}', request.caseNumber || 'Não informado')
    .replace('{court}', request.court || 'Não informado')
    .replace('{facts}', request.facts)
    .replace('{legalGrounds}', request.legalGrounds || 'A ser fundamentado')
    .replace('{request}', request.request);

  const response = await model.invoke([new HumanMessage(prompt)]);
  return response.content as string;
}

export const PETITION_TEMPLATES = [
  {
    id: '1',
    name: 'Petição Inicial - Danos Morais',
    type: 'INICIAL' as const,
    description: 'Modelo para ação de indenização por danos morais',
  },
  {
    id: '2',
    name: 'Contestação Geral',
    type: 'CONTESTACAO' as const,
    description: 'Modelo genérico de contestação',
  },
  {
    id: '3',
    name: 'Recurso de Apelação',
    type: 'RECURSO' as const,
    description: 'Modelo de recurso de apelação',
  },
  {
    id: '4',
    name: 'Habeas Corpus',
    type: 'HABEAS_CORPUS' as const,
    description: 'Modelo de habeas corpus preventivo/liberatório',
  },
  {
    id: '5',
    name: 'Embargos de Declaração',
    type: 'EMBARGOS_DECLARACAO' as const,
    description: 'Modelo de embargos de declaração para omissão/contradição',
  },
];
