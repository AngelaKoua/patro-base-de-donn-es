'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: 'model',
  content:
    "Bonjour ! Je suis l'assistant du Patro. Je peux répondre à vos questions sur le fonctionnement du site et sur la façon de remplir chaque onglet (enfants, animateurs, directeurs, aumôniers, évènements, statistiques). Comment puis-je vous aider ?",
};

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={`${keyPrefix}-${i}`}>{part}</React.Fragment>;
  });
}

function FormattedMessage({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);

  return (
    <div className="space-y-2">
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim() !== '');
        const isBulleted = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l.trim()));
        const isNumbered = lines.length > 0 && lines.every((l) => /^\d+[.)]\s+/.test(l.trim()));

        if (isBulleted) {
          return (
            <ul key={bi} className="list-disc pl-4 space-y-1">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.trim().replace(/^[-*]\s+/, ''), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        if (isNumbered) {
          return (
            <ol key={bi} className="list-decimal pl-4 space-y-1">
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.trim().replace(/^\d+[.)]\s+/, ''), `${bi}-${li}`)}</li>
              ))}
            </ol>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <React.Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l, `${bi}-${li}`)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: text }];
    setMessages(nextMessages);
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post('/api/chatbot', {
        message: text,
        history: nextMessages.slice(0, -1),
      });
      if (res.data.success) {
        setMessages((prev) => [...prev, { role: 'model', content: res.data.reply }]);
      } else {
        setError(res.data.message || "Le chatbot n'a pas pu répondre.");
      }
    } catch {
      setError('Impossible de contacter le chatbot pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[92vw] max-w-sm h-[520px] max-h-[75vh] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-sky-100 flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">Assistant Patro</p>
                <p className="text-sky-100 text-xs leading-tight">Aide sur la plateforme</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le chat"
              className="text-white/90 hover:text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-sky-50/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                    m.role === 'user' ? 'bg-blue-500' : 'bg-sky-500'
                  }`}
                >
                  {m.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm whitespace-pre-wrap'
                      : 'bg-white text-gray-700 border border-sky-100 rounded-tl-sm'
                  }`}
                >
                  {m.role === 'model' ? <FormattedMessage text={m.content} /> : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start gap-2">
                <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-sky-500">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white text-gray-500 border border-sky-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  En train d&apos;écrire...
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <div className="border-t border-sky-100 p-2 flex items-center gap-2 shrink-0 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              className="flex-1 border-2 border-sky-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sky-400"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
              className="bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl p-2.5 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Fermer le chatbot' : 'Ouvrir le chatbot'}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 shadow-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
