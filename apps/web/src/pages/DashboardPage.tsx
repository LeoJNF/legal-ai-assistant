import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Scale,
  Calendar,
  MessageSquare,
  AlertCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { documentsService } from '../services/documentsService';
import { deadlinesService } from '../services/deadlinesService';
import { petitionsService } from '../services/petitionsService';
import { formatDate, daysUntilDeadline } from '@legal-ai/shared';
import type { Document, Deadline, Petition } from '@legal-ai/shared';

export function DashboardPage() {
  const { user } = useAuthStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docs, dlns, pets] = await Promise.all([
          documentsService.list(),
          deadlinesService.list(),
          petitionsService.list(),
        ]);
        setDocuments(docs);
        setDeadlines(dlns);
        setPetitions(pets);
      } catch {
        // Silently fail for demo
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingDeadlines = deadlines
    .filter((d) => d.status === 'PENDING')
    .slice(0, 5);

  const stats = [
    {
      title: 'Documentos',
      value: documents.length,
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      href: '/documents',
    },
    {
      title: 'Petições',
      value: petitions.length,
      icon: Scale,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      href: '/petitions',
    },
    {
      title: 'Prazos Pendentes',
      value: deadlines.filter((d) => d.status === 'PENDING').length,
      icon: Calendar,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      href: '/deadlines',
    },
    {
      title: 'Prazos Vencidos',
      value: deadlines.filter((d) => d.status === 'OVERDUE').length,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      href: '/deadlines',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Aqui está um resumo do seu escritório.</p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ title, value, icon: Icon, color, bg, href }) => (
            <Link key={title} to={href} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`${bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Próximos Prazos
            </h2>
            <Link to="/deadlines" className="text-sm text-blue-600 hover:underline">
              Ver todos
            </Link>
          </div>

          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-400 text-sm">Nenhum prazo pendente.</p>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((deadline) => {
                const days = daysUntilDeadline(deadline.dueDate);
                return (
                  <div key={deadline.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(deadline.dueDate)}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        days < 0
                          ? 'bg-red-100 text-red-700'
                          : days <= 3
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {days < 0 ? `${Math.abs(days)}d atraso` : `${days}d`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/documents', icon: FileText, label: 'Analisar Documento', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
              { to: '/petitions', icon: Scale, label: 'Gerar Petição', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
              { to: '/deadlines', icon: Calendar, label: 'Novo Prazo', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
              { to: '/chat', icon: MessageSquare, label: 'Consultar IA', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            ].map(({ to, icon: Icon, label, color }) => (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl text-sm font-medium transition-colors ${color}`}
              >
                <Icon className="w-6 h-6" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
