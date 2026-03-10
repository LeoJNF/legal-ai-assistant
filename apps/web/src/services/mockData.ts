export const mockUser = {
  id: '1',
  name: 'Dr. Carlos Mendes',
  email: 'carlos.mendes@advocacia.com.br',
  oab: 'OAB/SP 123456',
  avatar: null,
  plan: 'professional',
};

export const mockDocuments = [
  {
    id: '1',
    name: 'Contrato de Prestação de Serviços.pdf',
    uploadDate: '2026-03-05T10:30:00Z',
    status: 'analyzed',
    size: '245 KB',
    type: 'contract',
    analysis: {
      summary: 'Contrato de prestação de serviços advocatícios entre as partes para representação em processo trabalhista. O contrato estabelece honorários fixos e contingenciais, com prazo de vigência de 12 meses.',
      clauses: [
        { id: '1', type: 'payment', title: 'Honorários', content: 'Honorários de R$ 5.000,00 pagos em 5 parcelas de R$ 1.000,00, com vencimento no dia 10 de cada mês.', risk: 'low' },
        { id: '2', type: 'termination', title: 'Rescisão', content: 'Rescisão contratual com aviso prévio de 30 dias por qualquer das partes, sem multa rescisória especificada.', risk: 'medium' },
        { id: '3', type: 'confidentiality', title: 'Sigilo Profissional', content: 'As partes comprometem-se a manter sigilo sobre as informações trocadas durante a vigência do contrato.', risk: 'low' },
        { id: '4', type: 'jurisdiction', title: 'Foro', content: 'Fica eleito o foro da Comarca de São Paulo para dirimir quaisquer litígios.', risk: 'low' },
      ],
      risks: [
        { level: 'medium', description: 'Cláusula de rescisão pode ser mais clara quanto às multas rescisórias' },
        { level: 'low', description: 'Ausência de cláusula de reajuste de honorários' },
      ],
      suggestions: [
        'Adicionar cláusula específica de multa rescisória',
        'Incluir índice de reajuste anual dos honorários (IGPM ou IPCA)',
        'Detalhar o escopo dos serviços a serem prestados',
        'Adicionar cláusula de limitação de responsabilidade',
      ],
      score: 78,
    },
  },
  {
    id: '2',
    name: 'Procuração Ad Judicia.pdf',
    uploadDate: '2026-03-03T14:20:00Z',
    status: 'analyzed',
    size: '98 KB',
    type: 'power_of_attorney',
    analysis: {
      summary: 'Procuração outorgando amplos poderes para representação judicial em todas as instâncias.',
      clauses: [
        { id: '1', type: 'powers', title: 'Poderes Outorgados', content: 'Poderes para representar em todas as instâncias, inclusive STJ e STF, com poderes especiais para receber e dar quitação.', risk: 'low' },
      ],
      risks: [
        { level: 'low', description: 'Procuração bem redigida sem riscos identificados' },
      ],
      suggestions: [
        'Documento está bem estruturado',
        'Verificar reconhecimento de firma se necessário',
      ],
      score: 95,
    },
  },
  {
    id: '3',
    name: 'Contrato de Locação Comercial.pdf',
    uploadDate: '2026-02-28T09:15:00Z',
    status: 'analyzed',
    size: '312 KB',
    type: 'contract',
    analysis: {
      summary: 'Contrato de locação comercial de imóvel para fim empresarial com prazo de 36 meses.',
      clauses: [
        { id: '1', type: 'rent', title: 'Aluguel', content: 'Aluguel mensal de R$ 8.500,00 reajustado anualmente pelo IGP-M.', risk: 'low' },
        { id: '2', type: 'guarantee', title: 'Garantia', content: 'Fiança bancária no valor de 3 meses de aluguel como garantia locatícia.', risk: 'medium' },
        { id: '3', type: 'renovation', title: 'Reformas', content: 'Locatário autorizado a realizar reformas com aprovação prévia do locador.', risk: 'high' },
      ],
      risks: [
        { level: 'high', description: 'Cláusula de reformas não especifica responsabilidade pelos custos ao término' },
        { level: 'medium', description: 'Ausência de inventário do estado do imóvel' },
      ],
      suggestions: [
        'Incluir laudo de vistoria do imóvel como anexo',
        'Detalhar responsabilidades sobre reformas ao final do contrato',
        'Incluir cláusula de renovação automática',
      ],
      score: 62,
    },
  },
  {
    id: '4',
    name: 'Acordo Trabalhista.docx',
    uploadDate: '2026-02-20T11:00:00Z',
    status: 'pending',
    size: '156 KB',
    type: 'agreement',
    analysis: null,
  },
];

export const mockPetitionTemplates = [
  {
    id: '1',
    name: 'Ação de Cobrança',
    type: 'cobranca',
    category: 'civil',
    description: 'Ação para cobrança de dívidas e obrigações contratuais',
    fields: ['creditor', 'debtor', 'amount', 'dueDate', 'description'],
  },
  {
    id: '2',
    name: 'Ação Trabalhista',
    type: 'trabalhista',
    category: 'labor',
    description: 'Reclamação trabalhista por verbas rescisórias',
    fields: ['employee', 'employer', 'admissionDate', 'dismissalDate', 'claims'],
  },
  {
    id: '3',
    name: 'Ação de Danos Morais',
    type: 'danos_morais',
    category: 'civil',
    description: 'Ação indenizatória por danos morais e materiais',
    fields: ['plaintiff', 'defendant', 'incident', 'damages', 'amount'],
  },
  {
    id: '4',
    name: 'Mandado de Segurança',
    type: 'mandado_seguranca',
    category: 'constitutional',
    description: 'Mandado de segurança contra ato de autoridade coatora',
    fields: ['impetrante', 'impetrado', 'act', 'right', 'urgency'],
  },
  {
    id: '5',
    name: 'Divórcio Consensual',
    type: 'divorcio',
    category: 'family',
    description: 'Petição de divórcio consensual com partilha de bens',
    fields: ['spouse1', 'spouse2', 'marriageDate', 'assets', 'children'],
  },
  {
    id: '6',
    name: 'Habeas Corpus',
    type: 'habeas_corpus',
    category: 'criminal',
    description: 'Habeas corpus para tutela da liberdade de locomoção',
    fields: ['paciente', 'coator', 'constraint', 'grounds'],
  },
];

export const mockPetitions = [
  {
    id: '1',
    title: 'Ação de Cobrança - João Silva vs. Empresa XYZ',
    type: 'cobranca',
    category: 'civil',
    createdAt: '2026-03-04T14:20:00Z',
    status: 'completed',
    content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO DA VARA CÍVEL DA COMARCA DE SÃO PAULO - SP

JOÃO SILVA, brasileiro, casado, engenheiro, portador do RG nº 12.345.678-9 SSP/SP e CPF nº 123.456.789-00, residente e domiciliado na Rua das Flores, nº 123, Bairro Jardins, São Paulo/SP, CEP 01234-567, por seu advogado que esta subscreve (procuração anexa), vem, respeitosamente, à presença de Vossa Excelência, propor a presente

AÇÃO DE COBRANÇA

em face de EMPRESA XYZ LTDA, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº 12.345.678/0001-90, com sede na Avenida Paulista, nº 1000, Sala 201, São Paulo/SP, CEP 01310-100, pelos fatos e fundamentos jurídicos a seguir expostos.

I - DOS FATOS

O Autor prestou serviços de consultoria à Ré no período de janeiro a março de 2026, conforme contrato celebrado entre as partes em 05 de janeiro de 2026...`,
  },
  {
    id: '2',
    title: 'Reclamação Trabalhista - Maria Santos',
    type: 'trabalhista',
    category: 'labor',
    createdAt: '2026-03-02T10:30:00Z',
    status: 'completed',
    content: `EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DO TRABALHO DA 1ª VARA DO TRABALHO DE SÃO PAULO - SP

MARIA SANTOS, brasileira, solteira, comerciária, portadora do RG nº 98.765.432-1 SSP/SP e CPF nº 987.654.321-00...`,
  },
  {
    id: '3',
    title: 'Mandado de Segurança - Licença Ambiental',
    type: 'mandado_seguranca',
    category: 'constitutional',
    createdAt: '2026-02-25T16:45:00Z',
    status: 'completed',
    content: `EXCELENTÍSSIMO SENHOR DOUTOR DESEMBARGADOR-PRESIDENTE DO EGRÉGIO TRIBUNAL DE JUSTIÇA DO ESTADO DE SÃO PAULO...`,
  },
];

export const mockSearchResults: Record<string, { query: string; total: number; results: Array<{ id: string; type: string; court?: string; number?: string; date?: string; summary?: string; law?: string; content?: string; author?: string; source?: string; relevance: number; url: string }> }> = {
  'prescrição trabalhista': {
    query: 'prescrição trabalhista',
    total: 47,
    results: [
      {
        id: '1',
        type: 'jurisprudence',
        court: 'TST',
        number: 'RR-1234-56.2020.5.01.0001',
        date: '2025-10-15',
        summary: 'Prescrição trabalhista. Prazo de 5 anos durante a vigência do contrato de trabalho e 2 anos após a extinção do pacto laboral. Súmula 308 do TST. Aplicação do art. 7º, XXIX da Constituição Federal.',
        relevance: 0.95,
        url: '#',
      },
      {
        id: '2',
        type: 'legislation',
        law: 'CLT - Art. 7º, XXIX / CF/88',
        content: 'Ação, quanto aos créditos resultantes das relações de trabalho, com prazo prescricional de cinco anos para os trabalhadores urbanos e rurais, até o limite de dois anos após a extinção do contrato de trabalho.',
        relevance: 0.92,
        url: '#',
      },
      {
        id: '3',
        type: 'jurisprudence',
        court: 'TST',
        number: 'AIRR-789-12.2021.5.02.0001',
        date: '2025-08-20',
        summary: 'Prescrição quinquenal. Marco inicial. Ajuizamento da reclamação trabalhista. Inaplicabilidade da prescrição bienal durante a relação empregatícia.',
        relevance: 0.88,
        url: '#',
      },
      {
        id: '4',
        type: 'doctrine',
        author: 'Maurício Godinho Delgado',
        source: 'Curso de Direito do Trabalho, 22ª ed.',
        content: 'A prescrição trabalhista divide-se em bienal (após extinção do contrato) e quinquenal (durante a vigência), sendo esta última a regra geral para créditos trabalhistas.',
        relevance: 0.82,
        url: '#',
      },
    ],
  },
  'default': {
    query: '',
    total: 23,
    results: [
      {
        id: '1',
        type: 'jurisprudence',
        court: 'STJ',
        number: 'REsp 1234567/SP',
        date: '2025-11-10',
        summary: 'Responsabilidade civil. Danos morais. Critérios para fixação do quantum indenizatório. Proporcionalidade e razoabilidade.',
        relevance: 0.90,
        url: '#',
      },
      {
        id: '2',
        type: 'legislation',
        law: 'Código Civil - Art. 186',
        content: 'Aquele que, por ação ou omissão voluntária, negligência ou imprudência, violar direito e causar dano a outrem, ainda que exclusivamente moral, comete ato ilícito.',
        relevance: 0.85,
        url: '#',
      },
    ],
  },
};

export const mockDeadlines = [
  {
    id: '1',
    processNumber: '0001234-56.2026.8.19.0001',
    description: 'Contestação - Ação de Cobrança',
    dueDate: '2026-03-15T23:59:59Z',
    status: 'pending',
    daysRemaining: 8,
    priority: 'high',
    court: '3ª Vara Cível - Foro Central',
    type: 'contestacao',
  },
  {
    id: '2',
    processNumber: '0005678-90.2025.5.02.0001',
    description: 'Razões Finais - Reclamação Trabalhista',
    dueDate: '2026-03-10T23:59:59Z',
    status: 'pending',
    daysRemaining: 3,
    priority: 'urgent',
    court: '1ª Vara do Trabalho',
    type: 'razoes_finais',
  },
  {
    id: '3',
    processNumber: '0009012-34.2025.8.26.0100',
    description: 'Recurso de Apelação',
    dueDate: '2026-03-25T23:59:59Z',
    status: 'pending',
    daysRemaining: 18,
    priority: 'medium',
    court: 'TJSP - 5ª Câmara de Direito Privado',
    type: 'recurso',
  },
  {
    id: '4',
    processNumber: '0003456-78.2025.8.19.0001',
    description: 'Manifestação sobre Laudo Pericial',
    dueDate: '2026-03-20T23:59:59Z',
    status: 'pending',
    daysRemaining: 13,
    priority: 'medium',
    court: '7ª Vara Cível - Foro Regional',
    type: 'manifestacao',
  },
  {
    id: '5',
    processNumber: '0007890-12.2024.8.26.0100',
    description: 'Petição Inicial - Mandado de Segurança',
    dueDate: '2026-02-28T23:59:59Z',
    status: 'completed',
    daysRemaining: 0,
    priority: 'high',
    court: 'TJSP - 1ª Câmara de Direito Público',
    type: 'peticao_inicial',
  },
];

export const mockChatHistory = [
  {
    id: '1',
    role: 'assistant',
    content: 'Olá! Sou o seu Assistente Jurídico com IA. Posso ajudá-lo com dúvidas sobre legislação, jurisprudência, prazos processuais e muito mais. Como posso ajudá-lo hoje?',
    timestamp: '2026-03-07T08:00:00Z',
  },
];

export const mockResponses: Record<string, string> = {
  'prazo recursal': 'O prazo para **recurso ordinário** no processo civil é de **15 dias úteis** (art. 1.003, §5º do CPC/2015). Para recursos no processo trabalhista (recurso ordinário), o prazo é de **8 dias**. Já para o recurso de apelação em juizados especiais, o prazo é de **10 dias**.\n\nÉ importante observar que os prazos processuais são contados em dias úteis no processo civil após o NCPC, excluindo sábados, domingos e feriados.',
  'honorarios': 'Os **honorários advocatícios** são regulados pelo Estatuto da OAB (Lei nº 8.906/94) e pela Tabela de Honorários da OAB. Eles podem ser:\n\n1. **Convencionados**: acordados livremente entre advogado e cliente\n2. **Sucumbenciais**: fixados pelo juiz em caso de procedência da ação (art. 85 do CPC)\n3. **Arbitrados**: fixados pelo juiz quando não houver contrato\n\nA Tabela da OAB/SP estabelece valores mínimos por tipo de ação.',
  'prescricao': 'A **prescrição** é a perda do direito de ação pelo decurso do prazo. Os principais prazos prescricionais são:\n\n- **10 anos**: regra geral (art. 205 CC)\n- **5 anos**: créditos trabalhistas durante o contrato\n- **3 anos**: responsabilidade civil, cobrança de aluguéis\n- **2 anos**: créditos trabalhistas após extinção do contrato\n- **1 ano**: seguros, hospedagem\n\nA prescrição pode ser interrompida ou suspensa em determinadas circunstâncias previstas em lei.',
  'habeas corpus': 'O **Habeas Corpus** (HC) é um remédio constitucional previsto no art. 5º, LXVIII da CF/88, cabível quando alguém sofre ou se acha ameaçado de sofrer violência ou coação em sua liberdade de locomoção.\n\n**Espécies:**\n- **Preventivo**: antes da prisão\n- **Repressivo/Liberatório**: após a prisão ilegal\n- **Suspensivo**: para obstar iminente constrangimento\n\nO HC pode ser impetrado por qualquer pessoa, em favor de qualquer pessoa, não sendo necessária assistência de advogado.',
  'default': 'Entendi sua pergunta. Com base na legislação brasileira e na jurisprudência dos tribunais superiores, posso informar que esta é uma área que requer análise cuidadosa dos fatos e do direito aplicável.\n\nPara uma orientação mais precisa, recomendo:\n1. Analisar os fatos específicos do caso\n2. Verificar a legislação aplicável\n3. Consultar a jurisprudência dos tribunais superiores\n4. Considerar a doutrina especializada\n\nDeseja que eu aprofunde algum aspecto específico desta questão?',
};

export const mockDashboardStats = {
  documentsAnalyzed: 47,
  petitionsGenerated: 23,
  searchesPerformed: 156,
  upcomingDeadlines: 4,
  recentActivity: [
    { id: '1', type: 'document', description: 'Análise: Contrato de Prestação de Serviços', date: '2026-03-05T10:30:00Z' },
    { id: '2', type: 'petition', description: 'Petição gerada: Ação de Cobrança', date: '2026-03-04T14:20:00Z' },
    { id: '3', type: 'search', description: 'Pesquisa: prescrição trabalhista', date: '2026-03-04T11:15:00Z' },
    { id: '4', type: 'deadline', description: 'Prazo adicionado: Contestação 0001234-56', date: '2026-03-03T16:00:00Z' },
    { id: '5', type: 'document', description: 'Análise: Procuração Ad Judicia', date: '2026-03-03T14:20:00Z' },
  ],
};

export const mockClients = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    activeCases: 2,
    totalCases: 5,
    createdAt: '2025-06-10T10:00:00Z',
    lastActivity: '2026-03-04T14:20:00Z',
    status: 'active',
    area: 'civil',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(11) 97654-3210',
    cpf: '987.654.321-00',
    activeCases: 1,
    totalCases: 3,
    createdAt: '2025-09-15T08:00:00Z',
    lastActivity: '2026-03-02T10:30:00Z',
    status: 'active',
    area: 'labor',
  },
  {
    id: '3',
    name: 'Empresa XYZ Ltda.',
    email: 'juridico@empresaxyz.com.br',
    phone: '(11) 3333-4444',
    cpf: '12.345.678/0001-90',
    activeCases: 3,
    totalCases: 8,
    createdAt: '2024-11-01T09:00:00Z',
    lastActivity: '2026-03-05T10:30:00Z',
    status: 'active',
    area: 'business',
  },
  {
    id: '4',
    name: 'Carlos Oliveira',
    email: 'carlos.oliveira@email.com',
    phone: '(11) 96543-2109',
    cpf: '456.789.012-34',
    activeCases: 0,
    totalCases: 2,
    createdAt: '2025-02-20T11:00:00Z',
    lastActivity: '2025-12-15T16:00:00Z',
    status: 'inactive',
    area: 'family',
  },
  {
    id: '5',
    name: 'Ana Lima',
    email: 'ana.lima@email.com',
    phone: '(11) 95432-1098',
    cpf: '789.012.345-67',
    activeCases: 1,
    totalCases: 1,
    createdAt: '2026-01-10T14:00:00Z',
    lastActivity: '2026-02-25T16:45:00Z',
    status: 'active',
    area: 'criminal',
  },
];
