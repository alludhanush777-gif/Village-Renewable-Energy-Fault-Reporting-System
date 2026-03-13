import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Zap, Sun, Battery, Settings, Wind, Flame } from 'lucide-react';
import { ComplaintCategory } from '../../types';

interface IssueCategoryStepProps {
  category: ComplaintCategory;
  setCategory: (category: ComplaintCategory) => void;
  nextStep: () => void;
  prevStep: () => void;
  renderStepNotes: (stepNum: number) => React.ReactNode;
}

const CATEGORIES: { id: ComplaintCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'NO_POWER', label: 'No Power', icon: <Zap className="w-12 h-12" />, color: 'bg-red-500' },
  { id: 'PANEL_DAMAGE', label: 'Panel Damage', icon: <Sun className="w-12 h-12" />, color: 'bg-amber-500' },
  { id: 'BATTERY_ISSUE', label: 'Battery Issue', icon: <Battery className="w-12 h-12" />, color: 'bg-blue-500' },
  { id: 'INVERTER_FAULT', label: 'Inverter Fault', icon: <Settings className="w-12 h-12" />, color: 'bg-orange-500' },
  { id: 'WIRING_ISSUE', label: 'Wiring Issue', icon: <Wind className="w-12 h-12" />, color: 'bg-emerald-500' },
  { id: 'OVERHEATING', label: 'Overheating', icon: <Flame className="w-12 h-12" />, color: 'bg-rose-500' },
];

export const IssueCategoryStep: React.FC<IssueCategoryStepProps> = ({ 
  category, 
  setCategory, 
  nextStep, 
  prevStep,
  renderStepNotes 
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <AlertTriangle className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">What is the problem?</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 5 of 8</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat.id);
              nextStep();
            }}
            className={`p-6 rounded-[2rem] border flex flex-col items-center justify-center gap-3 transition-all ${
              category === cat.id ? 'bg-[#00A86B]/20 border-[#00A86B]' : 'bg-white/5 border-white/10 grayscale hover:grayscale-0'
            }`}
          >
            <div className={`p-4 rounded-2xl ${cat.color} bg-opacity-20`}>{cat.icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest text-center">{cat.label}</span>
          </button>
        ))}
      </div>
      {renderStepNotes(5)}
      <button onClick={prevStep} className="w-full py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest">Back</button>
    </motion.div>
  );
};
