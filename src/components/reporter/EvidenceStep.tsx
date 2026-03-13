import React from 'react';
import { motion } from 'motion/react';
import { Camera, Mic, ArrowRight } from 'lucide-react';

interface EvidenceStepProps {
  isRecording: boolean;
  setIsRecording: (recording: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  renderStepNotes: (stepNum: number) => React.ReactNode;
}

export const EvidenceStep: React.FC<EvidenceStepProps> = ({ 
  isRecording, setIsRecording,
  nextStep, prevStep,
  renderStepNotes 
}) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <Camera className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Evidence</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 7 of 8</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <button className="h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 hover:border-[#00A86B] transition-all">
          <Camera className="w-10 h-10 text-[#00A86B]" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Take Photos of Problem</span>
        </button>
        <button 
          onMouseDown={() => setIsRecording(true)}
          onMouseUp={() => setIsRecording(false)}
          className={`h-40 border-2 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all ${
            isRecording ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-white/5 border-dashed border-white/10'
          }`}
        >
          <Mic className={`w-10 h-10 ${isRecording ? 'text-red-500' : 'text-gray-400'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
            {isRecording ? 'Recording...' : 'Hold to Record Voice'}
          </span>
        </button>
      </div>
      {renderStepNotes(7)}
      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest">Back</button>
        <button onClick={nextStep} className="flex-[2] py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
          Review <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
