import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Scale, Trash2, Edit2, FileDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { generatePetitionSchema, type GeneratePetitionInput, PETITION_TYPES } from '@legal-ai/shared';
import { petitionsService } from '../services/petitionsService';
import type { Petition } from '@legal-ai/shared';

const PETITION_TYPE_OPTIONS = Object.entries(PETITION_TYPES) as [string, string][];

export function PetitionsPage() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPetition, setSelectedPetition] = useState<Petition | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneratePetitionInput>({ resolver: zodResolver(generatePetitionSchema) });

  useEffect(() => {
    loadPetitions();
  }, []);

  const loadPetitions = async () => {
    try {
      const data = await petitionsService.list();
      setPetitions(data);
    } catch {
      toast.error('Erro ao carregar petições');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: GeneratePetitionInput) => {
    setGenerating(true);
    try {
      const petition = await petitionsService.generate(data);
      setPetitions((prev) => [petition, ...prev]);
      setShowForm(false);
      reset();
      toast.success('Petição gerada com sucesso!');
    } catch {
      toast.error('Erro ao gerar petição. Verifique a configuração da OpenAI API.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirmar exclusão da petição?')) return;
    try {
      await petitionsService.delete(id);
      setPetitions((prev) => prev.filter((p) => p.id !== id));
      toast.success('Petição excluída');
    } catch {
      toast.error('Erro ao excluir petição');
    }
  };

  const handleDownload = (petition: Petition) => {
    const blob = new Blob([petition.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${petition.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Petições</h1>
          <p className="text-gray-500">Gere petições jurídicas com IA</p>
        </div>
        <button
          onClick={() => { setShowForm(true); reset(); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Gerar Petição
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="card animate-pulse h-20" />)}
        </div>
      ) : petitions.length === 0 ? (
        <div className="card text-center py-16">
          <Scale className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Nenhuma petição</h3>
          <p className="text-gray-500 mt-1">Gere sua primeira petição com IA</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Gerar Petição
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {petitions.map((petition) => (
            <div key={petition.id} className="card flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{petition.title}</p>
                <p className="text-sm text-gray-400">
                  {PETITION_TYPES[petition.type as keyof typeof PETITION_TYPES]} •{' '}
                  {petition.clientName}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPetition(petition)}
                  className="p-1.5 text-gray-400 hover:text-blue-500"
                  title="Visualizar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownload(petition)}
                  className="p-1.5 text-gray-400 hover:text-green-500"
                  title="Baixar"
                >
                  <FileDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(petition.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Generate Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Gerar Petição com IA</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Petição *</label>
                <select {...register('type')} className="input-field">
                  {PETITION_TYPE_OPTIONS.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente *</label>
                  <input {...register('clientName')} className="input-field" />
                  {errors.clientName && <p className="text-sm text-red-500 mt-1">{errors.clientName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                  <input {...register('clientCpf')} placeholder="000.000.000-00" className="input-field" />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Fatos *</label>
                <textarea {...register('facts')} rows={4} className="input-field" placeholder="Descreva os fatos relevantes..." />
                {errors.facts && <p className="text-sm text-red-500 mt-1">{errors.facts.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fundamentos Jurídicos</label>
                <textarea {...register('legalGrounds')} rows={3} className="input-field" placeholder="Artigos e legislação aplicável..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pedido *</label>
                <textarea {...register('request')} rows={3} className="input-field" placeholder="O que está sendo requerido..." />
                {errors.request && <p className="text-sm text-red-500 mt-1">{errors.request.message}</p>}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Cancelar
                </button>
                <button type="submit" disabled={generating} className="flex-1 btn-primary disabled:opacity-50">
                  {generating ? 'Gerando...' : 'Gerar com IA'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Petition Modal */}
      {selectedPetition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSelectedPetition(null)} />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{selectedPetition.title}</h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans bg-gray-50 p-4 rounded-lg">
              {selectedPetition.content}
            </pre>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setSelectedPetition(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                Fechar
              </button>
              <button onClick={() => handleDownload(selectedPetition)} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <FileDown className="w-4 h-4" />
                Baixar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
