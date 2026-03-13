import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  Package, 
  BarChart3, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Zap,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';
import { useLanguage } from '../contexts/LanguageContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'geospatial', label: 'Geospatial', icon: MapIcon },
  { id: 'technicians', label: 'Technician Fleet', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'reporter', label: 'Report Fault', icon: AlertTriangle },
  { id: 'tracker', label: 'My Complaints', icon: MessageSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { view, setView } = useNavigation();
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-[#0A0A0A] border-r border-white/5 flex flex-col sticky top-0 z-[60]"
    >
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="bg-[#00A86B] p-2 rounded-xl shrink-0">
            <Zap className="text-white w-6 h-6" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-lg font-black tracking-tighter text-white"
              >
                SENTINEL
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-2 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = view === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as any)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${
                isActive 
                  ? 'bg-[#00A86B]/10 text-[#00A86B]' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-[#00A86B]' : 'group-hover:scale-110 transition-transform'}`} />
              
              {!isCollapsed && (
                <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                  {t(item.id)}
                </span>
              )}

              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute left-0 w-1 h-8 bg-[#00A86B] rounded-r-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* System Health / Footer */}
      <div className="p-6 border-t border-white/5">
        <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shrink-0" />
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">System Nominal</p>
              <p className="text-[8px] text-gray-600 font-bold uppercase whitespace-nowrap">v2.4.0 Enterprise</p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};
