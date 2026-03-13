import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Map, 
  MessageSquare, 
  Phone, 
  AlertTriangle, 
  Users, 
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { GlassCard } from './GlassCard';

export const CommunityAlerts: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentCount, setSentCount] = useState<number | null>(null);

  const handleBroadcast = async () => {
    setIsSending(true);
    // Mimic Enterprise SMS dispatch
    await new Promise(r => setTimeout(r, 2000));
    setSentCount(1240);
    setIsSending(false);
    setMessage('');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <header>
        <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Mass Broadcast System</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#00A86B]" />
          Outbound Community Alert & Maintenance Notifications
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8 border-white/5 space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Select Target Region</label>
            <div className="grid grid-cols-2 gap-3">
              {['All Regions', 'Omo Valley', 'Maji Moto', 'Turkana'].map(reg => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    selectedRegion === reg 
                      ? 'bg-[#00A86B]/10 border-[#00A86B] text-[#00A86B]' 
                      : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Alert Content</label>
            <textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="E.g., Scheduled maintenance tomorrow from 10 AM..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:border-[#00A86B]/50 resize-none transition-all"
            />
          </div>

          <button
            disabled={!message || isSending}
            onClick={handleBroadcast}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#00A86B] rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(0,168,107,0.2)] hover:bg-[#00D084] disabled:opacity-50 transition-all"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSending ? 'Dispatching SMS...' : 'Broadcast Mass Alert'}
          </button>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-8 border-white/5 bg-gradient-to-br from-amber-500/10 to-transparent">
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Usage Policy
            </h4>
            <p className="text-xs font-bold text-gray-400 leading-relaxed">
              Global broadcasts generate costs per SMS. Ensure messages are clear and contain actionable info for villagers.
            </p>
          </GlassCard>

          <AnimatePresence>
            {sentCount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] relative overflow-hidden"
              >
                <div className="relative z-10">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-4" />
                  <h3 className="text-xl font-black text-white mb-1">Broadcast Successful</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Sent to <span className="text-emerald-500">{sentCount}</span> subscribers in {selectedRegion}
                  </p>
                </div>
                <button 
                  onClick={() => setSentCount(null)}
                  className="absolute top-6 right-6 p-2 text-gray-600 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
