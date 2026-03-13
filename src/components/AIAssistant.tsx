import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Mic, 
  Volume2, 
  ArrowLeft, 
  Bot, 
  User, 
  Zap, 
  ShieldAlert, 
  Wrench, 
  Code2,
  Sparkles,
  Terminal
} from 'lucide-react';
import { ChatMessage, UserRole } from '../types';
import { aiService } from '../services/aiService';
import { GlassCard } from './GlassCard';

interface AIAssistantProps {
  onBack: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I am the Sentinel AI Assistant. I can help you diagnose power issues, learn about safety, or debug the platform. How can I help you today?",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [role, setRole] = useState<UserRole>('Villager');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(async () => {
      const aiResponse = await aiService.diagnose(input, role);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      
      // Simulate TTS for assistant response
      console.log(`[TTS] Speaking: ${aiResponse.content}`);
    }, 1500);
  };

  const getRoleIcon = (r: UserRole) => {
    switch (r) {
      case 'Villager': return <User className="w-4 h-4" />;
      case 'Technician': return <Wrench className="w-4 h-4" />;
      case 'Developer': return <Code2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-[#00A86B] p-2 rounded-xl shadow-[0_0_20px_rgba(0,168,107,0.2)]">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter">SENTINEL AI CORE</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Autonomous Agent Active</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
          {(['Villager', 'Technician', 'Developer'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                role === r ? 'bg-[#00A86B] text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              {getRoleIcon(r)}
              {r}
            </button>
          ))}
        </div>
      </header>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar max-w-4xl mx-auto w-full"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'user' ? 'bg-white/10' : 'bg-[#00A86B]/20 border border-[#00A86B]/30'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-[#00A86B]" />}
                </div>
                
                <div className="space-y-2">
                  <GlassCard className={`p-4 ${
                    msg.role === 'user' ? 'bg-white/5' : 'bg-[#0D0D0D] border-white/10'
                  }`}>
                    <p className="text-sm leading-relaxed text-gray-200">{msg.content}</p>
                    
                    {msg.intent && (
                      <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-3">
                        <span className="text-[8px] font-black text-[#00A86B] uppercase tracking-widest bg-[#00A86B]/10 px-2 py-0.5 rounded">
                          Intent: {msg.intent}
                        </span>
                        {msg.tools?.map(t => (
                          <span key={t} className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded">
                            Tool: {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </GlassCard>

                  {msg.diagnosis && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3"
                    >
                      <ShieldAlert className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">AI Pre-Diagnosis</p>
                        <p className="text-xs text-gray-300">{msg.diagnosis}</p>
                        {msg.recommendedKit && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {msg.recommendedKit.map(k => (
                              <span key={k} className="text-[8px] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10">
                                {k}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-2xl px-4 py-3 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 border-t border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask Sentinel AI as a ${role}...`}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-32 text-sm focus:outline-none focus:border-[#00A86B]/50 transition-all"
          />
          <div className="absolute right-2 top-2 bottom-2 flex gap-2">
            <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white group relative">
              <Mic className="w-5 h-5" />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Voice-to-Text</span>
            </button>
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="bg-[#00A86B] text-white px-6 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00C880] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-4 flex items-center justify-between text-[8px] font-black text-gray-600 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> RAG Memory: Active</span>
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> Code Guardian: Monitoring</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Multi-Language: Auto-Detect</span>
            <span className="text-emerald-500/50">Offline SMS Handshake Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
