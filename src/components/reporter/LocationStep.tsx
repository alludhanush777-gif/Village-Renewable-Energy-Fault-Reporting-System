import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { VillagerProfile } from '../../types';

interface LocationStepProps {
  profile: VillagerProfile;
  setProfile: (profile: VillagerProfile) => void;
  nextStep: () => void;
  prevStep: () => void;
  renderStepNotes: (stepNum: number) => React.ReactNode;
}

export const LocationStep: React.FC<LocationStepProps> = ({ 
  profile, 
  setProfile, 
  nextStep, 
  prevStep,
  renderStepNotes 
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <MapPin className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Location Details</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 2 of 8</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <input 
          type="text" placeholder="Village Name" value={profile.village}
          onChange={e => setProfile({...profile, village: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
        />
        <div className="grid grid-cols-2 gap-4">
          <input 
            type="text" placeholder="District" value={profile.district}
            onChange={e => setProfile({...profile, district: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
          />
          <input 
            type="text" placeholder="State" value={profile.state}
            onChange={e => setProfile({...profile, state: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
          />
        </div>
        <input 
          type="text" placeholder="Landmark / House Number" value={profile.landmark}
          onChange={e => setProfile({...profile, landmark: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
        />
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
          <Navigation className="w-5 h-5 text-emerald-500" />
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">GPS Location Captured Automatically</p>
        </div>
      </div>
      {renderStepNotes(2)}
      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest">Back</button>
        <button onClick={nextStep} className="flex-[2] py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
          Next <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
