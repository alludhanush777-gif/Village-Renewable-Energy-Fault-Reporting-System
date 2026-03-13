import React from 'react';
import { motion } from 'motion/react';
import { Home, ArrowRight } from 'lucide-react';
import { VillagerProfile } from '../../types';

interface HouseholdInfoStepProps {
  profile: VillagerProfile;
  setProfile: (profile: VillagerProfile) => void;
  appliances: string[];
  setAppliances: (appliances: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  renderStepNotes: (stepNum: number) => React.ReactNode;
}

const APPLIANCES = ['Lights', 'Fans', 'TV', 'Refrigerator', 'Water Pump', 'Heavy Appliances'];

export const HouseholdInfoStep: React.FC<HouseholdInfoStepProps> = ({ 
  profile, 
  setProfile, 
  appliances,
  setAppliances,
  nextStep, 
  prevStep,
  renderStepNotes 
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <Home className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Household Information</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 4 of 8</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Family Members</label>
          <input 
            type="number" value={profile.familyMembers || ''}
            onChange={e => setProfile({...profile, familyMembers: parseInt(e.target.value)})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Appliances Used</label>
          <div className="grid grid-cols-2 gap-3">
            {APPLIANCES.map(app => (
              <button
                key={app}
                onClick={() => {
                  const exists = appliances.includes(app);
                  setAppliances(exists ? appliances.filter(a => a !== app) : [...appliances, app]);
                }}
                className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  appliances.includes(app) ? 'bg-[#00A86B] border-[#00A86B] text-white' : 'bg-white/5 border-white/10 text-gray-500'
                }`}
              >
                {app}
              </button>
            ))}
          </div>
        </div>
      </div>
      {renderStepNotes(4)}
      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest">Back</button>
        <button onClick={nextStep} className="flex-[2] py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
          Next <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
