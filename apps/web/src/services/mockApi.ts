import type { DocumentAnalysis, PetitionTemplate, GeneratedPetition, LegalResearch } from '@/types/api';

// Simulated delay for realistic API behavior
const delay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data for document analysis
const mockAnalysis: DocumentAnalysis = {
  id: '1',
  fileName: 'contrato_exemplo.pdf',
  summary: 'Contrato de prestação de serviços entre duas partes com prazo de 12 meses. O documento estabelece direitos e deveres de ambas as partes, incluindo cláusulas de rescisão e penalidades.',
  keyPoints: [
    'Prazo de vigência: 12 meses',
    'Valor mensal: R$ 5.000,00',
    'Possibilidade de rescisão com aviso prévio de 30 dias',
    'Multa rescisória de 20% sobre o valor total do contrato',
    'Foro da comarca de São Paulo para dirimir conflitos'
  ],
  risks: [
    'Cláusula de multa rescisória pode ser considerada abusiva',
    'Ausência de cláusula de reajuste de valores',
    'Falta de especificação detalhada dos serviços a serem prestados'
  ],
  recommendations: [
    'Revisar cláusula de multa rescisória para adequar ao CDC',
    'Incluir cláusula de reajuste de valores baseada em índice oficial',
    'Detalhar melhor o escopo dos serviços no anexo I',
    'Adicionar cláusula de confidencialidade'
  ],
  analyzedAt: new Date().toISOString()
};

// Mock petition templates
const mockTemplates: PetitionTemplate[] = [
  {
    id: '1',
    title: 'Petição Inicial - Ação de Cobrança',
    description: 'Modelo de petição inicial para ação de cobrança de valores',
    category: 'Cível'
  },
  {
    id: '2',
    title: 'Recurso de Apelação',
    description: 'Modelo de recurso de apelação para tribunal de segunda instância',
    category: 'Processual'
  },
  {
    id: '3',
    title: 'Contestação',
    description: 'Modelo de contestação para defesa em ações cíveis',
    category: 'Cível'
  },
  {
    id: '4',
    title: 'Habeas Corpus',
    description: 'Modelo de habeas corpus para garantia de liberdade',
    category: 'Penal'
  },
  {
    id: '5',
    title: 'Mandado de Segurança',
    description: 'Modelo de mandado de segurança contra ato de autoridade',
    category: 'Constitucional'
  }
];

// Mock generated petition
const mockPetition: GeneratedPetition = {
  id: '1',
  title: 'Petição Inicial - Ação de Cobrança',
  content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA ___ VARA CÍVEL DA COMARCA DE SÃO PAULO/SP

Processo nº: _______________

AUTOR EXEMPLO, brasileiro, [qualificação completa], residente e domiciliado na [endereço completo], por seu advogado que esta subscreve (procuração anexa), com escritório profissional na [endereço], onde receberá intimações, vem, respeitosamente, à presença de Vossa Excelência, propor a presente

AÇÃO DE COBRANÇA

em face de RÉU EXEMPLO, brasileiro, [qualificação], residente e domiciliado na [endereço], pelos fatos e fundamentos jurídicos a seguir expostos:

I - DOS FATOS

O Autor celebrou com o Réu contrato de prestação de serviços em [data], conforme documento anexo.

O Réu deixou de efetuar o pagamento das parcelas vencidas nos meses de [especificar], totalizando o montante de R$ [valor].

Foram realizadas diversas tentativas amigáveis de cobrança, todas infrutíferas.

II - DO DIREITO

O inadimplemento contratual autoriza a cobrança judicial dos valores devidos, com base nos artigos 389 e seguintes do Código Civil.

III - DO PEDIDO

Ante o exposto, requer-se:

a) A citação do Réu para, querendo, apresentar defesa;
b) A condenação do Réu ao pagamento do valor de R$ [valor], acrescido de juros e correção monetária;
c) A condenação do Réu ao pagamento das custas processuais e honorários advocatícios.

Dá-se à causa o valor de R$ [valor].

Termos em que,
Pede deferimento.

São Paulo, [data].

[Nome do Advogado]
OAB/SP nº [número]`,
  createdAt: new Date().toISOString()
};

// Mock legal research results
const mockResearch: LegalResearch = {
  id: '1',
  query: 'jurisprudência sobre danos morais',
  results: [
    {
      id: '1',
      title: 'REsp 1234567/SP - Danos Morais em Relação de Consumo',
      court: 'Superior Tribunal de Justiça',
      date: '2023-05-15',
      summary: 'Responsabilidade civil. Danos morais. Relação de consumo. Falha na prestação de serviços. Quantum indenizatório. O STJ firmou entendimento de que o valor da indenização por danos morais deve ser fixado com moderação, considerando as circunstâncias do caso concreto.',
      relevance: 95
    },
    {
      id: '2',
      title: 'Apelação Cível nº 7654321/SP - Danos Morais por Negativação Indevida',
      court: 'Tribunal de Justiça de São Paulo',
      date: '2023-08-22',
      summary: 'Negativação indevida do nome do consumidor. Dano moral in re ipsa. Dispensa de prova do prejuízo. Indenização fixada em R$ 10.000,00, considerando critérios de razoabilidade e proporcionalidade.',
      relevance: 88
    },
    {
      id: '3',
      title: 'REsp 9876543/RJ - Critérios para Fixação de Danos Morais',
      court: 'Superior Tribunal de Justiça',
      date: '2023-03-10',
      summary: 'Danos morais. Fixação do quantum. Devem ser observados os princípios da razoabilidade e proporcionalidade, bem como as condições econômicas das partes, a gravidade da ofensa e o caráter pedagógico da condenação.',
      relevance: 92
    },
    {
      id: '4',
      title: 'Apelação Cível nº 5555555/MG - Danos Morais em Acidente de Trânsito',
      court: 'Tribunal de Justiça de Minas Gerais',
      date: '2023-06-30',
      summary: 'Acidente de trânsito. Lesões corporais graves. Sequelas permanentes. Dano moral configurado. Indenização majorada para R$ 100.000,00, considerando a extensão do dano e suas consequências na vida da vítima.',
      relevance: 85
    }
  ],
  analyzedAt: new Date().toISOString()
};

export const mockApi = {
  // Document Analysis
  analyzeDocument: async (file: File): Promise<DocumentAnalysis> => {
    await delay(2000);
    return { ...mockAnalysis, fileName: file.name, analyzedAt: new Date().toISOString() };
  },

  // Petition Generation
  getPetitionTemplates: async (): Promise<PetitionTemplate[]> => {
    await delay(800);
    return mockTemplates;
  },

  generatePetition: async (templateId: string, data: Record<string, string>): Promise<GeneratedPetition> => {
    await delay(2500);
    const template = mockTemplates.find(t => t.id === templateId);
    return {
      ...mockPetition,
      id: Math.random().toString(36).substr(2, 9),
      title: template?.title || 'Petição Gerada',
      createdAt: new Date().toISOString()
    };
  },

  // Legal Research
  searchLegalCases: async (query: string): Promise<LegalResearch> => {
    await delay(1500);
    return {
      ...mockResearch,
      id: Math.random().toString(36).substr(2, 9),
      query,
      analyzedAt: new Date().toISOString()
    };
  }
};
