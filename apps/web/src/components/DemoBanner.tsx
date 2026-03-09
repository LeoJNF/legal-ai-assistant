import { DEMO_MODE } from '@/config/demo';

export function DemoBanner() {
  if (!DEMO_MODE) return null;
  
  return (
    <div className="bg-yellow-50 border-b border-yellow-300 px-4 py-2 text-center">
      <p className="text-sm text-yellow-800">
        🎭 <strong>Modo Demonstração</strong> — Dados simulados para teste. Nenhuma requisição real é enviada ao servidor.
      </p>
    </div>
  );
}
