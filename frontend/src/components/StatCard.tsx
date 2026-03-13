import React from 'react';
import { GlassCard } from './GlassCard';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, label, value, sub }) => {
  return (
    <GlassCard className="p-6 group hover:border-[#00A86B]/30 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Real-time</span>
      </div>
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-white">{value}</h3>
      <p className="text-[10px] font-bold text-emerald-500 mt-1">{sub}</p>
    </GlassCard>
  );
};

export const ToolBadge: React.FC<{ name: string }> = ({ name }) => {
  return (
    <span className="px-4 py-2 bg-white/5 text-gray-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-[#00A86B]/50 transition-colors">
      {name}
    </span>
  );
};
