import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  Wrench, 
  Package, 
  Navigation, 
  Phone, 
  ShieldCheck, 
  AlertTriangle,
  Activity,
  Battery,
  Users
} from 'lucide-react';
import { FaultTicket } from '../types';

interface PreDiagnosisPanelProps {
  ticket: FaultTicket | null;
  onClose: () => void;
  onDispatch: (ticket: FaultTicket) => void;
}

export const PreDiagnosisPanel: React.FC<PreDiagnosisPanelProps> = ({ ticket, onClose, onDispatch }) => {
  if (!ticket) return null;

  const getRecommendedKit = (type: string) => {
    switch (type) {
      case 'GRID FAILURE': return ['Industrial Multimeter', 'MC4 Connector Kit', 'Heavy Duty Inverter', 'Safety Harness'];
      case 'PREDICTIVE ALERT': return ['Battery Cell Tester', 'Thermal Camera', 'Replacement LiFePO4 Cell', 'Firmware Flash Tool'];
      case 'LOCALIZED ISSUE': return ['Digital Multimeter', 'Residential Wiring Kit', 'Smart Meter Replacement', 'Voltage Tester'];
      default: return ['Standard Maintenance Kit'];
    }
  };

  return (
    <AnimatePresence>
      {ticket && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0D0D0D] border-l border-white/10 z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#00A86B]/10 p-2 rounded-xl">
                  <Wrench className="w-5 h-5 text-[#00A86B]" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">Pre-Diagnosis</h2>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Ticket #{ticket.id.split('-')[1]}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Impact Summary */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Impact Summary</h3>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <Users className="w-4 h-4 text-blue-500 mb-2" />
                    <p className="text-xl font-black text-white">{ticket.affectedPopulation}</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">People Affected</p>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <Activity className="w-4 h-4 text-red-500 mb-2" />
                    <p className="text-xl font-black text-white">{ticket.priorityScore}</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Impact Score</p>
                  </div>
                </div>
              </section>

              {/* Contextual IQ */}
              {ticket.impactTags && ticket.impactTags.length > 0 && (
                <section className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Contextual IQ</h3>
                  <div className="flex flex-wrap gap-2">
                    {ticket.impactTags.map(tag => (
                      <div key={tag} className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-3 py-2">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{tag}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Technical Diagnosis */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Technical Diagnosis</h3>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-red-500/10 p-2 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white mb-1">Grid Anomaly Detected</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">IoT sensors at {ticket.gridId} reported a 45% voltage drop. Correlation with {ticket.reports} user reports confirms a localized phase failure.</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-emerald-500" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Backup Status</span>
                    </div>
                    <span className="text-[10px] font-black text-white uppercase">64% Capacity</span>
                  </div>
                </div>
              </section>

              {/* Recommended Kit */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Recommended Kit</h3>
                <div className="grid grid-cols-1 gap-2">
                  {getRecommendedKit(ticket.type).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                      <Package className="w-4 h-4 text-[#00A86B]" />
                      <span className="text-[11px] font-bold text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/5 bg-[#0A0A0A]">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all border border-white/10">
                  <Phone className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Call Sentinel</span>
                </button>
                <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all border border-white/10">
                  <Navigation className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Route Map</span>
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: '#00C880' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDispatch(ticket)}
                className="w-full bg-[#00A86B] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_12px_24px_rgba(0,168,107,0.3)] transition-all flex items-center justify-center gap-3"
              >
                <Zap className="w-4 h-4 fill-white" />
                Dispatch Technician
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
