import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Zap, Users, Map, Save, RotateCcw, AlertCircle } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface MatrixWeight {
  id: string;
  label: string;
  value: number;
  icon: any;
  description: string;
}

const INITIAL_WEIGHTS: MatrixWeight[] = [
  { id: 'grid_stability', label: 'Grid Stability', value: 40, icon: Zap, description: 'Weight given to total power outage vs partial' },
  { id: 'critical_service', label: 'Critical Facility', value: 85, icon: ShieldAlert, description: 'Priority multiplier for Doctors/Clinics' },
  { id: 'village_size', label: 'Population Density', value: 25, icon: Users, description: 'Impact score based on affected households' },
  { id: 'remote_access', label: 'Village Remoteness', value: 15, icon: Map, description: 'Distance-based urgency factor' },
];

export const ThresholdEngine: React.FC = () => {
  const [weights, setWeights] = useState(INITIAL_WEIGHTS);
  const [hasChanges, setHasChanges] = useState(false);

  const handleWeightChange = (id: string, newValue: number) => {
    setWeights(weights.map(w => w.id === id ? { ...w, value: newValue } : w));
    setHasChanges(true);
  };

  const handleSave = () => {
    alert('System Thresholds Updated via Enterprise Ledger');
    setHasChanges(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Threshold Engine</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Configure Sentinel Impact Matrix Weights</p>
        </div>
        <div className="flex gap-4">
          <button 
            disabled={!hasChanges}
            onClick={() => { setWeights(INITIAL_WEIGHTS); setHasChanges(false); }}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 disabled:opacity-50 transition-all text-gray-400"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Defaults
          </button>
          <button 
            disabled={!hasChanges}
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-[#00A86B] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00D084] disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(0,168,107,0.3)]"
          >
            <Save className="w-3 h-3" />
            Commit Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {weights.map((weight) => {
          const Icon = weight.icon;
          return (
            <GlassCard key={weight.id} className="p-6 border-white/5 hover:border-[#00A86B]/30 transition-all group">
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 group-hover:bg-[#00A86B]/10 transition-colors">
                  <Icon className="w-6 h-6 text-[#00A86B]" />
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">{weight.value}%</span>
                  <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em]">Current Weight</p>
                </div>
              </div>
              
              <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">{weight.label}</h3>
              <p className="text-[10px] text-gray-500 font-bold mb-6">{weight.description}</p>
              
              <div className="space-y-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={weight.value}
                  onChange={(e) => handleWeightChange(weight.id, parseInt(e.target.value))}
                  className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-[#00A86B]"
                />
                <div className="flex justify-between text-[8px] font-black text-gray-700 uppercase tracking-widest">
                  <span>Standard</span>
                  <span>Critical Priority</span>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
        <div>
          <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest mb-1">Warning: Impact on Logistics</h4>
          <p className="text-[10px] text-gray-500 font-bold leading-relaxed">
            Changing these values will instantly re-calculate the <strong className="text-gray-400 tracking-normal">Priority Score</strong> for all 4,200+ open tickets across the Southern Rift Valley. Dispatches may be automatically re-allocated.
          </p>
        </div>
      </div>
    </div>
  );
};
