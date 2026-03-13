import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AudioRecord = ({ onCapture, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        chunksRef.current = [];
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Microphone Access Denied:', err);
      alert('Microphone access denied. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const reset = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const confirm = () => {
    // In a real app, we'd upload the blob and send the URL
    // For now, we'll pass the URL or base64
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      onCapture(reader.result);
      onClose();
    };
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-6 backdrop-blur-xl">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white">
        <X className="w-8 h-8" />
      </button>

      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-[2.5rem] p-12 flex flex-col items-center shadow-2xl">
        <div className="mb-12 relative">
          <AnimatePresence>
            {isRecording && (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 bg-[#00A86B]/20 rounded-full"
              />
            )}
          </AnimatePresence>
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 scale-110' : 'bg-[#00A86B]'}`}>
            {isRecording ? <Square className="w-12 h-12 text-white fill-current" /> : <Mic className="w-12 h-12 text-white" />}
          </div>
        </div>

        <div className="text-center mb-12">
          <p className="text-4xl font-black text-white mb-2">{formatTime(recordingTime)}</p>
          <p className="text-[#00A86B] text-xs font-bold uppercase tracking-widest">
            {isRecording ? 'Recording Soundscape...' : audioBlob ? 'Voice Note Captured' : 'Hold Mic to Record'}
          </p>
        </div>

        <div className="w-full flex gap-4">
          {!audioBlob ? (
            <button 
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`w-full py-6 rounded-3xl font-black text-white transition-all ${isRecording ? 'bg-rose-600' : 'bg-[#00A86B] shadow-[0_0_30px_rgba(0,168,107,0.3)]'}`}
            >
              {isRecording ? 'RELEASE TO STOP' : 'HOLD TO RECORD'}
            </button>
          ) : (
            <div className="w-full space-y-4">
              <audio src={audioUrl} controls className="w-full h-12 rounded-xl" />
              <div className="flex gap-4">
                <button 
                  onClick={reset}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10"
                >
                  <Trash2 className="w-4 h-4" /> RETAKE
                </button>
                <button 
                  onClick={confirm}
                  className="flex-1 py-4 bg-[#00A86B] rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,168,107,0.2)]"
                >
                  <Check className="w-4 h-4" /> ATTACH
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-8 text-white/30 text-xs font-black uppercase tracking-[0.2em]">
        Sentinel Audio Intel
      </p>
    </div>
  );
};
