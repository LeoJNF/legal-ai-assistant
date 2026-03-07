import { useState } from 'react';
import { Search, ExternalLink, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { searchService } from '../services/chatService';
import type { LegalSearchResult } from '@legal-ai/shared';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'ALL' | 'JURISPRUDENCIA' | 'LEGISLACAO'>('ALL');
  const [results, setResults] = useState<LegalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const data = await searchService.search({ query, type });
      setResults(data);
    } catch {
      toast.error('Erro ao realizar pesquisa. Verifique a configuração da OpenAI API.');
    } finally {
      setLoading(false);
    }
  };

  const relevanceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-700';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pesquisa Jurídica</h1>
        <p className="text-gray-500">Busca inteligente em legislação e jurisprudência brasileira</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="card">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: prazo recursal cível, indenização por danos morais, habeas corpus..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as typeof type)}
            className="input-field w-48"
          >
            <option value="ALL">Tudo</option>
            <option value="JURISPRUDENCIA">Jurisprudência</option>
            <option value="LEGISLACAO">Legislação</option>
          </select>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="btn-primary px-6 disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>

        <div className="flex gap-2 mt-3">
          {['habeas corpus', 'prazo contestação', 'STJ danos morais', 'prescrição civil'].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              {term}
            </button>
          ))}
        </div>
      </form>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : searched && results.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum resultado encontrado</h3>
          <p className="text-gray-500">Tente uma pesquisa diferente</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{result.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${relevanceColor(result.relevanceScore)}`}>
                      {Math.round(result.relevanceScore * 100)}% relevante
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{result.content}</p>
                  <p className="text-xs text-blue-600 font-medium mt-2">📚 {result.source}</p>
                </div>
                {result.url && (
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-blue-500"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
