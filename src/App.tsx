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
  Bot
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
import { ProfileDropdown } from './components/ProfileDropdown';
import { useNavigation } from './contexts/NavigationContext';

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

function AppContent() {
  const { view, setView } = useNavigation();
  const [selectedTicket, setSelectedTicket] = useState<FaultTicket | null>(null);
  const [tickets, setTickets] = useState<FaultTicket[]>(INITIAL_TICKETS);
  const { user } = useAuth();

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
    if (hour < 12) return `Good Morning, ${name}`;
    if (hour < 18) return `Good Afternoon, ${name}`;
    return `Good Evening, ${name}`;
  };

  if (view === 'auth') return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthView onLogin={() => setView('dashboard')} />
      </ToastProvider>
    </ErrorBoundary>
  );
  
  if (view === 'geospatial') return (
    <ErrorBoundary>
      <ToastProvider>
        <GeospatialIntelligence onBack={() => setView('dashboard')} />
      </ToastProvider>
    </ErrorBoundary>
  );

  if (view === 'ai-assistant') return (
    <ErrorBoundary>
      <ToastProvider>
        <AIAssistant onBack={() => setView('dashboard')} />
      </ToastProvider>
    </ErrorBoundary>
  );

  if (view === 'reporter') return (
    <ErrorBoundary>
      <ToastProvider>
        <SentinelReporter onBack={() => setView('dashboard')} />
      </ToastProvider>
    </ErrorBoundary>
  );

  if (view === 'tracker') return (
    <ErrorBoundary>
      <ToastProvider>
        <ComplaintTracker onBack={() => setView('dashboard')} />
      </ToastProvider>
    </ErrorBoundary>
  );

  return (
    <ErrorBoundary>
      <ToastProvider>
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#00A86B]/30">
      {/* Top Navigation */}
      <header className="border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 bg-[#0A0A0A]/80 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4">
          <div className="bg-[#00A86B] p-2 rounded-xl shadow-[0_0_20px_rgba(0,168,107,0.2)]">
            <Zap className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter">SENTINEL COMMAND</h1>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Live Operations</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <button 
              onClick={() => setView('geospatial')}
              className="hover:text-[#00A86B] transition-colors flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              SGI Window
            </button>
            <button 
              onClick={() => setView('ai-assistant')}
              className="hover:text-[#00A86B] transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Sentinel AI
            </button>
            <button 
              onClick={() => setView('reporter')}
              className="hover:text-[#00A86B] transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Report Fault
            </button>
            <button 
              onClick={() => setView('tracker')}
              className="hover:text-[#00A86B] transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Track Status
            </button>
            <button className="hover:text-white transition-colors">Technicians</button>
            <button className="hover:text-white transition-colors">Analytics</button>
          </div>
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-xs font-bold">{user?.fullName || 'Dhanush A.'}</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">{user?.role || 'Lead Commander'}</p>
            </div>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Stats & Feed */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Welcome Section */}
          <div className="mb-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-1">{getGreeting()}</h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Operational Status: <span className="text-emerald-500">All Systems Nominal</span></p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard icon={<AlertTriangle className="text-red-500" />} label="Active Faults" value="12" sub="3 Critical" />
            <StatCard icon={<Activity className="text-[#00A86B]" />} label="Grid Health" value="94.2%" sub="+2.1% Up" />
            <StatCard icon={<Trophy className="text-amber-500" />} label="Trust Score" value="4.92" sub="Top 1%" />
          </div>

          {/* Priority Feed */}
          <section className="bg-white/5 border border-white/5 rounded-3xl p-8 h-[700px]">
            <PriorityFeed 
              tickets={tickets} 
              onTicketClick={(ticket) => setSelectedTicket(ticket)} 
            />
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

          {/* Social Engine Preview */}
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
      </div>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
