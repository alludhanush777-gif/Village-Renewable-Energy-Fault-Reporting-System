import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow,
  useMap,
  MapCameraChangedEvent
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import type { Marker } from '@googlemaps/markerclusterer';
import { 
  Search, 
  Zap, 
  Battery, 
  Sun, 
  Signal, 
  AlertTriangle, 
  ChevronRight, 
  X,
  Activity,
  Navigation,
  Phone,
  ShieldCheck,
  Clock,
  MapPin,
  LayoutGrid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Constants & Styles ---

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const MAP_ID = 'SENTINEL_SGI_MAP';

const MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
  { "featureType": "administrative.province", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
  { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334e7f" }] },
  { "featureType": "landscape.natural", "elementType": "geometry", "stylers": [{ "color": "#023e58" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#283d6a" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#6f9ba5" }] },
  { "featureType": "poi", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] },
  { "featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{ "color": "#023e58" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#3C7680" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] },
  { "featureType": "road", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#2c6675" }] },
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#255763" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#b0d5ce" }] },
  { "featureType": "road.highway", "elementType": "labels.text.stroke", "stylers": [{ "color": "#023e58" }] },
  { "featureType": "transit", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] },
  { "featureType": "transit", "elementType": "labels.text.stroke", "stylers": [{ "color": "#1d2c4d" }] },
  { "featureType": "transit.line", "elementType": "geometry.fill", "stylers": [{ "color": "#283d6a" }] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#3a4762" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#4e6d70" }] }
];

// --- Types ---

interface Microgrid {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'Stable' | 'Warning' | 'Critical';
  metrics: {
    voltage: number;
    current: number;
    temp: number;
    uptime: number;
  };
  history: { time: string; uptime: number }[];
  sentinel: {
    name: string;
    trustScore: number;
    phone: string;
  };
  activeTickets: number;
  connectivity: number; // 0-100
}

const MOCK_GRIDS: Microgrid[] = [
  {
    id: 'MG-01',
    name: 'Omo Valley',
    lat: 4.8,
    lng: 36.2,
    status: 'Critical',
    metrics: { voltage: 18.2, current: 4.5, temp: 42, uptime: 88 },
    history: Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, uptime: 80 + Math.random() * 20 })),
    sentinel: { name: 'Abebe K.', trustScore: 98, phone: '+251 911 000 000' },
    activeTickets: 3,
    connectivity: 15
  },
  {
    id: 'MG-08',
    name: 'Turkana North',
    lat: 3.5,
    lng: 35.9,
    status: 'Warning',
    metrics: { voltage: 23.1, current: 5.2, temp: 38, uptime: 94 },
    history: Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, uptime: 90 + Math.random() * 10 })),
    sentinel: { name: 'Sarah L.', trustScore: 95, phone: '+254 700 111 222' },
    activeTickets: 1,
    connectivity: 45
  },
  {
    id: 'MG-15',
    name: 'Kajiado West',
    lat: -1.8,
    lng: 36.5,
    status: 'Stable',
    metrics: { voltage: 24.0, current: 6.1, temp: 32, uptime: 99 },
    history: Array.from({ length: 30 }, (_, i) => ({ time: `${i}`, uptime: 98 + Math.random() * 2 })),
    sentinel: { name: 'John M.', trustScore: 99, phone: '+254 722 333 444' },
    activeTickets: 0,
    connectivity: 85
  }
];

// --- Components ---

const SentinelBackButton = ({ onClick }: { onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative flex items-center gap-2 bg-[#141414]/80 backdrop-blur-xl border border-[#00A86B]/30 p-4 rounded-2xl text-white transition-all shadow-2xl hover:border-[#00A86B] hover:shadow-[0_0_20px_rgba(0,168,107,0.3)] overflow-hidden"
      whileHover={{ x: -4 }}
    >
      <div className="relative z-10 flex items-center gap-2">
        <LayoutGrid className="w-5 h-5 text-[#00A86B]" />
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="overflow-hidden whitespace-nowrap text-xs font-black uppercase tracking-widest"
            >
              Return to Dashboard
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      {/* Animated Glow Overlay */}
      <motion.div 
        className="absolute inset-0 bg-[#00A86B]/5 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={isHovered ? {
          boxShadow: ['0 0 0px rgba(0,168,107,0)', '0 0 20px rgba(0,168,107,0.2)', '0 0 0px rgba(0,168,107,0)']
        } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.button>
  );
};

const SearchBox = React.memo(({ onSelect }: { onSelect: (grid: Microgrid) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Microgrid[]>([]);

  useEffect(() => {
    if (query.length > 1) {
      const filtered = MOCK_GRIDS.filter(g => 
        g.name.toLowerCase().includes(query.toLowerCase()) ||
        g.id.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="absolute top-[88px] left-6 z-20 w-80">
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#00A86B] transition-colors" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Village or Grid ID..."
          className="w-full bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00A86B]/50 transition-all shadow-2xl"
        />
      </div>
      
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-2 bg-[#0A0A0A]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {results.map(grid => (
              <button
                key={grid.id}
                onClick={() => {
                  onSelect(grid);
                  setQuery('');
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  grid.status === 'Stable' ? "bg-emerald-500" : 
                  grid.status === 'Warning' ? "bg-amber-500" : "bg-rose-500"
                )} />
                <div>
                  <div className="text-white font-bold text-sm">{grid.name}</div>
                  <div className="text-gray-500 text-xs">{grid.id}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-600 ml-auto" />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

const DeepDivePanel = ({ grid, onClose }: { grid: Microgrid | null, onClose: () => void }) => {
  if (!grid) return null;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-[400px] bg-[#0A0A0A]/90 backdrop-blur-2xl border-l border-white/10 z-30 flex flex-col shadow-[-32px_0_64px_rgba(0,0,0,0.5)]"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-black tracking-tighter uppercase">{grid.name}</h2>
          <p className="text-gray-500 text-sm font-mono">{grid.id}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
        {/* Live Metrics */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#00A86B]" />
            <h3 className="text-white text-xs font-bold uppercase tracking-widest opacity-50">Live Telemetry</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Voltage</div>
              <div className="text-2xl font-black text-white">{grid.metrics.voltage}<span className="text-xs ml-1 opacity-50">V</span></div>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-gray-500 text-[10px] uppercase font-bold mb-1">Temperature</div>
              <div className="text-2xl font-black text-white">{grid.metrics.temp}<span className="text-xs ml-1 opacity-50">°C</span></div>
            </div>
          </div>
        </section>

        {/* Historical Health */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00A86B]" />
              <h3 className="text-white text-xs font-bold uppercase tracking-widest opacity-50">30D Uptime</h3>
            </div>
            <div className="text-[#00A86B] font-bold text-sm">{grid.metrics.uptime}%</div>
          </div>
          <div className="h-24 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={grid.history}>
                <Line 
                  type="monotone" 
                  dataKey="uptime" 
                  stroke="#00A86B" 
                  strokeWidth={2} 
                  dot={false} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: 'none', borderRadius: '8px', fontSize: '10px' }}
                  itemStyle={{ color: '#00A86B' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Local Contact */}
        <section className="bg-[#00A86B]/10 p-5 rounded-2xl border border-[#00A86B]/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#00A86B] flex items-center justify-center text-white font-black text-xl">
              {grid.sentinel.name[0]}
            </div>
            <div>
              <div className="text-white font-bold">{grid.sentinel.name}</div>
              <div className="text-[#00A86B] text-xs font-bold uppercase tracking-tighter">Energy Sentinel</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-white font-black text-lg">{grid.sentinel.trustScore}</div>
              <div className="text-[8px] text-gray-500 uppercase font-bold">Trust Score</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors">
              <Phone className="w-3 h-3" /> Call
            </button>
            <button className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors">
              <Navigation className="w-3 h-3" /> Route
            </button>
          </div>
        </section>

        {/* Active Tickets */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-white text-xs font-bold uppercase tracking-widest opacity-50">Active Tickets</h3>
            </div>
            <div className="bg-rose-500/20 text-rose-500 px-2 py-0.5 rounded text-[10px] font-black uppercase">
              {grid.activeTickets} Issues
            </div>
          </div>
          {grid.activeTickets > 0 ? (
            <div className="space-y-3">
              {Array.from({ length: grid.activeTickets }).map((_, i) => (
                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-bold">Inverter Fault</div>
                    <div className="text-gray-500 text-[10px]">Reported 14 mins ago</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-emerald-500/10 p-8 rounded-2xl border border-emerald-500/20 text-center">
              <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <div className="text-emerald-500 text-sm font-bold">Grid Healthy</div>
              <div className="text-emerald-500/50 text-[10px] uppercase font-bold">No active faults detected</div>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

const MapControls = React.memo(({ mode, setMode }: { mode: string, setMode: (m: string) => void }) => {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex p-1 bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
      {[
        { id: 'heatmap', icon: Zap, label: 'Fault Heatmap' },
        { id: 'infra', icon: Sun, label: 'Infrastructure' },
        { id: 'signal', icon: Signal, label: 'Connectivity' }
      ].map(item => (
        <button
          key={item.id}
          onClick={() => setMode(item.id)}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-widest",
            mode === item.id ? "bg-[#00A86B] text-white shadow-[0_0_20px_rgba(0,168,107,0.4)]" : "text-gray-500 hover:text-white"
          )}
        >
          <item.icon className="w-4 h-4" />
          {item.label}
        </button>
      ))}
    </div>
  );
});

const MapInstanceHandler = ({ onMapLoad }: { onMapLoad: (map: google.maps.Map | null) => void }) => {
  const map = useMap();
  React.useEffect(() => {
    if (map) {
      onMapLoad(map);
    }
  }, [map, onMapLoad]);
  return null;
};

export const GeospatialIntelligence = ({ onBack }: { onBack: () => void }) => {
  const [selectedGrid, setSelectedGrid] = useState<Microgrid | null>(null);
  const [viewMode, setViewMode] = useState('heatmap');
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  const handleGridSelect = React.useCallback((grid: Microgrid) => {
    setSelectedGrid(grid);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: grid.lat, lng: grid.lng });
      mapRef.current.setZoom(12);
    }
  }, []);

  const markers = useMemo(() => MOCK_GRIDS.map(grid => (
    <AdvancedMarker
      key={grid.id}
      position={{ lat: grid.lat, lng: grid.lng }}
      onClick={() => setSelectedGrid(grid)}
    >
      <div className="relative group cursor-pointer">
        {grid.status === 'Critical' && (
          <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20 scale-[3]" />
        )}
        <div className={cn(
          "w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xl border-2 transition-transform group-hover:scale-110",
          grid.status === 'Stable' ? "bg-emerald-500/20 border-emerald-500 text-emerald-500" :
          grid.status === 'Warning' ? "bg-amber-500/20 border-amber-500 text-amber-500" :
          "bg-rose-500/20 border-rose-500 text-rose-500"
        )}>
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#0A0A0A] border border-white/10 px-2 py-1 rounded text-[10px] font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          {grid.name}
        </div>
      </div>
    </AdvancedMarker>
  )), []);

  return (
    <div className="h-screen w-full relative bg-[#0A0A0A] overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-6 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 pointer-events-auto">
          <SentinelBackButton onClick={onBack} />
          <div className="bg-[#141414]/80 backdrop-blur-xl border border-white/5 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <MapPin className="text-[#00A86B] w-5 h-5" />
            <h1 className="text-white text-xl font-black tracking-tighter uppercase">
              SGI Window
            </h1>
          </div>
        </div>
      </div>

      <SearchBox onSelect={handleGridSelect} />
      <MapControls mode={viewMode} setMode={setViewMode} />

      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <div className="h-full w-full">
          <Map
            defaultCenter={{ lat: 1.5, lng: 36.5 }}
            defaultZoom={6}
            mapId={MAP_ID}
            styles={MAP_STYLE}
            disableDefaultUI={true}
            onCameraChanged={(ev: MapCameraChangedEvent) => {
              // Handle camera changes if needed
            }}
          >
            <MapInstanceHandler onMapLoad={(map) => { mapRef.current = map; }} />
            {markers}
          </Map>
        </div>
      </APIProvider>

      <AnimatePresence>
        {selectedGrid && (
          <DeepDivePanel 
            grid={selectedGrid} 
            onClose={() => setSelectedGrid(null)} 
          />
        )}
      </AnimatePresence>

      {/* Connectivity Overlay (Visual Mock) */}
      {viewMode === 'signal' && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 mix-blend-screen" />
      )}
    </div>
  );
};

export default GeospatialIntelligence;
