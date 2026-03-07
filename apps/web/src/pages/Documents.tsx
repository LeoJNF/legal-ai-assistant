import { useEffect, useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { api } from '@/services/api';
import { Spinner } from '@/components/Spinner';

interface DocumentClause {
  id: string;
  type: string;
  title: string;
  content: string;
  risk: string;
}

interface DocumentAnalysis {
  summary: string;
  clauses: DocumentClause[];
  risks: Array<{ level: string; description: string }>;
  suggestions: string[];
  score: number;
}

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  status: string;
  size: string;
  type: string;
  analysis: DocumentAnalysis | null;
}

const riskColors: Record<string, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
};

const riskLabels: Record<string, string> = {
  low: 'Baixo', medium: 'Médio', high: 'Alto', urgent: 'Urgente',
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.getDocuments().then(docs => setDocuments(docs as Document[])).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const doc = await api.uploadDocument(file);
      setDocuments(prev => [doc as Document, ...prev]);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    await api.deleteDocument(id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análise de Documentos</h1>
          <p className="text-gray-500 text-sm mt-1">Faça upload de contratos e documentos para análise com IA</p>
        </div>
      </div>

      <div
        className="border-2 border-dashed border-blue-300 rounded-xl p-8 mb-6 text-center hover:border-blue-400 cursor-pointer bg-blue-50/50 transition-colors"
        onClick={() => fileRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" />
            <p className="text-sm text-blue-600 font-medium">Analisando documento com IA...</p>
            <p className="text-xs text-gray-500">Isso pode levar alguns segundos</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Upload size={22} className="text-blue-600" />
            </div>
            <p className="font-medium text-gray-900">Clique para fazer upload</p>
            <p className="text-sm text-gray-500">PDF, DOCX, DOC — máx. 10MB</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Documentos ({documents.length})</h2>
          <div className="space-y-3">
            {documents.map(doc => (
              <div
                key={doc.id}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${selectedDoc?.id === doc.id ? 'border-blue-400 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
                onClick={() => setSelectedDoc(selectedDoc?.id === doc.id ? null : doc)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={18} className="text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{new Date(doc.uploadDate).toLocaleDateString('pt-BR')} · {doc.size}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {doc.status === 'analyzed' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <CheckCircle size={11} /> Analisado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                          <Clock size={11} /> Pendente
                        </span>
                      )}
                      {doc.analysis && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${doc.analysis.score >= 80 ? 'bg-green-50 text-green-700' : doc.analysis.score >= 60 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                          Score: {doc.analysis.score}/100
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedDoc?.id === doc.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(doc.id); }}
                      className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedDoc?.analysis && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Análise: {selectedDoc.name}</h2>
            
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Resumo</p>
              <p className="text-sm text-gray-600">{selectedDoc.analysis.summary}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Cláusulas Identificadas</p>
              <div className="space-y-2">
                {selectedDoc.analysis.clauses.map(clause => (
                  <div key={clause.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">{clause.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${riskColors[clause.risk]}`}>
                        {riskLabels[clause.risk]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{clause.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedDoc.analysis.risks.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Riscos Identificados</p>
                <div className="space-y-1.5">
                  {selectedDoc.analysis.risks.map((risk, i) => (
                    <div key={i} className={`flex items-start gap-2 text-xs p-2 rounded-lg ${riskColors[risk.level]}`}>
                      <AlertTriangle size={13} className="mt-0.5 flex-shrink-0" />
                      <span>{risk.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Sugestões</p>
              <ul className="space-y-1">
                {selectedDoc.analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
