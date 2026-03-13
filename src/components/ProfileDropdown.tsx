import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  MapPin, 
  Phone, 
  Mail, 
  Trophy, 
  ChevronRight,
  Leaf,
  Wrench,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { GlassCard } from './GlassCard';
import { UserRole } from '../types';

export const ProfileDropdown: React.FC = () => {
  const { user, logout, isOffline } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Villager': return <Leaf className="w-3 h-3 text-emerald-400" />;
      case 'Technician': return <Wrench className="w-3 h-3 text-blue-400" />;
      case 'Admin': return <Zap className="w-3 h-3 text-amber-400" />;
      default: return <User className="w-3 h-3 text-gray-400" />;
    }
  };

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
  };

  return (
    <div className="relative">
      {/* Avatar Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative group"
      >
        <div className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
          isOffline ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-[#00A86B]/50 shadow-[0_0_15px_rgba(0,168,107,0.3)]'
        } group-hover:scale-105`}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#00A86B] to-[#005a39] flex items-center justify-center font-black text-xs">
              {getInitials(user.fullName)}
            </div>
          )}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#0A0A0A] ${
          isOffline ? 'bg-amber-500' : 'bg-emerald-500'
        }`} />
      </button>

      {/* Identity Card (Glassmorphic Slide-out) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="absolute right-0 mt-4 w-80 z-[70]"
            >
              <GlassCard className="overflow-hidden border-white/10 shadow-2xl">
                {/* Header */}
                <div className="p-6 bg-gradient-to-br from-white/5 to-transparent border-b border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00A86B] to-[#005a39] flex items-center justify-center font-black text-xl shadow-lg">
                      {getInitials(user.fullName)}
                    </div>
                    <div>
                      <h3 className="font-black text-lg tracking-tight">{user.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="p-1 bg-white/5 rounded-md">
                          {getRoleIcon(user.role)}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{user.role}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trust Score Meter */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Sentinel Trust Score</span>
                      <span className="text-xs font-black text-[#00A86B]">{user.trustScore}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${user.trustScore}%` }}
                        className="h-full bg-gradient-to-r from-[#00A86B] to-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Sections */}
                <div className="p-2">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-gray-400">
                      <Phone className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{maskPhone(user.phone)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-[#00A86B]" />
                      <span className="text-xs font-bold">{user.village}, {user.district}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/5 mx-4" />

                  {/* Credits / Stats */}
                  <div className="p-4 grid grid-cols-2 gap-2">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Credits</p>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-amber-400" />
                        <span className="text-sm font-black">{user.credits}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <p className="text-[8px] font-black text-gray-500 uppercase mb-1">Rank</p>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-3 h-3 text-emerald-400" />
                        <span className="text-sm font-black">Elite</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2 space-y-1">
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4 text-gray-500 group-hover:text-[#00A86B]" />
                        <span className="text-xs font-bold">Security Settings</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-700" />
                    </button>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 transition-colors group text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-xs font-bold">Sign Out</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
