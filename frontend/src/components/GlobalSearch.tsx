import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Ticket, User, X, Command } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

export const GlobalSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { setView } = useNavigation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const results = query ? [
    { id: 'VIL-OMO', type: 'Village', label: 'Omo Valley', icon: MapPin },
    { id: 'TKT-8842', type: 'Ticket', label: 'Grid Failure #8842', icon: Ticket },
    { id: 'TECH-77', type: 'Technician', label: 'Naveena Sandhi', icon: User },
  ].filter(r => r.label.toLowerCase().includes(query.toLowerCase())) : [];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group min-w-[300px]"
      >
        <Search className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest flex-1 text-left">Search Sentinel...</span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-md">
          <Command className="w-2.5 h-2.5 text-gray-500" />
          <span className="text-[10px] text-gray-500 font-black">K</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-[#111] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden relative z-10"
            >
              <div className="p-6 flex items-center gap-4 border-b border-white/5">
                <Search className="w-6 h-6 text-[#00A86B]" />
                <input 
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find Village, Ticket ID, or Technician..."
                  className="bg-transparent border-none outline-none text-white text-lg font-bold w-full placeholder:text-gray-700"
                />
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-xl">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-4">
                {results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((res) => {
                      const Icon = res.icon;
                      return (
                        <button
                          key={res.id}
                          onClick={() => setIsOpen(false)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group"
                        >
                          <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:border-[#00A86B]/50 transition-colors">
                            <Icon className="w-5 h-5 text-gray-400 group-hover:text-[#00A86B] transition-colors" />
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00A86B] mb-1">{res.type}</p>
                            <p className="text-sm font-bold text-white">{res.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                      {query ? 'No results found in Sentinel database' : 'Enter a command to begin search'}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
