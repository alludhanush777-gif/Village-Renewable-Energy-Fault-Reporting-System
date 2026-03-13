import React from 'react';
import { motion } from 'motion/react';
import { ThresholdEngine } from './ThresholdEngine';
import { useLanguage } from '../contexts/LanguageContext';
import { Moon, Sun, Globe, ShieldCheck } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsView: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">System Control</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
            Enterprise Configuration Node: SR-224
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Localization & Appearance */}
        <div className="space-y-8">
          <GlassCard className="p-6 border-white/5 h-fit">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#00A86B]" />
              System Localization
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'EN', label: 'English (US)', flag: '🇺🇸' },
                { id: 'TE', label: 'Telugu (తెలుగు)', flag: '🇮🇳' },
                { id: 'HI', label: 'Hindi (हिन्दी)', flag: '🇮🇳' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    language === lang.id 
                      ? 'bg-[#00A86B]/10 border-[#00A86B] text-white' 
                      : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-xs font-bold">{lang.label}</span>
                  </div>
                  {language === lang.id && <div className="w-2 h-2 bg-[#00A86B] rounded-full shadow-[0_0_10px_#00A86B]" />}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 h-fit">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <Sun className="w-5 h-5 text-[#00A86B]" />
              Interface Theme
            </h3>
            <div className="flex bg-[var(--sentinel-glass)] p-2 rounded-2xl border border-[var(--sentinel-border)]">
              <button 
                onClick={() => theme === 'light' && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  theme === 'dark' 
                    ? 'bg-[#111] border border-white/10 text-[#00A86B]' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                Sentinel Dark
              </button>
              <button 
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  theme === 'light' 
                    ? 'bg-white border border-black/5 text-[#00A86B] shadow-sm' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light Mode
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Threshold Engine - Spans 2 cols */}
        <div className="lg:col-span-2">
          <ThresholdEngine />
        </div>
      </div>
    </div>
  );
};
