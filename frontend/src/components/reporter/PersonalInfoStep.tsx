import React from 'react';
import { motion } from 'motion/react';
import { User, ArrowRight } from 'lucide-react';
import { VillagerProfile } from '../../types';

interface PersonalInfoStepProps {
  profile: VillagerProfile;
  setProfile: (profile: VillagerProfile) => void;
  nextStep: () => void;
  renderStepNotes: (stepNum: number) => React.ReactNode;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ 
  profile, 
  setProfile, 
  nextStep, 
  renderStepNotes 
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Personal Information</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 1 of 8</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Full Name</label>
          <input 
            type="text" 
            value={profile.fullName}
            onChange={e => setProfile({...profile, fullName: e.target.value})}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
            placeholder="Enter your name"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Age</label>
            <input 
              type="number" 
              value={profile.age || ''}
              onChange={e => setProfile({...profile, age: parseInt(e.target.value)})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Gender</label>
            <select 
              value={profile.gender}
              onChange={e => setProfile({...profile, gender: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Phone</label>
            <input 
              type="tel" 
              value={profile.phone}
              onChange={e => setProfile({...profile, phone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Alt Phone</label>
            <input 
              type="tel" 
              value={profile.altPhone}
              onChange={e => setProfile({...profile, altPhone: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
            />
          </div>
        </div>
      </div>
      {renderStepNotes(1)}
      <button onClick={nextStep} className="w-full py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
        Next <ArrowRight className="w-5 h-5" />
      </button>
    </motion.div>
  );
};
