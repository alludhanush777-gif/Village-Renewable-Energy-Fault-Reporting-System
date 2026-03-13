import React from 'react';
import { motion } from 'motion/react';
import { Activity, ArrowRight } from 'lucide-react';
import { SeverityLevel } from '../../types';

interface IssueDetailsStepProps {
  severity: SeverityLevel;
  setSeverity: (severity: SeverityLevel) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  frequency: string;
  setFrequency: (freq: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  renderStepNotes: (stepNum: number) => React.ReactNode;
}

export const IssueDetailsStep: React.FC<IssueDetailsStepProps> = ({ 
  severity, setSeverity,
  startTime, setStartTime,
  frequency, setFrequency,
  description, setDescription,
  nextStep, prevStep,
  renderStepNotes 
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <Activity className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Issue Details</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 6 of 8</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Severity</label>
          <div className="grid grid-cols-3 gap-2">
            {(['MINOR', 'MEDIUM', 'CRITICAL'] as SeverityLevel[]).map(s => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  severity === s ? 'bg-red-500 border-red-500 text-white' : 'bg-white/5 border-white/10 text-gray-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Started When?</label>
            <input 
              type="text" value={startTime}
              onChange={e => setStartTime(e.target.value)}
              placeholder="e.g. 2 days ago"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Frequency</label>
            <input 
              type="text" value={frequency}
              onChange={e => setFrequency(e.target.value)}
              placeholder="e.g. Every night"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-2">Description</label>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-4 px-6 text-sm focus:border-[#00A86B]/50 outline-none min-h-[120px] resize-none"
            placeholder="Describe the problem in your own words..."
          />
        </div>
      </div>
      {renderStepNotes(6)}
      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest">Back</button>
        <button onClick={nextStep} className="flex-[2] py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
          Next <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
