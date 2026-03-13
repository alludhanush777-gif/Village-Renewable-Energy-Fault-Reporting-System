import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Zap, WifiOff } from 'lucide-react';
import { GlassCard } from '../GlassCard';
import { VillagerProfile, ComplaintCategory, SeverityLevel } from '../../types';

interface ReviewStepProps {
  profile: VillagerProfile;
  category: ComplaintCategory;
  severity: SeverityLevel;
  handleSubmit: () => void;
  isSubmitting: boolean;
  prevStep: () => void;
  teamStatus: { msg: string } | null;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ 
  profile, category, severity,
  handleSubmit, isSubmitting, prevStep,
  teamStatus
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <ShieldAlert className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Final Review</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 8 of 8</p>
      </div>
      <GlassCard className="p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#00A86B]/10 rounded-xl"><Zap className="w-6 h-6 text-[#00A86B]" /></div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Issue</p>
              <p className="text-lg font-black uppercase">{category.replace('_', ' ')}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${
            severity === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
          }`}>{severity}</div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-[10px]">
          <div>
            <p className="text-gray-500 font-bold uppercase mb-1">Reporter</p>
            <p className="text-white font-black">{profile.fullName}</p>
          </div>
          <div>
            <p className="text-gray-500 font-bold uppercase mb-1">Village</p>
            <p className="text-white font-black">{profile.village}</p>
          </div>
        </div>
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3">
          <WifiOff className="w-4 h-4 text-emerald-500" />
          <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Offline Submission Ready</p>
        </div>
      </GlassCard>
      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest">Back</button>
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="flex-[2] py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_20px_40px_rgba(0,168,107,0.3)] overflow-hidden relative"
        >
          {isSubmitting ? (
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2" />
              <div className="text-[8px] font-black animate-pulse">
                {teamStatus?.msg || 'Processing...'}
              </div>
            </div>
          ) : 'Submit Report'}
        </button>
      </div>
    </motion.div>
  );
};
