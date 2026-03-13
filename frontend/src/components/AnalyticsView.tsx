import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Clock, 
  Users, 
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { GlassCard } from './GlassCard';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#111',
      titleColor: '#00A86B',
      bodyColor: '#fff',
      padding: 12,
      cornerRadius: 12,
      displayColors: false,
    },
  },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { color: '#444', font: { size: 10, weight: 'bold' as const } } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false }, ticks: { color: '#444', font: { size: 10, weight: 'bold' as const } } },
  },
};

const LINE_DATA = {
  labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'],
  datasets: [{
    label: 'Grid Uptime %',
    data: [94, 96, 95, 98, 97, 99],
    fill: true,
    borderColor: '#00A86B',
    backgroundColor: 'rgba(0,168,107,0.1)',
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: '#00A86B',
  }],
};

const BAR_DATA = {
  labels: ['Maji Moto', 'Omo Valley', 'Turkana', 'Lamu', 'Marsabit'],
  datasets: [{
    label: 'Carbon Offset (Tons)',
    data: [42, 38, 55, 30, 48],
    backgroundColor: '#00A86B',
    borderRadius: 8,
  }],
};

export const AnalyticsView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Sentinel Analytics</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#00A86B]" />
            Enterprise NGO & Stakeholder Impact Reporting
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Calendar className="w-4 h-4" /> Last 6 Months
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#00A86B] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00D084] transition-all shadow-[0_0_20px_rgba(0,168,107,0.3)]">
            <Download className="w-4 h-4" /> Monthly PDF Report
          </button>
        </div>
      </header>

      {/* KPI Ribbons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Uptime', value: '97.2%', change: '+1.4%', up: true, icon: TrendingUp },
          { label: 'Carbon Saved', value: '1,240T', change: '+240T', up: true, icon: Leaf },
          { label: 'Avg. Repair Time', value: '4.2h', change: '-1.1h', up: true, icon: Clock },
          { label: 'Villages Served', value: '42', change: '+3', up: true, icon: Users },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <GlassCard key={kpi.label} className="p-6 border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <Icon className="w-5 h-5 text-[#00A86B]" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${kpi.up ? 'text-emerald-500' : 'text-red-500'}`}>
                  {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-2xl font-black text-white">{kpi.value}</p>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <GlassCard className="p-8 border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Network Stability Trend</h3>
            <span className="text-[10px] font-black text-[#00A86B] uppercase tracking-widest">Enterprise Performance</span>
          </div>
          <div className="h-[300px]">
            <Line data={LINE_DATA} options={CHART_OPTIONS} />
          </div>
        </GlassCard>

        {/* Bar Chart */}
        <GlassCard className="p-8 border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Village Carbon Offset</h3>
            <span className="text-[10px] font-black text-[#00A86B] uppercase tracking-widest">Top 5 Regions</span>
          </div>
          <div className="h-[300px]">
            <Bar data={BAR_DATA} options={CHART_OPTIONS} />
          </div>
        </GlassCard>
      </div>

      {/* Village Reliability Leaderboard */}
      <GlassCard className="p-8 border-white/5 bg-[#00A86B]/5">
        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8">Reliability Leaderboard</h3>
        <div className="space-y-4">
          {[
             { name: 'Maji Moto', reliability: 99.8, tickets: 1, tech: 'Naveena S.' },
             { name: 'Turkana Hub', reliability: 98.2, tickets: 4, tech: 'Dhanush A.' },
             { name: 'Lamu Grid', reliability: 97.5, tickets: 2, tech: 'Jyothsna D.' },
          ].map((v, i) => (
            <div key={v.name} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-[#00A86B]/30 transition-all">
              <div className="flex items-center gap-6">
                <span className="text-lg font-black text-white/20 group-hover:text-[#00A86B] transition-colors">0{i+1}</span>
                <div>
                  <p className="text-sm font-black text-white">{v.name}</p>
                  <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Primary Technician: {v.tech}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-[#00A86B]">{v.reliability}%</p>
                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{v.tickets} Active Issues</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
