import { useEffect, useState, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { api } from '@/services/api';
import { Spinner } from '@/components/Spinner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i}>{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </span>
  );
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getChatHistory().then(h => setMessages(h as Message[])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);
    setTyping(true);
    try {
      const response = await api.sendMessage(input);
      setTyping(false);
      setMessages(prev => [...prev, response as Message]);
      const history = [...messages, userMsg, response as Message];
      localStorage.setItem('mockChatHistory', JSON.stringify(history));
    } finally {
      setSending(false);
      setTyping(false);
    }
  };

  const suggestions = [
    'Qual o prazo recursal?',
    'Como calcular honorários?',
    'O que é prescrição?',
    'Como impetrar habeas corpus?',
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-1px)] max-w-3xl mx-auto">
      <div className="p-4 border-b border-gray-200 bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">Assistente Jurídico IA</h1>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              Online · Modo Demo
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'assistant' ? 'bg-blue-600' : 'bg-gray-300'}`}>
              {msg.role === 'assistant' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-gray-600" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'assistant' ? 'bg-white border border-gray-200 text-gray-800' : 'bg-blue-600 text-white'}`}>
              <div className="leading-relaxed whitespace-pre-line">
                <MessageContent content={msg.content} />
              </div>
              <p className={`text-xs mt-1 ${msg.role === 'assistant' ? 'text-gray-400' : 'text-blue-200'}`}>
                {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {typing && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-3 bg-gray-50 flex-shrink-0">
          <p className="text-xs text-gray-500 mb-2">Sugestões:</p>
          <div className="flex gap-2 flex-wrap">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 bg-white border-t border-gray-200 flex-shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua dúvida jurídica..."
            disabled={sending}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={sending || !input.trim()}
            className="w-11 h-11 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center"
          >
            {sending ? <Spinner size="sm" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
