import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Calendar, Trash2, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { createDeadlineSchema, type CreateDeadlineInput, DEADLINE_TYPES, PRIORITY_LABELS, formatDate, daysUntilDeadline } from '@legal-ai/shared';
import { deadlinesService } from '../services/deadlinesService';
import type { Deadline } from '@legal-ai/shared';

export function DeadlinesPage() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateDeadlineInput>({
    resolver: zodResolver(createDeadlineSchema),
  });

  useEffect(() => { loadDeadlines(); }, []);

  const loadDeadlines = async () => {
    try {
      const data = await deadlinesService.list();
      setDeadlines(data);
    } catch {
      toast.error('Erro ao carregar prazos');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: CreateDeadlineInput) => {
    setCreating(true);
    try {
      const deadline = await deadlinesService.create(data);
      setDeadlines((prev) => [...prev, deadline].sort((a, b) =>
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      ));
      setShowForm(false);
      reset();
      toast.success('Prazo cadastrado!');
    } catch {
      toast.error('Erro ao criar prazo');
    } finally {
      setCreating(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const updated = await deadlinesService.update(id, { status: 'COMPLETED' });
      setDeadlines((prev) => prev.map((d) => d.id === id ? updated : d));
      toast.success('Prazo marcado como concluído');
    } catch {
      toast.error('Erro ao atualizar prazo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirmar exclusão?')) return;
    try {
      await deadlinesService.delete(id);
      setDeadlines((prev) => prev.filter((d) => d.id !== id));
      toast.success('Prazo excluído');
    } catch {
      toast.error('Erro ao excluir prazo');
    }
  };

  const statusIcon = (deadline: Deadline) => {
    const days = daysUntilDeadline(deadline.dueDate);
    if (deadline.status === 'COMPLETED') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (deadline.status === 'OVERDUE' || days < 0) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (days <= 3) return <Clock className="w-5 h-5 text-orange-500" />;
    return <Calendar className="w-5 h-5 text-blue-500" />;
  };

  const priorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: 'bg-red-100 text-red-700',
      MEDIUM: 'bg-yellow-100 text-yellow-700',
      LOW: 'bg-green-100 text-green-700',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[priority] || ''}`}>
        {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS]}
      </span>
    );
  };

  const pendingCount = deadlines.filter(d => d.status === 'PENDING').length;
  const overdueCount = deadlines.filter(d => d.status === 'OVERDUE').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Prazos</h1>
          <p className="text-gray-500">
            {pendingCount} pendentes
            {overdueCount > 0 && <span className="text-red-500 ml-2">• {overdueCount} vencidos</span>}
          </p>
        </div>
        <button onClick={() => { setShowForm(true); reset(); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Prazo
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="card animate-pulse h-20" />)}</div>
      ) : deadlines.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum prazo cadastrado</h3>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Prazo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {deadlines.map((deadline) => {
            const days = daysUntilDeadline(deadline.dueDate);
            const isCompleted = deadline.status === 'COMPLETED';
            return (
              <div key={deadline.id} className={`card flex items-center justify-between ${isCompleted ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-4">
                  {statusIcon(deadline)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {deadline.title}
                      </p>
                      {priorityBadge(deadline.priority)}
                    </div>
                    <p className="text-sm text-gray-400">
                      {DEADLINE_TYPES[deadline.type as keyof typeof DEADLINE_TYPES]} •{' '}
                      {formatDate(deadline.dueDate)}
                      {deadline.caseNumber && ` • Proc: ${deadline.caseNumber}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${
                    isCompleted ? 'text-green-600' :
                    days < 0 ? 'text-red-600' :
                    days <= 3 ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {isCompleted ? 'Concluído' : days < 0 ? `${Math.abs(days)}d atraso` : `${days}d restantes`}
                  </span>
                  {!isCompleted && (
                    <button onClick={() => handleComplete(deadline.id)} className="p-1.5 text-gray-400 hover:text-green-500">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(deadline.id)} className="p-1.5 text-gray-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Deadline Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Novo Prazo</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                <input {...register('title')} className="input-field" />
                {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
                  <select {...register('type')} className="input-field">
                    {Object.entries(DEADLINE_TYPES).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade *</label>
                  <select {...register('priority')} className="input-field">
                    {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data/Hora *</label>
                <input {...register('dueDate')} type="datetime-local" className="input-field" />
                {errors.dueDate && <p className="text-sm text-red-500">{errors.dueDate.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nº do Processo</label>
                  <input {...register('caseNumber')} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vara/Tribunal</label>
                  <input {...register('court')} className="input-field" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea {...register('description')} rows={2} className="input-field" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={creating} className="flex-1 btn-primary disabled:opacity-50">
                  {creating ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
