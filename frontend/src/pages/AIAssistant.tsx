import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { Bot, Send, User as UserIcon, Sparkles, MessageSquare } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: string; text: string }>>([
    {
      sender: 'ASSISTANT',
      text: 'Hello! I am your AI Business Operating System Assistant. Ask me anything about your Sales, Revenue trends, Inventory restock needs, Customer churn, or GST compliance.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Why did profit decrease?',
    'Predict next month sales',
    'Which product needs restocking?',
    'Which customer is at risk?',
    'Generate GST summary',
    'Show my best performing products',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'USER', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: query,
        conversationId,
      });

      setConversationId(res.data.conversationId);
      setMessages((prev) => [...prev, { sender: 'ASSISTANT', text: res.data.message.text }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ASSISTANT', text: 'Error connecting to AI service. Please verify server status.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              AI Business Intelligence Copilot <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </h2>
            <p className="text-[11px] text-slate-400">Contextualized across company database & predictive ML models</p>
          </div>
        </div>
      </div>

      {/* Suggested Questions Bar */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto custom-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap px-2">Prompts:</span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs whitespace-nowrap transition-colors border border-slate-700/60"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 max-w-3xl ${msg.sender === 'USER' ? 'ml-auto flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'USER' ? 'bg-blue-600 text-white' : 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
              }`}
            >
              {msg.sender === 'USER' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              Analyzing company database & generating insights...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-slate-800 bg-slate-900 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your business operations..."
          className="flex-1 bg-slate-800/90 border border-slate-700/80 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
        >
          Send <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
