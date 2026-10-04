import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { useProperties } from '../context/PropertyContext';
import { Property } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
}

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty?: (property: Property) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  onSelectProperty
}) => {
  const { properties } = useProperties();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hello! I am Gerald AI Assistant. I can help you discover verified houses, land parcels, and commercial spaces across Nigeria directly from our database. Ask me anything like: 'I have ₦20 million and I want land around Abuja.'",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          propertiesContext: properties
        })
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I don't have verified information for that detail.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "Sorry, I couldn't reach the assistant service at this moment. Please check your connection or search via the main filters.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'I have ₦20 million and I want land around Abuja',
    'What 3 bedroom flats are available for rent in Lagos?',
    'Show me commercial shops for rent in Enugu'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-stone-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm font-display">Gerald AI Assistant</h3>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
              Grounded in Verified DB
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-xs'
                  : 'bg-stone-100 text-stone-800 rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div className={`mt-1 text-[10px] flex items-center justify-between gap-2 ${
                m.sender === 'user' ? 'text-emerald-200' : 'text-stone-400'
              }`}>
                <span>{m.timestamp}</span>
                {m.source && <span>({m.source})</span>}
              </div>
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-full bg-stone-800 text-white flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-stone-500 text-xs italic pl-9">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
            Analyzing database inventory...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sample prompts */}
      {messages.length < 3 && (
        <div className="px-4 py-2 border-t border-stone-100 bg-stone-50 space-y-1.5">
          <span className="text-[11px] text-stone-500 font-medium">Quick Suggestions:</span>
          <div className="flex flex-col gap-1">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-left text-[11px] text-stone-700 hover:text-emerald-800 bg-white p-2 rounded-lg border border-stone-200 hover:border-emerald-300 transition-colors cursor-pointer"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-stone-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your property question..."
            className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <span className="text-[10px] text-stone-400 block mt-1.5 text-center">
          Strict Zero-Hallucination Policy: Answers rely strictly on verified database records.
        </span>
      </div>
    </div>
  );
};
