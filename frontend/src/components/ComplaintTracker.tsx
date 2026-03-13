import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Activity,
  MapPin,
  Zap,
  Phone,
  Calendar,
  ChevronRight,
  MessageSquare,
  Battery
} from 'lucide-react';
import { ComplaintReport } from '../types';
import { GlassCard } from './GlassCard';
import { useLanguage } from '../contexts/LanguageContext';

interface ComplaintTrackerProps {
  onBack: () => void;
}

// Mock data for tracking
const MOCK_REPORTS: ComplaintReport[] = [
  {
    id: 'VRF-20342',
    userId: 'USR-777',
    villageId: 'VIL-OMO',
    profile: {
      fullName: 'Dhanush A.',
      age: 28,
      gender: 'Male',
      phone: '+91 9876543210',
      village: 'Omo Valley',
      district: 'Turkana',
      state: 'Kenya',
      familyMembers: 4
    },
    solarSystem: {
      numPanels: 2,
      panelCapacity: '250W',
      batteryType: 'Gel',
      batteryCapacity: '150Ah',
      inverterModel: 'Growatt 5kVA',
      installationYear: 2022
    },
    category: 'NO_POWER',
    severity: 'CRITICAL',
    startTime: '2 hours ago',
    frequency: 'First time',
    description: 'Complete blackout in the house. Inverter showing red light.',
    appliances: ['Lights', 'Fans'],
    gps: { lat: 4.5, lng: 36.0 },
    media: { photoUrls: [] },
    status: 'RECEIVED',
    createdAt: Date.now() - 7200000 // 2 hours ago
  },
  {
    id: 'VRF-19821',
    userId: 'USR-777',
    villageId: 'VIL-OMO',
    profile: {
      fullName: 'Dhanush A.',
      age: 28,
      gender: 'Male',
      phone: '+91 9876543210',
      village: 'Omo Valley',
      district: 'Turkana',
      state: 'Kenya',
      familyMembers: 4
    },
    solarSystem: {
      numPanels: 2,
      panelCapacity: '250W',
      batteryType: 'Gel',
      batteryCapacity: '150Ah',
      inverterModel: 'Growatt 5kVA',
      installationYear: 2022
    },
    category: 'BATTERY_ISSUE',
    severity: 'MEDIUM',
    startTime: '3 days ago',
    frequency: 'Intermittent',
    description: 'Battery drains very quickly at night.',
    appliances: ['Lights', 'Fans', 'TV'],
    gps: { lat: 4.5, lng: 36.0 },
    media: { photoUrls: [] },
    status: 'IN_PROGRESS',
    createdAt: Date.now() - 259200000 // 3 days ago
  }
];

export const ComplaintTracker: React.FC<ComplaintTrackerProps> = ({ onBack }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filteredReports = useMemo(() => {
    return MOCK_REPORTS.filter(r => 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedReport = useMemo(() => {
    return MOCK_REPORTS.find(r => r.id === selectedId);
  }, [selectedId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RECEIVED': return 'text-blue-400';
      case 'UNDER_REVIEW': return 'text-amber-400';
      case 'TECHNICIAN_ASSIGNED': return 'text-purple-400';
      case 'IN_PROGRESS': return 'text-orange-400';
      case 'RESOLVED': return 'text-emerald-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'RECEIVED': return '20%';
      case 'UNDER_REVIEW': return '40%';
      case 'TECHNICIAN_ASSIGNED': return '60%';
      case 'IN_PROGRESS': return '80%';
      case 'RESOLVED': return '100%';
      default: return '0%';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans">
      {/* Header */}
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={selectedId ? () => setSelectedId(null) : onBack}
            className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase">
              {selectedId ? t('ticketDetails') : t('trackComplaints')}
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              {selectedId ? `ID: ${selectedId}` : t('trackReports')}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-8">
        <AnimatePresence mode="wait">
          {!selectedId ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#00A86B] transition-colors" />
                <input 
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-sm focus:border-[#00A86B]/50 outline-none transition-all"
                />
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredReports.map(report => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedId(report.id)}
                    className="w-full text-left group"
                  >
                    <GlassCard className="p-6 border-white/5 group-hover:border-[#00A86B]/30 transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-[#00A86B]/10 rounded-xl">
                            <Zap className="w-6 h-6 text-[#00A86B]" />
                          </div>
                          <div>
                            <h3 className="font-black uppercase tracking-tight">{report.category.replace('_', ' ')}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{report.id}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase bg-white/5 ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ')}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {new Date(report.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3" />
                          {report.profile.village}
                        </div>
                      </div>

                      <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: getStatusProgress(report.status) }}
                          className="h-full bg-[#00A86B]"
                        />
                      </div>
                    </GlassCard>
                  </button>
                ))}

                {filteredReports.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">{t('noReports')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Status Banner */}
              <GlassCard className="p-8 text-center space-y-4 border-[#00A86B]/20 bg-gradient-to-b from-[#00A86B]/5 to-transparent">
                <div className="w-16 h-16 bg-[#00A86B]/20 rounded-full mx-auto flex items-center justify-center">
                  <Activity className="w-8 h-8 text-[#00A86B]" />
                </div>
                <div>
                  <h2 className={`text-2xl font-black uppercase tracking-tighter ${getStatusColor(selectedReport!.status)}`}>
                    {selectedReport!.status.replace('_', ' ')}
                  </h2>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">{t('statusUpdated')}: 12 mins ago</p>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden max-w-xs mx-auto">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: getStatusProgress(selectedReport!.status) }}
                    className="h-full bg-[#00A86B]"
                  />
                </div>
              </GlassCard>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-6">
                <section className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">{t('issueSummary')}</h3>
                  <GlassCard className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-red-500/10 rounded-2xl">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div>
                        <p className="text-lg font-black uppercase">{selectedReport!.category.replace('_', ' ')}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Severity: {selectedReport!.severity}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {selectedReport!.description}
                    </p>
                  </GlassCard>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">{t('hardwareContext')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="p-4">
                      <Zap className="w-5 h-5 text-amber-500 mb-2" />
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Inverter</p>
                      <p className="text-xs font-black uppercase">{selectedReport!.solarSystem.inverterModel}</p>
                    </GlassCard>
                    <GlassCard className="p-4">
                      <Battery className="w-5 h-5 text-blue-500 mb-2" />
                      <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Battery</p>
                      <p className="text-xs font-black uppercase">{selectedReport!.solarSystem.batteryCapacity}</p>
                    </GlassCard>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">{t('timeline')}</h3>
                  <div className="space-y-4 relative before:absolute before:left-6 before:top-0 before:bottom-0 before:w-px before:bg-white/5">
                    {[
                      { label: 'Report Received', time: '10:30 AM', desc: 'System logged the fault and notified technicians.', done: true },
                      { label: 'Under Review', time: '10:45 AM', desc: 'AI Sentinel analyzing hardware telemetry.', done: true },
                      { label: 'Technician Assigned', time: '11:15 AM', desc: 'John Doe (Senior Engineer) dispatched.', done: false },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-6 items-start relative">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          item.done ? 'bg-[#00A86B] text-white' : 'bg-white/5 text-gray-600 border border-white/10'
                        }`}>
                          {item.done ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>
                        <div className="pt-2">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-black uppercase text-xs tracking-tight">{item.label}</p>
                            <span className="text-[8px] text-gray-600 font-bold">{item.time}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Action */}
              <button className="w-full py-6 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
                <MessageSquare className="w-5 h-5 text-[#00A86B]" /> {t('contactSupport')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      {!selectedId && (
        <footer className="p-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Need help? Call Toll Free: 1800-SOLAR-HELP</p>
        </footer>
      )}
    </div>
  );
};
