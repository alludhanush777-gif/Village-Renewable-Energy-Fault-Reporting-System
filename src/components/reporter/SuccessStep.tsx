import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Activity, Home } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { useNavigation } from '../../contexts/NavigationContext';

interface SuccessStepProps {
  ticketId: string | null;
  onBack: () => void;
}

export const SuccessStep: React.FC<SuccessStepProps> = ({ ticketId, onBack }) => {
  const { setView } = useNavigation();

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12 space-y-8">
      <div className="w-32 h-32 bg-[#00A86B] rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(0,168,107,0.5)]">
        <CheckCircle2 className="w-16 h-16 text-white" />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-black tracking-tighter uppercase">Report Received</h2>
        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Ticket ID: {ticketId}</p>
      </div>
      <GlassCard className="p-6 space-y-4 text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Current Status</span>
          <span className="text-[#00A86B] text-[10px] font-black uppercase">Received</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '20%' }} className="h-full bg-[#00A86B]" />
        </div>
        <p className="text-xs text-gray-400 leading-relaxed italic">
          "Our technicians have been alerted via SMS and WhatsApp. We are reviewing your hardware profile and photos now."
        </p>
      </GlassCard>
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => setView('tracker')} 
          className="w-full py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_20px_40px_rgba(0,168,107,0.3)]"
        >
          <Activity className="w-5 h-5" /> Track My Complaint
        </button>
        <button onClick={onBack} className="w-full py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
          <Home className="w-5 h-5" /> Back to Home
        </button>
      </div>
    </motion.div>
  );
};
