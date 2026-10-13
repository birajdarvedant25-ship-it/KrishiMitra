import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.js';
import { useFarm } from '../context/FarmContext.js';
import { api } from '../services/api.js';
import { VoiceReader } from '../components/common/VoiceReader.js';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { location, crops } = useFarm();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'mr'
          ? 'रामराम शेतकरी बांधव! 🙏 मी आपला डिजिटल कृषिमित्र आहे. आपण मला पिकावरील रोग, सेंद्रिय उपाय, पाणी नियोजन, खते किंवा हवामानाविषयी विचारू शकता. मी आपल्या सेवेसाठी सदैव तत्पर आहे!'
          : language === 'hi'
          ? 'नमस्ते किसान साथी! 🙏 मैं आपका डिजिटल कृषिमित्र सहायक हूँ। आप मुझसे फसल के रोग, जैविक समाधान, सिंचाई, खाद अथवा मौसम से जुड़े सवाल पूछ सकते हैं।'
          : 'Hello Farmer! 🙏 I am KrishiMitra, your AI agricultural companion. Ask me any questions about crop diseases, organic remedies, irrigation planning, or weather management!'
    }
  ]);

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isSending) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const activeCropsStr = crops.map((c) => c.cropName).join(', ');
      const res = await api.advisor.chat({
        message: text,
        history: messages.map((m) => ({ role: m.role, content: m.content })),
        language,
        location,
        crop: activeCropsStr
      });

      if (res.success && res.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: res.reply
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Sorry, I could not process your query at this moment. Please try again.'
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Unable to reach farming assistant. Please check your network connection.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    t('assistant.q1'),
    t('assistant.q2'),
    t('assistant.q3'),
    t('assistant.q4')
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-16 animate-in fade-in flex flex-col h-[calc(100vh-140px)]">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200/90 shadow-xs flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight">
              {t('assistant.title')}
            </h1>
            <p className="text-xs text-stone-500">
              {t('assistant.subtitle')} • {location}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 shrink-0 no-scrollbar">
        {samplePrompts.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-purple-50 text-stone-700 hover:text-purple-800 border border-stone-200 text-xs font-semibold whitespace-nowrap shadow-xs transition-colors shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="grow overflow-y-auto bg-stone-50/70 rounded-3xl p-4 sm:p-6 border border-stone-200 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                  : 'bg-white text-stone-800 border border-stone-200/90 rounded-tl-none space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {msg.role === 'assistant' && (
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400 font-medium">KrishiMitra AI</span>
                  <VoiceReader textToRead={msg.content} />
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white rounded-2xl p-4 text-xs text-stone-500 border border-stone-200 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>Thinking with agricultural knowledge...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-stone-300 shadow-md shrink-0 focus-within:border-emerald-600"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('assistant.placeholder')}
          className="grow px-3 py-2 text-sm text-stone-800 placeholder-stone-400 bg-transparent focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
