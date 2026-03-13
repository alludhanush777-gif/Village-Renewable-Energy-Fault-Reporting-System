import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Search, 
  ArrowUpRight, 
  AlertTriangle, 
  History, 
  Plus, 
  Download,
  Filter,
  Truck,
  Database
} from 'lucide-react';
import { GlassCard } from './GlassCard';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
  unit: string;
  lastUpdated: string;
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV-001', name: '10A Ceramic Fuse', category: 'Electrical', quantity: 45, minThreshold: 20, unit: 'pcs', lastUpdated: '2h ago' },
  { id: 'INV-002', name: 'Growatt 5kVA Inverter Board', category: 'Core Electronics', quantity: 4, minThreshold: 6, unit: 'units', lastUpdated: '1d ago' },
  { id: 'INV-003', name: '150Ah Gel Battery Cell', category: 'Energy Storage', quantity: 24, minThreshold: 15, unit: 'cells', lastUpdated: '5h ago' },
  { id: 'INV-004', name: '250W Monocrystalline Panel', category: 'Solar', quantity: 12, minThreshold: 10, unit: 'panels', lastUpdated: '3d ago' },
];

export const InventoryView: React.FC = () => {
  const [items, setItems] = useState(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">System Inventory</h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <Database className="w-4 h-4 text-[#00A86B]" />
            Enterprise Hardware Log & Spare Parts Management
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Export Ledger
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#00A86B] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#00D084] transition-all shadow-[0_0_20px_rgba(0,168,107,0.3)]">
            <Plus className="w-4 h-4" /> Log New Stock
          </button>
        </div>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <GlassCard className="p-6 border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total SKU</p>
          <p className="text-2xl font-black text-white">{items.length}</p>
        </GlassCard>
        <GlassCard className="p-6 border-white/5 border-red-500/20 bg-red-500/5">
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-1">Low Stock Alerts</p>
          <p className="text-2xl font-black text-white">{items.filter(i => i.quantity < i.minThreshold).length}</p>
        </GlassCard>
        <GlassCard className="p-6 border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Incoming Shipments</p>
          <p className="text-2xl font-black text-white">2</p>
        </GlassCard>
        <GlassCard className="p-6 border-white/5">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Monthly Usage</p>
          <p className="text-2xl font-black text-white">124 pcs</p>
        </GlassCard>
      </div>

      {/* Main Table Area */}
      <GlassCard className="overflow-hidden border-white/5">
        <div className="p-6 border-b border-white/5 flex items-center justify-between gap-8 bg-white/5">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <Search className="w-5 h-5 text-gray-500" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by part name or ID..."
              className="bg-transparent border-none outline-none text-sm font-bold text-white w-full placeholder:text-gray-700"
            />
          </div>
          <div className="flex items-center gap-4">
             <Filter className="w-4 h-4 text-gray-500" />
             <span className="text-[10px] font-black uppercase text-gray-400">Filter By Category</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Item Details</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Stock Status</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Tracking Info</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center border border-white/10 group-hover:border-[#00A86B]/30 transition-colors">
                        <Package className="w-5 h-5 text-gray-500 group-hover:text-[#00A86B] transition-colors" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">{item.name}</p>
                        <p className="text-[8px] text-gray-600 font-bold uppercase tracking-[0.2em]">{item.id} • {item.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-[120px]">
                        <div className="flex justify-between mb-2">
                          <span className={`text-[10px] font-black ${item.quantity < item.minThreshold ? 'text-red-500' : 'text-emerald-500'}`}>
                            {item.quantity} {item.unit}
                          </span>
                          <span className="text-[10px] text-gray-600 font-bold">{item.minThreshold} min</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${item.quantity < item.minThreshold ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${Math.min((item.quantity / (item.minThreshold * 2)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <History className="w-3 h-3 text-gray-600" />
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Updated {item.lastUpdated}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-500 hover:text-white">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
