import {
  mockUser,
  mockDocuments,
  mockPetitionTemplates,
  mockPetitions,
  mockSearchResults,
  mockDeadlines,
  mockChatHistory,
  mockResponses,
  mockDashboardStats,
} from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const randomDelay = () => delay(500 + Math.random() * 1000);

export async function login(email: string, _password: string) {
  await delay(800);
  return { user: { ...mockUser, email }, token: 'mock-jwt-token' };
}

export async function register(data: { name: string; email: string; password: string }) {
  await delay(1000);
  return { user: { ...mockUser, name: data.name, email: data.email }, token: 'mock-jwt-token' };
}

export async function logout() {
  await delay(300);
  return { success: true };
}

export async function getProfile() {
  await delay(500);
  return mockUser;
}

export async function uploadDocument(_file: File) {
  await delay(2500);
  const doc = mockDocuments[0];
  return { ...doc, id: String(Date.now()), name: _file.name, uploadDate: new Date().toISOString() };
}

export async function getDocuments() {
  await randomDelay();
  return mockDocuments;
}

export async function analyzeDocument(id: string) {
  await delay(2000);
  const doc = mockDocuments.find(d => d.id === id);
  return doc?.analysis || mockDocuments[0].analysis;
}

export async function deleteDocument(_id: string) {
  await delay(500);
  return { success: true };
}

export async function getPetitionTemplates() {
  await randomDelay();
  return mockPetitionTemplates;
}

export async function generatePetition(data: { templateId: string; fields: Record<string, string> }) {
  await delay(2000);
  const template = mockPetitionTemplates.find(t => t.id === data.templateId);
  const petition = mockPetitions[0];
  return {
    ...petition,
    id: String(Date.now()),
    title: `${template?.name || 'Petição'} - Gerada em ${new Date().toLocaleDateString('pt-BR')}`,
    createdAt: new Date().toISOString(),
  };
}

export async function getPetitions() {
  await randomDelay();
  return mockPetitions;
}

export async function deletePetition(_id: string) {
  await delay(500);
  return { success: true };
}

export async function searchJurisprudence(query: string) {
  await delay(1500);
  const key = Object.keys(mockSearchResults).find(k => query.toLowerCase().includes(k));
  const results = key ? mockSearchResults[key] : mockSearchResults['default'];
  return { ...results, query, results: results.results.filter(r => r.type === 'jurisprudence') };
}

export async function searchLegislation(query: string) {
  await delay(1200);
  const key = Object.keys(mockSearchResults).find(k => query.toLowerCase().includes(k));
  const results = key ? mockSearchResults[key] : mockSearchResults['default'];
  return { ...results, query, results: results.results.filter(r => r.type === 'legislation') };
}

export async function searchAll(query: string) {
  await delay(1500);
  const key = Object.keys(mockSearchResults).find(k => query.toLowerCase().includes(k));
  const results = key ? mockSearchResults[key] : mockSearchResults['default'];
  return { ...results, query };
}

export async function getDeadlines() {
  await randomDelay();
  const stored = localStorage.getItem('mockDeadlines');
  if (stored) {
    return JSON.parse(stored);
  }
  return mockDeadlines;
}

export async function createDeadline(data: Omit<typeof mockDeadlines[0], 'id'>) {
  await delay(800);
  const newDeadline = { ...data, id: String(Date.now()) };
  const stored = localStorage.getItem('mockDeadlines');
  const current = stored ? JSON.parse(stored) : mockDeadlines;
  const updated = [newDeadline, ...current];
  localStorage.setItem('mockDeadlines', JSON.stringify(updated));
  return newDeadline;
}

export async function updateDeadline(id: string, data: Partial<typeof mockDeadlines[0]>) {
  await delay(500);
  const stored = localStorage.getItem('mockDeadlines');
  const current = stored ? JSON.parse(stored) : mockDeadlines;
  const updated = current.map((d: typeof mockDeadlines[0]) => d.id === id ? { ...d, ...data } : d);
  localStorage.setItem('mockDeadlines', JSON.stringify(updated));
  return updated.find((d: typeof mockDeadlines[0]) => d.id === id);
}

export async function deleteDeadline(id: string) {
  await delay(500);
  const stored = localStorage.getItem('mockDeadlines');
  const current = stored ? JSON.parse(stored) : mockDeadlines;
  const updated = current.filter((d: typeof mockDeadlines[0]) => d.id !== id);
  localStorage.setItem('mockDeadlines', JSON.stringify(updated));
  return { success: true };
}

export async function getChatHistory() {
  await delay(500);
  const stored = localStorage.getItem('mockChatHistory');
  if (stored) return JSON.parse(stored);
  return mockChatHistory;
}

export async function sendMessage(message: string) {
  await delay(1000 + Math.random() * 1000);
  const key = Object.keys(mockResponses).find(k => message.toLowerCase().includes(k));
  const response = key ? mockResponses[key] : mockResponses['default'];
  return {
    id: String(Date.now()),
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString(),
  };
}

export async function getDashboardStats() {
  await randomDelay();
  return mockDashboardStats;
}
