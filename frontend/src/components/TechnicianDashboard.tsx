import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  MapPin, 
  Battery, 
  Zap, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Package,
  Activity,
  UserCheck,
  UserX
} from 'lucide-react';
import { GlassCard } from './GlassCard';

// Dummy Data
const TECHNICIANS = [
  { id: 'T1', name: 'Naveena Sandhi', status: 'On-Duty', load: 2, score: 98, location: 'Omo Valley', kit: ['10A Fuse', '2x Inverter Board'] },
  { id: 'T2', name: 'Jyothsna Devi', status: 'On-Duty', load: 5, score: 94, location: 'Maji Moto', kit: ['5x 10A Fuse', '1x Battery Cell'] },
  { id: 'T3', name: 'Dhanush Allu', status: 'Off-Duty', load: 0, score: 99, location: 'Sentinel HQ', kit: ['Full Master Kit'] },
];

export const TechnicianDashboard: React.FC = () => {
  const [techs, setTechs] = useState(TECHNICIANS);

  const toggleStatus = (id: string) => {
    setTechs(techs.map(t => 
      t.id === id ? { ...t, status: t.status === 'On-Duty' ? 'Off-Duty' : 'On-Duty' } : t
    ));
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Technician Fleet</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00A86B]" />
            Real-time Fleet Status & Workload Metrics
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white/5 border border-white/5 px-6 py-3 rounded-2xl">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Active Now</p>
            <p className="text-xl font-black text-white">{techs.filter(t => t.status === 'On-Duty').length} / {techs.length}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Fleet List */}
        <div className="lg:col-span-2 space-y-6">
          {techs.map((tech) => (
            <GlassCard key={tech.id} className="p-6 border-white/5 hover:border-white/10 transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#111] border border-white/10 rounded-2xl flex items-center justify-center font-black text-xl text-[#00A86B]">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#0A0A0A] ${tech.status === 'On-Duty' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white tracking-tight">{tech.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {tech.location}
                      </p>
                      <p className="text-[10px] text-[#00A86B] font-black uppercase tracking-widest flex items-center gap-1">
                        <Zap className="w-3 h-3" /> {tech.score} Trust Score
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Workload</p>
                    <div className="flex gap-1 justify-end">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={`w-1.5 h-4 rounded-full ${i <= tech.load ? 'bg-amber-500' : 'bg-white/5'}`} />
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => toggleStatus(tech.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      tech.status === 'On-Duty' 
                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                    }`}
                  >
                    {tech.status === 'On-Duty' ? <UserX className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                    {tech.status === 'On-Duty' ? 'Go Off-Duty' : 'Go On-Duty'}
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Global Inventory Preview */}
        <div className="space-y-8">
          <GlassCard className="p-8 border-white/5 bg-[#00A86B]/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
              <Package className="w-5 h-5 text-[#00A86B]" />
              Mobile Inventory
            </h3>
            <div className="space-y-4">
              {[
                { label: '10A Fuses', count: 42, threshold: 10 },
                { label: 'Inverter Boards', count: 8, threshold: 12 },
                { label: 'Battery Cells', count: 156, threshold: 50 },
                { label: 'Wiring Kits', count: 12, threshold: 15 },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{item.label}</p>
                    {item.count < item.threshold && (
                      <p className="text-[8px] text-red-500 font-black uppercase tracking-tighter flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-2 h-2" /> Critical Stock
                      </p>
                    )}
                  </div>
                  <span className={`text-sm font-black ${item.count < item.threshold ? 'text-red-500' : 'text-[#00A86B]'}`}>{item.count}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Request Warehouse Audit
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
