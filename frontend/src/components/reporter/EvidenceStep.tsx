import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Mic, ArrowRight, Upload, CheckCircle2 } from 'lucide-react';
import { CameraUpload } from '../CameraUpload';
import { AudioRecord } from '../AudioRecord';

interface EvidenceStepProps {
  photo: string | null;
  setPhoto: (photo: string | null) => void;
  audio: string | null;
  setAudio: (audio: string | null) => void;
  nextStep: () => void;
  prevStep: () => void;
  renderStepNotes: (stepNum: number) => React.ReactNode;
}

export const EvidenceStep: React.FC<EvidenceStepProps> = ({ 
  photo, setPhoto,
  audio, setAudio,
  nextStep, prevStep,
  renderStepNotes 
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="text-center mb-8">
        <Camera className="w-12 h-12 text-[#00A86B] mx-auto mb-2" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Evidence</h2>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Step 7 of 8</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Camera Capture */}
        <button 
          onClick={() => setShowCamera(true)}
          className={`h-40 border-2 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all ${
            photo ? 'bg-[#00A86B]/10 border-[#00A86B]' : 'bg-white/5 border-dashed border-white/10 hover:border-[#00A86B]'
          }`}
        >
          {photo ? (
            <>
              <CheckCircle2 className="w-10 h-10 text-[#00A86B]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00A86B]">Photo Captured</span>
            </>
          ) : (
            <>
              <Camera className="w-10 h-10 text-[#00A86B]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Take Photos of Problem</span>
            </>
          )}
        </button>

        {/* Audio Capture */}
        <button 
          onClick={() => setShowAudio(true)}
          className={`h-40 border-2 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 transition-all ${
            audio ? 'bg-amber-500/10 border-amber-500' : 'bg-white/5 border-dashed border-white/10 hover:border-amber-500'
          }`}
        >
          {audio ? (
            <>
              <CheckCircle2 className="w-10 h-10 text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Voice Note Attached</span>
            </>
          ) : (
            <>
              <Mic className="w-10 h-10 text-gray-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Record Voice Intel</span>
            </>
          )}
        </button>

        {/* Manual Upload Fallback */}
        <div className="mt-4">
          <label className="flex items-center justify-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Or Upload Image File</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {renderStepNotes(7)}

      <div className="flex gap-4">
        <button onClick={prevStep} className="flex-1 py-6 bg-white/5 rounded-2xl font-black uppercase tracking-widest">Back</button>
        <button 
          onClick={nextStep} 
          className="flex-[2] py-6 bg-[#00A86B] rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,168,107,0.3)]"
        >
          Review <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showCamera && (
          <CameraUpload 
            onCapture={setPhoto} 
            onClose={() => setShowCamera(false)} 
          />
        )}
        {showAudio && (
          <AudioRecord 
            onCapture={setAudio} 
            onClose={() => setShowAudio(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
