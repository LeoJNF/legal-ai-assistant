import { useEffect, useState } from 'react';
import { Scale, Download, Plus, ChevronLeft, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { Spinner } from '@/components/Spinner';

interface Template {
  id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  fields: string[];
}

interface Petition {
  id: string;
  title: string;
  type: string;
  category: string;
  createdAt: string;
  status: string;
  content: string;
}

const fieldLabels: Record<string, string> = {
  creditor: 'Nome do Credor', debtor: 'Nome do Devedor', amount: 'Valor da Dívida',
  dueDate: 'Data de Vencimento', description: 'Descrição', employee: 'Nome do Empregado',
  employer: 'Nome do Empregador', admissionDate: 'Data de Admissão', dismissalDate: 'Data de Demissão',
  claims: 'Verbas Pleiteadas', plaintiff: 'Nome do Autor', defendant: 'Nome do Réu',
  incident: 'Descrição do Fato', damages: 'Danos Sofridos', impetrante: 'Nome do Impetrante',
  impetrado: 'Autoridade Coatora', act: 'Ato Impugnado', right: 'Direito Violado',
  urgency: 'Urgência / Liminar', spouse1: 'Cônjuge 1', spouse2: 'Cônjuge 2',
  marriageDate: 'Data do Casamento', assets: 'Bens a Partilhar', children: 'Filhos (se houver)',
  paciente: 'Nome do Paciente', coator: 'Autoridade Coatora', constraint: 'Constrangimento',
  grounds: 'Fundamentos',
};

const categoryColors: Record<string, string> = {
  civil: 'bg-blue-50 text-blue-700',
  labor: 'bg-orange-50 text-orange-700',
  constitutional: 'bg-purple-50 text-purple-700',
  family: 'bg-pink-50 text-pink-700',
  criminal: 'bg-red-50 text-red-700',
};

const categoryLabels: Record<string, string> = {
  civil: 'Cível', labor: 'Trabalhista', constitutional: 'Constitucional',
  family: 'Família', criminal: 'Criminal',
};

export function PetitionsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'list' | 'templates' | 'form' | 'result'>('list');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generatedPetition, setGeneratedPetition] = useState<Petition | null>(null);

  useEffect(() => {
    Promise.all([api.getPetitionTemplates(), api.getPetitions()])
      .then(([t, p]) => {
        setTemplates(t as Template[]);
        setPetitions(p as Petition[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({});
    setView('form');
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    try {
      const petition = await api.generatePetition({ templateId: selectedTemplate.id, fields: formData });
      setGeneratedPetition(petition as Petition);
      setPetitions(prev => [petition as Petition, ...prev]);
      setView('result');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (petition: Petition) => {
    const blob = new Blob([petition.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${petition.title.replace(/[^a-zA-Z0-9\s]/g, '').trim()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gerador de Petições</h1>
          <p className="text-gray-500 text-sm mt-1">Gere petições profissionais com auxílio de IA</p>
        </div>
        {view === 'list' && (
          <button
            onClick={() => setView('templates')}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} /> Nova Petição
          </button>
        )}
        {(view === 'templates' || view === 'form') && (
          <button
            onClick={() => setView(view === 'form' ? 'templates' : 'list')}
            className="flex items-center gap-2 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
          >
            <ChevronLeft size={16} /> Voltar
          </button>
        )}
      </div>

      {view === 'list' && (
        <div className="space-y-4">
          {petitions.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <Scale size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Nenhuma petição gerada ainda</p>
              <button onClick={() => setView('templates')} className="mt-3 text-blue-600 text-sm hover:underline">Gerar primeira petição</button>
            </div>
          ) : (
            petitions.map(petition => (
              <div key={petition.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Scale size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{petition.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[petition.category] || 'bg-gray-50 text-gray-600'}`}>
                          {categoryLabels[petition.category] || petition.category}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(petition.createdAt).toLocaleDateString('pt-BR')}</span>
                        {petition.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700"><CheckCircle size={11} /> Concluído</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(petition)}
                    className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Download size={14} /> Baixar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {view === 'templates' && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-4">Escolha o tipo de petição</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Scale size={18} className="text-blue-600" />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[template.category] || 'bg-gray-50 text-gray-600'}`}>
                    {categoryLabels[template.category] || template.category}
                  </span>
                </div>
                <p className="font-medium text-gray-900 text-sm mb-1">{template.name}</p>
                <p className="text-xs text-gray-500">{template.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {view === 'form' && selectedTemplate && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Scale size={20} className="text-blue-600" />
            <div>
              <h2 className="font-semibold text-gray-900">{selectedTemplate.name}</h2>
              <p className="text-sm text-gray-500">{selectedTemplate.description}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {selectedTemplate.fields.map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {fieldLabels[field] || field}
                </label>
                <input
                  type="text"
                  value={formData[field] || ''}
                  onChange={e => setFormData(prev => ({ ...prev, [field]: e.target.value }))}
                  placeholder={`Digite ${(fieldLabels[field] || field).toLowerCase()}...`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {generating ? <><Spinner size="sm" /> Gerando petição com IA...</> : '⚖️ Gerar Petição'}
          </button>
        </div>
      )}

      {view === 'result' && generatedPetition && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle size={22} className="text-green-600" />
              <h2 className="font-semibold text-gray-900">Petição Gerada com Sucesso!</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('list')} className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100">
                Ver lista
              </button>
              <button
                onClick={() => handleDownload(generatedPetition)}
                className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={14} /> Baixar
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{generatedPetition.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
