/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Battery, 
  MapPin, 
  MessageSquare, 
  Zap, 
  Clock, 
  Users,
  Wrench,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Phone,
  User,
  ArrowRight,
  Trophy,
  Activity,
  Filter,
  Search,
  Navigation,
  Package,
  Bot,
  Settings,
  ShieldAlert,
  Save,
  RotateCcw,
  Globe,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { GeospatialIntelligence } from './components/GeospatialIntelligence';
import { AIAssistant } from './components/AIAssistant';
import { SentinelReporter } from './components/SentinelReporter';
import { ComplaintTracker } from './components/ComplaintTracker';
import { PriorityFeed } from './components/PriorityFeed';
import { PreDiagnosisPanel } from './components/PreDiagnosisPanel';
import { FaultTicket } from './types';
import { socketService } from './services/socketService';
import { ToastProvider } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlassCard } from './components/GlassCard';
import { StatCard } from './components/StatCard';
import { AuthView } from './components/AuthView';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { ProfileDropdown } from './components/ProfileDropdown';
import { useNavigation } from './contexts/NavigationContext';
import { Sidebar } from './components/Sidebar';
import { GlobalSearch } from './components/GlobalSearch';
import { SettingsView } from './components/SettingsView';
import { TechnicianDashboard } from './components/TechnicianDashboard';
import { InventoryView } from './components/InventoryView';
import { AnalyticsView } from './components/AnalyticsView';

// --- Types ---
// ViewState type moved to NavigationContext
type AuthMode = 'signin' | 'signup';

// --- Mock Data ---
const INITIAL_TICKETS: FaultTicket[] = [
  {
    id: 'TKT-8842',
    village: 'Omo Valley',
    gridId: 'GRID-442',
    type: 'GRID FAILURE',
    priorityScore: 9.8,
    reports: 42,
    distanceKm: 12,
    velocity: 45,
    sensorStatus: 'Critical',
    timestamp: '12 MINS AGO',
    affectedPopulation: 450,
    sensorVerified: true,
    impactTags: ['Medical Clinic', 'Water Pump'],
    description: 'Total grid collapse detected by IoT sensors. Critical infrastructure offline.',
    coordinates: { lat: 4.5, lng: 36.0 }
  },
  {
    id: 'TKT-9120',
    village: 'Turkana North',
    gridId: 'GRID-109',
    type: 'PREDICTIVE ALERT',
    priorityScore: 7.4,
    reports: 8,
    distanceKm: 84,
    velocity: 60,
    sensorStatus: 'Warning',
    timestamp: '45 MINS AGO',
    affectedPopulation: 120,
    sensorVerified: false,
    impactTags: ['Primary School'],
    description: 'Early battery decay detected by ML model. Maintenance recommended.',
    coordinates: { lat: 3.5, lng: 35.5 }
  },
  {
    id: 'TKT-7721',
    village: 'Kajiado West',
    gridId: 'GRID-882',
    type: 'LOCALIZED ISSUE',
    priorityScore: 4.2,
    reports: 3,
    distanceKm: 22,
    velocity: 30,
    sensorStatus: 'Normal',
    timestamp: '1 HOUR AGO',
    affectedPopulation: 15,
    sensorVerified: true,
    description: 'Single house wiring fault reported. Minor impact.',
    coordinates: { lat: -1.5, lng: 36.5 }
  }
];

// --- Components ---

// --- Components ---

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
      {['EN', 'TE', 'HI'].map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${
            language === lang ? 'bg-[#00A86B] text-white shadow-lg' : 'text-gray-500 hover:text-white'
          }`}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}

interface ClickableStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  onClick?: () => void;
}

function ClickableStatCard({ icon, label, value, sub, onClick }: ClickableStatCardProps) {
  return (
    <button onClick={onClick} className="w-full text-left transition-transform hover:scale-[1.02] active:scale-[0.98]">
      <StatCard icon={icon} label={label} value={value} sub={sub} />
    </button>
  );
}

function AppContent() {
  const { view, setView } = useNavigation();
  const [selectedTicket, setSelectedTicket] = useState<FaultTicket | null>(null);
  const [tickets, setTickets] = useState<FaultTicket[]>(INITIAL_TICKETS);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = socketService.subscribe((message) => {
      if (message.type === 'NEW_TICKET') {
        setTickets(prev => [message.payload, ...prev].sort((a, b) => b.priorityScore - a.priorityScore));
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Contextual Welcome Logic
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.fullName.split(' ')[0] || 'Commander';
    if (hour < 12) return `${t('morning')}, ${name}`;
    if (hour < 18) return `${t('afternoon')}, ${name}`;
    return `${t('evening')}, ${name}`;
  };

  if (view === 'auth') return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthView onLogin={() => setView('dashboard')} />
      </ToastProvider>
    </ErrorBoundary>
  );

// ...

  const renderView = () => {
    switch (view) {
      case 'geospatial':
        return <GeospatialIntelligence onBack={() => setView('dashboard')} />;
      case 'ai-assistant':
        return <AIAssistant onBack={() => setView('dashboard')} />;
      case 'reporter':
        return <SentinelReporter onBack={() => setView('dashboard')} />;
      case 'tracker':
        return <ComplaintTracker onBack={() => setView('dashboard')} />;
      case 'technicians':
        return <TechnicianDashboard />;
      case 'inventory':
        return <InventoryView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Stats & Feed */}
            <div className="lg:col-span-8 space-y-8">
              <div className="mb-2">
                <h2 className="text-4xl font-black tracking-tighter uppercase mb-1">{getGreeting()}</h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Operational Status: <span className="text-emerald-500">{t('nominal')}</span></p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ClickableStatCard 
                  icon={<AlertTriangle className="text-red-500" />} 
                  label="Active Faults" 
                  value="12" 
                  sub="3 Critical" 
                  onClick={() => setView('tracker')}
                />
                <StatCard icon={<Activity className="text-[#00A86B]" />} label="Grid Health" value="94.2%" sub="+2.1% Up" />
                <StatCard icon={<Trophy className="text-amber-500" />} label="Trust Score" value="4.92" sub="Top 1%" />
              </div>
              <section className="bg-white/5 border border-white/5 rounded-3xl p-8 h-[700px]">
                <PriorityFeed tickets={tickets} onTicketClick={(ticket) => setSelectedTicket(ticket)} />
              </section>
            </div>
            {/* Right: Pre-Diagnosis & Social */}
            <div className="lg:col-span-4 space-y-8">
              <PreDiagnosisPanel 
                ticket={selectedTicket} 
                onClose={() => setSelectedTicket(null)}
                onDispatch={(ticket) => {
                  alert(`Dispatching technician to ${ticket.village} for ${ticket.type}`);
                  setSelectedTicket(null);
                }}
              />
              <GlassCard className="p-8 bg-gradient-to-br from-[#00A86B]/20 to-transparent border-[#00A86B]/10 overflow-hidden relative">
                <Zap className="absolute -right-8 -bottom-8 w-40 h-40 text-[#00A86B]/10" />
                <h4 className="text-[10px] font-black text-[#00A86B] uppercase tracking-[0.2em] mb-2">Social Engine</h4>
                <h3 className="text-xl font-black mb-6">Top Village</h3>
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-xl bg-[#00A86B] flex items-center justify-center font-black text-lg">01</div>
                  <div>
                    <p className="font-bold text-white">Maji Moto</p>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase">98% Cleanliness</p>
                  </div>
                  <ChevronRight className="ml-auto w-5 h-5 text-gray-600" />
                </div>
              </GlassCard>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#00A86B]/30 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-xl z-50">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">{t('liveOps')}</p>
            </div>
            <GlobalSearch />
          </div>

          <div className="flex items-center gap-6">
            <LanguageToggle />
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs font-bold">{user?.fullName || 'Dhanush A.'}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{user?.role || 'Lead Commander'}</p>
              </div>
              <ProfileDropdown />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
