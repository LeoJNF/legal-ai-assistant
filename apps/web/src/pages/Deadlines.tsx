import { useEffect, useState } from 'react';
import { Plus, CheckCircle, Trash2, X, AlertOctagon, AlertTriangle, Clock, Calendar } from 'lucide-react';
import { api } from '@/services/api';
import { Spinner } from '@/components/Spinner';

interface Deadline {
  id: string;
  processNumber: string;
  description: string;
  dueDate: string;
  status: string;
  daysRemaining: number;
  priority: string;
  court: string;
  type: string;
}

const priorityConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
  urgent: { color: 'bg-red-50 border-red-200 text-red-800', label: 'Urgente', icon: AlertOctagon },
  high: { color: 'bg-orange-50 border-orange-200 text-orange-800', label: 'Alta', icon: AlertTriangle },
  medium: { color: 'bg-yellow-50 border-yellow-200 text-yellow-800', label: 'Média', icon: Clock },
  low: { color: 'bg-green-50 border-green-200 text-green-800', label: 'Baixa', icon: Calendar },
};

const typeLabels: Record<string, string> = {
  contestacao: 'Contestação', razoes_finais: 'Razões Finais', recurso: 'Recurso',
  manifestacao: 'Manifestação', peticao_inicial: 'Petição Inicial', outros: 'Outros',
};

export function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    processNumber: '', description: '', dueDate: '', court: '', type: 'outros', priority: 'medium',
  });

  useEffect(() => {
    api.getDeadlines().then(d => setDeadlines(d as Deadline[])).finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.processNumber || !form.description || !form.dueDate) return;
    const dueDate = new Date(form.dueDate);
    const now = new Date();
    const daysRemaining = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const newDeadline = await api.createDeadline({
      ...form,
      dueDate: dueDate.toISOString(),
      status: 'pending',
      daysRemaining: Math.max(0, daysRemaining),
    } as Omit<Deadline, 'id'>);
    setDeadlines(prev => [newDeadline as Deadline, ...prev]);
    setShowForm(false);
    setForm({ processNumber: '', description: '', dueDate: '', court: '', type: 'outros', priority: 'medium' });
  };

  const handleDelete = async (id: string) => {
    await api.deleteDeadline(id);
    setDeadlines(prev => prev.filter(d => d.id !== id));
  };

  const handleComplete = async (id: string) => {
    await api.updateDeadline(id, { status: 'completed', daysRemaining: 0 });
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, status: 'completed', daysRemaining: 0 } : d));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  const pending = deadlines.filter(d => d.status === 'pending').sort((a, b) => a.daysRemaining - b.daysRemaining);
  const completed = deadlines.filter(d => d.status === 'completed');

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Prazos</h1>
          <p className="text-gray-500 text-sm mt-1">Controle seus prazos processuais</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Novo Prazo
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Adicionar Prazo</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número do Processo</label>
              <input type="text" value={form.processNumber} onChange={e => setForm(p => ({ ...p, processNumber: e.target.value }))}
                placeholder="0001234-56.2026.8.19.0001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <input type="text" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Contestação, Recurso..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Limite</label>
              <input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tribunal / Vara</label>
              <input type="text" value={form.court} onChange={e => setForm(p => ({ ...p, court: e.target.value }))}
                placeholder="3ª Vara Cível"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Média</option>
                <option value="low">Baixa</option>
              </select>
            </div>
          </div>
          <button onClick={handleCreate}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Adicionar Prazo
          </button>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-semibold text-gray-900">Prazos Pendentes ({pending.length})</h2>
        {pending.length === 0 && (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200 text-gray-500">
            Nenhum prazo pendente
          </div>
        )}
        {pending.map(deadline => {
          const p = priorityConfig[deadline.priority] || priorityConfig.medium;
          return (
            <div key={deadline.id} className={`bg-white rounded-xl border p-4 ${deadline.daysRemaining <= 3 ? 'border-red-200' : 'border-gray-200'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${p.color.split(' ')[0]}`}>
                  {(() => { const Ic = p.icon; return <Ic size={16} className={p.color.split(' ')[2]} />; })()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{deadline.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{deadline.processNumber}</p>
                      {deadline.court && <p className="text-xs text-gray-400">{deadline.court}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${p.color}`}>
                        {deadline.daysRemaining === 0 ? 'Hoje!' : deadline.daysRemaining === 1 ? 'Amanhã!' : `${deadline.daysRemaining} dias`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={11} className="text-gray-400" />
                      {new Date(deadline.dueDate).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{typeLabels[deadline.type] || deadline.type}</span>
                    <div className="flex gap-1 ml-auto">
                      <button onClick={() => handleComplete(deadline.id)}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors" title="Marcar como concluído">
                        <CheckCircle size={14} />
                      </button>
                      <button onClick={() => handleDelete(deadline.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Remover">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {completed.length > 0 && (
          <>
            <h2 className="font-semibold text-gray-900 pt-4">Concluídos ({completed.length})</h2>
            {completed.map(deadline => (
              <div key={deadline.id} className="bg-gray-50 rounded-xl border border-gray-100 p-4 opacity-70">
                <div className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 text-sm">{deadline.description}</p>
                    <p className="text-xs text-gray-400">{deadline.processNumber}</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Concluído</span>
                  <button onClick={() => handleDelete(deadline.id)}
                    className="p-1 rounded text-gray-300 hover:text-red-400 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
