import { useState } from 'react';
import { Calculator, Info, DollarSign, Percent } from 'lucide-react';

interface CalculationResult {
  minimum: number;
  suggested: number;
  contingency: number;
  description: string;
}

interface CaseType {
  id: string;
  label: string;
  area: string;
  minPercent: number;
  suggestedPercent: number;
  description: string;
  minFixed?: number;
}

const caseTypes: CaseType[] = [
  { id: 'cobranca', label: 'Ação de Cobrança', area: 'civil', minPercent: 10, suggestedPercent: 20, description: 'Baseado na Tabela OAB — mínimo 10% sobre o valor da causa' },
  { id: 'danos_morais', label: 'Ação de Danos Morais', area: 'civil', minPercent: 20, suggestedPercent: 30, description: 'Mínimo 20% sobre o valor postulado' },
  { id: 'trabalhista', label: 'Reclamação Trabalhista', area: 'labor', minPercent: 15, suggestedPercent: 25, description: 'Mínimo 15% sobre o valor da condenação' },
  { id: 'divorcio', label: 'Divórcio Consensual', area: 'family', minPercent: 0, suggestedPercent: 0, minFixed: 2000, description: 'Honorário fixo mínimo de R$ 2.000,00 conforme Tabela OAB' },
  { id: 'inventario', label: 'Inventário / Arrolamento', area: 'civil', minPercent: 2, suggestedPercent: 4, description: 'Mínimo 2% sobre o valor do monte-mor' },
  { id: 'habeas_corpus', label: 'Habeas Corpus', area: 'criminal', minPercent: 0, suggestedPercent: 0, minFixed: 3000, description: 'Honorário fixo mínimo de R$ 3.000,00' },
  { id: 'mandado_seguranca', label: 'Mandado de Segurança', area: 'constitutional', minPercent: 0, suggestedPercent: 0, minFixed: 2500, description: 'Honorário fixo mínimo de R$ 2.500,00' },
  { id: 'execucao', label: 'Execução de Título', area: 'civil', minPercent: 5, suggestedPercent: 10, description: 'Mínimo 5% sobre o valor da execução' },
  { id: 'consultoria', label: 'Consultoria Jurídica', area: 'civil', minPercent: 0, suggestedPercent: 0, minFixed: 500, description: 'Honorário por hora ou valor fixo. Mínimo R$ 500,00/h' },
  { id: 'contrato', label: 'Elaboração de Contrato', area: 'civil', minPercent: 0, suggestedPercent: 0, minFixed: 1000, description: 'Honorário fixo mínimo de R$ 1.000,00' },
];

const areaColors: Record<string, string> = {
  civil: 'bg-blue-50 text-blue-700',
  labor: 'bg-orange-50 text-orange-700',
  criminal: 'bg-red-50 text-red-700',
  family: 'bg-pink-50 text-pink-700',
  constitutional: 'bg-purple-50 text-purple-700',
};

const areaLabels: Record<string, string> = {
  civil: 'Cível', labor: 'Trabalhista', criminal: 'Criminal',
  family: 'Família', constitutional: 'Constitucional',
};

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseCurrency(value: string): number {
  const clean = value.replace(/[^0-9,]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
}

export function CalculatorPage() {
  const [selectedType, setSelectedType] = useState<CaseType | null>(null);
  const [caseValue, setCaseValue] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [customPercent, setCustomPercent] = useState('');

  const handleCalculate = () => {
    if (!selectedType) return;
    const value = parseCurrency(caseValue);
    const custom = parseFloat(customPercent) || 0;

    if (selectedType.minFixed && selectedType.minFixed > 0) {
      const suggested = custom > 0 ? (value * custom / 100) : selectedType.minFixed;
      setResult({
        minimum: selectedType.minFixed,
        suggested: Math.max(selectedType.minFixed, suggested),
        contingency: 0,
        description: selectedType.description,
      });
    } else {
      if (value <= 0) return;
      const minHonorario = value * selectedType.minPercent / 100;
      const suggestedHonorario = value * (custom > 0 ? custom : selectedType.suggestedPercent) / 100;
      const contingency = value * 10 / 100;
      setResult({
        minimum: minHonorario,
        suggested: suggestedHonorario,
        contingency,
        description: selectedType.description,
      });
    }
  };

  const needsValue = selectedType && (!selectedType.minFixed || selectedType.minFixed === 0 || customPercent);

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calculadora de Honorários</h1>
        <p className="text-gray-500 text-sm mt-1">Calcule honorários com base na Tabela OAB e no valor da causa</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-5">
        <h2 className="font-semibold text-gray-900 mb-3">Tipo de serviço</h2>
        <div className="grid sm:grid-cols-2 gap-2 mb-5">
          {caseTypes.map(type => (
            <button
              key={type.id}
              onClick={() => { setSelectedType(type); setResult(null); }}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                selectedType?.id === type.id
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{type.label}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${areaColors[type.area]}`}>
                  {areaLabels[type.area]}
                </span>
              </div>
            </button>
          ))}
        </div>

        {selectedType && (
          <>
            <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3 mb-4 text-xs text-blue-700">
              <Info size={14} className="flex-shrink-0 mt-0.5" />
              <span>{selectedType.description}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              {(!selectedType.minFixed || customPercent) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <DollarSign size={14} className="inline mr-1" />
                    Valor da causa (R$)
                  </label>
                  <input
                    type="text"
                    value={caseValue}
                    onChange={e => { setCaseValue(e.target.value); setResult(null); }}
                    placeholder="0,00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Percent size={14} className="inline mr-1" />
                  Percentual personalizado (%)
                </label>
                <input
                  type="number"
                  value={customPercent}
                  onChange={e => { setCustomPercent(e.target.value); setResult(null); }}
                  placeholder={selectedType.minPercent > 0 ? `Mínimo ${selectedType.minPercent}%` : 'Opcional'}
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={needsValue ? parseCurrency(caseValue) <= 0 : false}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              <Calculator size={16} /> Calcular Honorários
            </button>
          </>
        )}

        {!selectedType && (
          <div className="text-center py-6 text-gray-400 text-sm">
            Selecione o tipo de serviço acima para calcular
          </div>
        )}
      </div>

      {result && selectedType && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Resultado: {selectedType.label}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
              <div>
                <p className="text-sm font-medium text-red-800">Honorário Mínimo (Tabela OAB)</p>
                <p className="text-xs text-red-600 mt-0.5">Valor abaixo do mínimo não é recomendado</p>
              </div>
              <p className="text-lg font-bold text-red-700">{formatCurrency(result.minimum)}</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <div>
                <p className="text-sm font-medium text-green-800">
                  Honorário {customPercent ? 'Personalizado' : 'Sugerido'}
                </p>
                <p className="text-xs text-green-600 mt-0.5">
                  {customPercent
                    ? `${customPercent}% sobre o valor da causa`
                    : selectedType.minFixed
                      ? 'Valor fixo sugerido'
                      : `${selectedType.suggestedPercent}% sobre o valor da causa`}
                </p>
              </div>
              <p className="text-lg font-bold text-green-700">{formatCurrency(result.suggested)}</p>
            </div>

            {result.contingency > 0 && (
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div>
                  <p className="text-sm font-medium text-purple-800">Honorário de Êxito (10%)</p>
                  <p className="text-xs text-purple-600 mt-0.5">Percentual adicional sobre o ganho</p>
                </div>
                <p className="text-lg font-bold text-purple-700">{formatCurrency(result.contingency)}</p>
              </div>
            )}

            {result.contingency > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-800">Total com êxito</p>
                  <p className="text-xs text-gray-500 mt-0.5">Honorário sugerido + êxito</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(result.suggested + result.contingency)}</p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-start gap-1.5">
              <Info size={12} className="flex-shrink-0 mt-0.5" />
              Os valores são calculados com base na Tabela de Honorários da OAB e podem variar conforme
              a complexidade do caso, instâncias percorridas e acordo com o cliente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
