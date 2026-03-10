import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Scale, Search, Calendar, TrendingUp, Clock, ArrowRight, MessageSquare, Users, Calculator } from 'lucide-react';
import { api } from '@/services/api';
import { Spinner } from '@/components/Spinner';
import { useAuth } from '@/contexts/AuthContext';

interface Stats {
  documentsAnalyzed: number;
  petitionsGenerated: number;
  searchesPerformed: number;
  upcomingDeadlines: number;
  recentActivity: Array<{ id: string; type: string; description: string; date: string }>;
}

const activityIconComponents: Record<string, React.ElementType> = {
  document: FileText, petition: Scale, search: Search, deadline: Calendar,
};

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getDashboardStats().then(setStats).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;
  }

  const statCards = [
    { label: 'Documentos Analisados', value: stats?.documentsAnalyzed, icon: FileText, color: 'blue', path: '/documents' },
    { label: 'Petições Geradas', value: stats?.petitionsGenerated, icon: Scale, color: 'purple', path: '/petitions' },
    { label: 'Pesquisas Realizadas', value: stats?.searchesPerformed, icon: Search, color: 'green', path: '/search' },
    { label: 'Prazos Próximos', value: stats?.upcomingDeadlines, icon: Calendar, color: 'orange', path: '/deadlines' },
  ];

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name?.split(' ')[0]}!</h1>
        <p className="text-gray-500 text-sm mt-1">Aqui está um resumo da sua atividade</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`bg-white rounded-xl p-4 border ${colorClasses[color].split(' ')[2]} hover:shadow-md transition-shadow text-left`}
          >
            <div className={`w-10 h-10 rounded-lg ${colorClasses[color].split(' ')[0]} flex items-center justify-center mb-3`}>
              <Icon size={20} className={colorClasses[color].split(' ')[1]} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900">Atividade Recente</h2>
          </div>
          <div className="space-y-3">
            {stats?.recentActivity.map(item => {
              const ActivityIcon = activityIconComponents[item.type] || FileText;
              return (
                <div key={item.id} className="flex items-start gap-3">
                  <ActivityIcon size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{item.description}</p>
                    <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-gray-500" />
            <h2 className="font-semibold text-gray-900">Ações Rápidas</h2>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Analisar novo documento', path: '/documents', Icon: FileText },
              { label: 'Gerar petição', path: '/petitions', Icon: Scale },
              { label: 'Pesquisar jurisprudência', path: '/search', Icon: Search },
              { label: 'Ver prazos do dia', path: '/deadlines', Icon: Calendar },
              { label: 'Conversar com assistente', path: '/chat', Icon: MessageSquare },
              { label: 'Gerenciar clientes', path: '/clients', Icon: Users },
              { label: 'Calcular honorários', path: '/calculator', Icon: Calculator },
            ].map(({ label, path, Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <Icon size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-700 flex-1">{label}</span>
                <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
