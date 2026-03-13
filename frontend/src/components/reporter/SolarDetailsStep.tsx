import React from 'react';
import { motion } from 'motion/react';
import { Sun, ArrowRight } from 'lucide-react';
import { SolarSystemDetails } from '../../types';

interface SolarDetailsStepProps {
  solar: SolarSystemDetails;
  setSolar: (solar: SolarSystemDetails) => void;
  nextStep: () => void;
  prevStep: () => void;
  renderStepNotes: (stepNum: number) => React.ReactNode;
}

export const SolarDetailsStep: React.FC<SolarDetailsStepProps> = ({ 
  solar, 
  setSolar, 
  nextStep, 
  prevStep,
  renderStepNotes 
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <Sun className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Solar System Details</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 3 of 8</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="number" placeholder="No. of Panels" value={solar.numPanels || ''}
            onChange={e => setSolar({...solar, numPanels: parseInt(e.target.value)})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
          />
          <input 
            type="text" placeholder="Panel Capacity (e.g. 250W)" value={solar.panelCapacity}
            onChange={e => setSolar({...solar, panelCapacity: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" placeholder="Battery Type" value={solar.batteryType}
            onChange={e => setSolar({...solar, batteryType: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
          />
          <input 
            type="text" placeholder="Battery Capacity" value={solar.batteryCapacity}
            onChange={e => setSolar({...solar, batteryCapacity: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
          />
        </div>
        <input 
          type="text" placeholder="Inverter Model" value={solar.inverterModel}
          onChange={e => setSolar({...solar, inverterModel: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
        />
        <input 
          type="number" placeholder="Installation Year" value={solar.installationYear || ''}
          onChange={e => setSolar({...solar, installationYear: parseInt(e.target.value)})}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
        />
      </div>
      {renderStepNotes(3)}
      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest">Back</button>
        <button onClick={nextStep} className="flex-[2] py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
          Next <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
