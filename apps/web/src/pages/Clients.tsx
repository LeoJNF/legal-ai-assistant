import { useEffect, useState } from 'react';
import { Users, Plus, Phone, Mail, Briefcase, ChevronRight, X, Search } from 'lucide-react';
import { api } from '@/services/api';
import { Spinner } from '@/components/Spinner';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  oab?: string;
  activeCases: number;
  totalCases: number;
  createdAt: string;
  lastActivity: string;
  status: 'active' | 'inactive';
  area: string;
}

const areaColors: Record<string, string> = {
  civil: 'bg-blue-50 text-blue-700',
  labor: 'bg-orange-50 text-orange-700',
  criminal: 'bg-red-50 text-red-700',
  family: 'bg-pink-50 text-pink-700',
  business: 'bg-green-50 text-green-700',
};

const areaLabels: Record<string, string> = {
  civil: 'Cível', labor: 'Trabalhista', criminal: 'Criminal',
  family: 'Família', business: 'Empresarial',
};

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', cpf: '', area: 'civil' });

  useEffect(() => {
    api.getClients().then(data => setClients(data as Client[])).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const client = await api.createClient(form);
      setClients(prev => [client as Client, ...prev]);
      setForm({ name: '', email: '', phone: '', cpf: '', area: 'civil' });
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.cpf.includes(search)
  );

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  if (selectedClient) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedClient(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
          >
            <X size={16} /> Fechar
          </button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Users size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{selectedClient.name}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${areaColors[selectedClient.area] || 'bg-gray-50 text-gray-600'}`}>
                {areaLabels[selectedClient.area] || selectedClient.area}
              </span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${selectedClient.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {selectedClient.status === 'active' ? 'Ativo' : 'Inativo'}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail size={16} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">E-mail</p>
                <p className="text-sm font-medium text-gray-800">{selectedClient.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone size={16} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Telefone</p>
                <p className="text-sm font-medium text-gray-800">{selectedClient.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">CPF</p>
                <p className="text-sm font-medium text-gray-800">{selectedClient.cpf}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Processos</p>
                <p className="text-sm font-medium text-gray-800">{selectedClient.activeCases} ativos / {selectedClient.totalCases} total</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
            <span>Cliente desde {new Date(selectedClient.createdAt).toLocaleDateString('pt-BR')}</span>
            <span>Última atividade {new Date(selectedClient.lastActivity).toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie seus clientes e processos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Novo Cliente</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome completo *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Nome do cliente"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                value={form.cpf}
                onChange={e => setForm(p => ({ ...p, cpf: e.target.value }))}
                placeholder="000.000.000-00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="email@exemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área jurídica</label>
              <select
                value={form.area}
                onChange={e => setForm(p => ({ ...p, area: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(areaLabels).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !form.name.trim()}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <><Spinner size="sm" /> Salvando...</> : 'Salvar Cliente'}
          </button>
        </div>
      )}

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar clientes por nome, e-mail ou CPF..."
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Users size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">
            {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
          </p>
          {!search && (
            <button onClick={() => setShowForm(true)} className="mt-3 text-blue-600 text-sm hover:underline">
              Adicionar primeiro cliente
            </button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(client => (
            <button
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">{client.name}</p>
                  <p className="text-xs text-gray-500 truncate">{client.email}</p>
                </div>
                <ChevronRight size={14} className="text-gray-300 flex-shrink-0 mt-1" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${areaColors[client.area] || 'bg-gray-50 text-gray-600'}`}>
                  {areaLabels[client.area] || client.area}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {client.activeCases} processo{client.activeCases !== 1 ? 's' : ''}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
