import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ChevronRight, ArrowRight, User, MapPin, Shield } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useToast } from './Toast';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

type AuthMode = 'signin' | 'signup';

interface AuthViewProps {
  onLogin: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const { showToast } = useToast();
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    village: '',
    role: 'Villager' as UserRole,
    countryCode: '+254'
  });

  const handleSmsHandshake = () => {
    const message = `REG|${formData.firstName}|${formData.lastName}|${formData.phone}|${formData.village}|${formData.role}|SMS_HANDSHAKE`;
    const smsUrl = `sms:+254700000000?body=${encodeURIComponent(message)}`;
    window.location.href = smsUrl;
  };

  const validateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'signin') {
        await login(formData.email, formData.password);
        showToast(`Welcome back, Commander!`, "success");
      } else {
        // Registration Logic
        await register({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          village: formData.village || 'Omo Valley',
          role: formData.role === 'Technician' ? 'TECHNICIAN' : formData.role === 'Admin' ? 'ADMIN' : 'REPORTER'
        });
        showToast("Sentinel Account Created Successfully!", "success");
      }
      onLogin();
    } catch (err: any) {
      showToast(err.message || "Authentication Breach Detected", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#00A86B]/10 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#00A86B]/5 blur-[140px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100, duration: 0.8 }}
        className="w-full max-w-[480px] z-10"
      >
        <GlassCard className="p-10 shadow-[0_32px_64px_rgba(0,0,0,0.5)] border-white/5 bg-white/[0.03]">
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="bg-[#00A86B] p-4 rounded-2xl shadow-[0_0_40px_rgba(0,168,107,0.4)] mb-4"
            >
              <Zap className="text-white w-8 h-8 fill-white" />
            </motion.div>
            <h2 className="text-white text-3xl font-black tracking-tighter uppercase">Sentinel Energy</h2>
          </div>

          <div className="relative flex p-1 bg-white/5 rounded-2xl mb-8 border border-white/5">
            <motion.div 
              className="absolute top-1 bottom-1 left-1 bg-white/[0.08] rounded-xl shadow-xl"
              initial={false}
              animate={{ 
                x: mode === 'signin' ? 0 : '100%',
                width: 'calc(50% - 4px)'
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button 
              onClick={() => setMode('signin')}
              className={`relative flex-1 py-3 text-sm font-bold transition-colors z-10 ${mode === 'signin' ? 'text-white' : 'text-gray-500'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`relative flex-1 py-3 text-sm font-bold transition-colors z-10 ${mode === 'signup' ? 'text-white' : 'text-gray-500'}`}
            >
              Sign Up
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'signup' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'signup' ? -20 : 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <form className="space-y-5" onSubmit={validateAndSubmit}>
                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B] transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B] transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    required
                    type="email" 
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="flex gap-2">
                    <select 
                      value={formData.countryCode}
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
                      className="bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white focus:outline-none focus:border-[#00A86B] transition-all cursor-pointer"
                    >
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+1">🇺🇸 +1</option>
                    </select>
                    <input 
                      required
                      type="tel" 
                      placeholder="700 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B] transition-all"
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Village</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                          required
                          type="text" 
                          placeholder="Omo Valley"
                          value={formData.village}
                          onChange={(e) => setFormData({...formData, village: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00A86B] transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Role</label>
                      <div className="relative">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <select 
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-white focus:outline-none focus:border-[#00A86B] transition-all cursor-pointer appearance-none"
                        >
                          <option value="Villager">Villager</option>
                          <option value="Technician">Technician</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                  <input 
                    required
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00A86B] focus:ring-1 focus:ring-[#00A86B] transition-all"
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: '#00C880' }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-[#00A86B] text-white py-4 rounded-2xl font-black text-lg shadow-[0_12px_24px_rgba(0,168,107,0.3)] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {mode === 'signin' ? 'Sign In' : 'Create an account'}
                </motion.button>
              </form>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 text-center">
            <button 
              onClick={handleSmsHandshake}
              className="group text-xs font-bold text-[#00A86B]/80 hover:text-[#00A86B] transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              Offline? <span className="underline decoration-2 underline-offset-4">Register via SMS Handshake</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
