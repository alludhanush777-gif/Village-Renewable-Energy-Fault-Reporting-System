import React from 'react';
import { Clock, MapPin, MessageSquare, ChevronRight, ShieldCheck, AlertTriangle, Activity } from 'lucide-react';
import { motion } from 'motion/react';
import { FaultTicket } from '../types';

interface PriorityCardProps {
  ticket: FaultTicket;
  onClick: (ticket: FaultTicket) => void;
}

export const PriorityCard: React.FC<PriorityCardProps> = ({ ticket, onClick }) => {
  const getStatusColor = (type: string) => {
    switch (type) {
      case 'GRID FAILURE': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'PREDICTIVE ALERT': return 'text-purple-500 bg-purple-500/10 border-purple-500/20';
      case 'LOCALIZED ISSUE': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
    if (score >= 5) return 'border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]';
    return 'border-emerald-500 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' }}
      onClick={() => onClick(ticket)}
      className="group relative bg-white/5 border border-white/5 rounded-2xl p-5 cursor-pointer transition-all hover:border-white/10"
    >
      <div className="flex items-start gap-5">
        {/* Prio Badge */}
        <div className={cn(
          "flex-shrink-0 w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center bg-[#0A0A0A] transition-transform group-hover:scale-110",
          getScoreColor(ticket.priorityScore)
        )}>
          <span className="text-lg font-black leading-none">{ticket.priorityScore}</span>
          <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">Prio</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <motion.h3 
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-base font-bold text-white truncate group-hover:text-[#00A86B] transition-colors"
            >
              {ticket.village}
            </motion.h3>
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border animate-pulse",
              getStatusColor(ticket.type)
            )}>
              {ticket.type}
            </span>
          </div>

          <div className="flex items-center gap-4 text-gray-500 mb-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{ticket.distanceKm} km away</span>
            </div>
            {ticket.velocity && (
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{ticket.velocity} km/h</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{ticket.reports} reports</span>
            </div>
            {ticket.sensorVerified && (
              <div className="flex items-center gap-1.5 text-emerald-500">
                <ShieldCheck className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Sensor Verified</span>
              </div>
            )}
          </div>

          {/* Impact Tags */}
          {ticket.impactTags && ticket.impactTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {ticket.impactTags.map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[8px] font-black text-gray-400 uppercase tracking-widest">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-gray-600" />
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{ticket.timestamp}</span>
            </div>
            <div className="flex items-center gap-1 text-[#00A86B] opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black uppercase tracking-widest">Dispatch</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
