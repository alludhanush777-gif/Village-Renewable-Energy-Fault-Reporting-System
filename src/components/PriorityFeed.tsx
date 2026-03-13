import React from 'react';
import { Activity, Filter, Search } from 'lucide-react';
import { PriorityCard } from './PriorityCard';
import { FaultTicket } from '../types';

interface PriorityFeedProps {
  tickets: FaultTicket[];
  onTicketClick: (ticket: FaultTicket) => void;
}

export const PriorityFeed: React.FC<PriorityFeedProps> = ({ tickets, onTicketClick }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredTickets = React.useMemo(() => {
    return tickets.filter(t => 
      t.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tickets, searchQuery]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00A86B]/10 rounded-lg">
            <Activity className="w-5 h-5 text-[#00A86B]" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Priority Feed</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Impact Matrix Sorted</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#00A86B] transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-[#00A86B]/50 transition-all w-40 focus:w-60"
            />
          </div>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {filteredTickets.map((ticket) => (
          <PriorityCard 
            key={ticket.id} 
            ticket={ticket} 
            onClick={onTicketClick} 
          />
        ))}
        
        <button className="w-full py-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:border-[#00A86B]/50 hover:text-[#00A86B] transition-all">
          View All Resolved Tickets
        </button>
      </div>
    </div>
  );
};
