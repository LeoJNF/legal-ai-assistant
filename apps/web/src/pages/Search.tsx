import { useState } from 'react';
import { Search, BookOpen, Scale, Loader2, FileText, Scroll } from 'lucide-react';
import { api } from '@/services/api';

interface SearchResult {
  id: string;
  type: string;
  court?: string;
  number?: string;
  date?: string;
  summary?: string;
  law?: string;
  content?: string;
  author?: string;
  source?: string;
  relevance: number;
}

interface SearchResponse {
  query: string;
  total: number;
  results: SearchResult[];
}

const typeConfig: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  jurisprudence: { icon: Scale, label: 'Jurisprudência', color: 'bg-blue-50 text-blue-700' },
  legislation: { icon: Scroll, label: 'Legislação', color: 'bg-green-50 text-green-700' },
  doctrine: { icon: BookOpen, label: 'Doutrina', color: 'bg-purple-50 text-purple-700' },
};

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'jurisprudence' | 'legislation' | 'doctrine'>('all');
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await api.searchAll(query);
      setResults(data as SearchResponse);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results?.results.filter(r => filter === 'all' || r.type === filter) || [];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pesquisa Jurídica</h1>
        <p className="text-gray-500 text-sm mt-1">Pesquise jurisprudência, legislação e doutrina</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Ex: prescrição trabalhista, danos morais, habeas corpus..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          <span className="hidden sm:inline">Pesquisar</span>
        </button>
      </div>

      {results && (
        <>
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-sm text-gray-500">{results.total} resultados para "{results.query}"</span>
            <div className="flex gap-2 ml-auto">
              {(['all', 'jurisprudence', 'legislation', 'doctrine'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {f === 'all' ? 'Todos' : typeConfig[f]?.label || f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredResults.map(result => (
              <div key={result.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100">
                    {(() => { const Ic = typeConfig[result.type]?.icon || FileText; return <Ic size={16} className="text-gray-600" />; })()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeConfig[result.type]?.color || 'bg-gray-50 text-gray-600'}`}>
                        {typeConfig[result.type]?.label || result.type}
                      </span>
                      {result.court && <span className="text-xs font-medium text-gray-700">{result.court}</span>}
                      {result.number && <span className="text-xs text-gray-500">{result.number}</span>}
                      {result.date && <span className="text-xs text-gray-400">{new Date(result.date).toLocaleDateString('pt-BR')}</span>}
                      {result.law && <span className="text-xs font-medium text-gray-700">{result.law}</span>}
                      {result.author && <span className="text-xs text-gray-600">{result.author} — {result.source}</span>}
                      <span className="ml-auto text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {Math.round(result.relevance * 100)}% relevante
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {result.summary || result.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredResults.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-white rounded-xl border border-gray-200">
                Nenhum resultado encontrado para o filtro selecionado
              </div>
            )}
          </div>
        </>
      )}

      {!results && !loading && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <div className="flex justify-center gap-3 mb-4">
            <Scale size={32} className="text-gray-300" />
            <BookOpen size={32} className="text-gray-300" />
          </div>
          <p className="text-gray-500 mb-2">Digite um termo para pesquisar</p>
          <p className="text-xs text-gray-400">Exemplos: "prescrição trabalhista", "responsabilidade civil", "habeas corpus"</p>
        </div>
      )}
    </div>
  );
}
