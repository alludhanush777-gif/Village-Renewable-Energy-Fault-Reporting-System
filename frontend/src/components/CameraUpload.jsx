import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CameraUpload = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      console.error('Camera Access Denied:', err);
      setError('Camera access denied. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirm = () => {
    onCapture(capturedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-6">
      <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/50 hover:text-white">
        <X className="w-8 h-8" />
      </button>

      <div className="w-full max-w-md aspect-[3/4] bg-white/5 rounded-3xl overflow-hidden border border-white/10 relative">
        <AnimatePresence mode="wait">
          {!capturedImage ? (
            <motion.div 
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full relative"
            >
              {error ? (
                <div className="h-full w-full flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
                    <X className="w-10 h-10 text-rose-500" />
                  </div>
                  <p className="text-rose-500 font-bold mb-4">{error}</p>
                  <label className="bg-[#00A86B] px-6 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-[#00C88B] transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    CHOOSE FROM GALLERY
                  </label>
                </div>
              ) : (
                <>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                    <div className="h-full w-full border border-white/20 rounded-2xl" />
                  </div>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full w-full relative"
            >
              <img src={capturedImage} className="h-full w-full object-cover" alt="Captured" />
            </motion.div>
          )}
        </AnimatePresence>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="mt-8 flex items-center gap-6">
        {!capturedImage ? (
          <>
            <label className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/50 hover:text-white cursor-pointer transition-all">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              <Upload className="w-8 h-8" />
            </label>
            <button 
              onClick={capturePhoto}
              className="w-20 h-20 bg-white rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              <div className="w-16 h-16 border-4 border-black rounded-full" />
            </button>
            <button className="p-4 text-transparent pointer-events-none">
               <div className="w-8 h-8" />
            </button>
          </>
        ) : (
          <>
            <button 
              onClick={reset}
              className="p-5 bg-white/5 border border-white/10 rounded-3xl text-white hover:bg-white/10 transition-all"
            >
              <RefreshCw className="w-8 h-8" />
            </button>
            <button 
              onClick={confirm}
              className="p-8 bg-[#00A86B] rounded-3xl text-white shadow-[0_0_30px_rgba(0,168,107,0.4)] active:scale-95 transition-all"
            >
              <Check className="w-12 h-12 stroke-[4px]" />
            </button>
          </>
        )}
      </div>
      
      <p className="mt-8 text-white/30 text-xs font-black uppercase tracking-[0.2em]">
        Evidence Capture System
      </p>
    </div>
  );
};
