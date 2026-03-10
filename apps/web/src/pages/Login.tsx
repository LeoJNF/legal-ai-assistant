import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/Spinner';

export function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('demo@advocacia.com.br');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) { setError('Nome é obrigatório'); setLoading(false); return; }
        await register({ name, email, password });
      }
      navigate('/dashboard');
    } catch {
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white bg-opacity-20 mx-auto mb-3">
            <Scale size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Legal AI Assistant</h1>
          <p className="text-blue-200 mt-2">Software jurídico inteligente para advogados</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center">
            <p className="text-xs text-yellow-700"><strong>Modo Demo</strong> — Use qualquer email/senha para entrar</p>
          </div>

          <div className="flex">
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'login' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500'}`}
              onClick={() => setTab('login')}
            >
              Entrar
            </button>
            <button
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'register' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-gray-50 text-gray-500'}`}
              onClick={() => setTab('register')}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {tab === 'register' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Dr. João Silva"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com.br"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <><Spinner size="sm" /><span>Aguarde...</span></> : (tab === 'login' ? 'Entrar' : 'Criar Conta')}
            </button>
          </form>
        </div>

        <p className="text-center text-blue-200 text-xs mt-4">
          Versão Demo v1.0 — Dados simulados para demonstração
        </p>
      </div>
    </div>
  );
}
