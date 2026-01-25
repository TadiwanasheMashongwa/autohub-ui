import { useState, useEffect, useCallback } from 'react';
import { partApi } from '../../api/partApi';
import PartCard from './PartCard.jsx';
import { Search, Loader2, ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function PartCatalog() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const data = searchQuery 
        ? await partApi.searchParts(searchQuery, page)
        : await partApi.getParts(page);
      
      setParts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.show("Terminal Error: Inventory Link Failed", "error");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    const delay = setTimeout(() => fetchParts(), 400);
    return () => clearTimeout(delay);
  }, [fetchParts]);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            Global <span className="text-brand-accent italic">Inventory</span>
          </h2>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1 italic">
            Connected to AutoHub Central Database
          </p>
        </div>

        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
          <input
            type="text"
            placeholder="Search by Name, SKU, Brand or OEM..."
            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent transition-all font-medium"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
          />
        </div>
      </div>

      {/* Grid Area */}
      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-10 w-10 text-brand-accent animate-spin" />
          <span className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">Syncing Local Cache...</span>
        </div>
      ) : parts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {parts.map(part => (
            <PartCard key={part.id} part={part} />
          ))}
        </div>
      ) : (
        <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
          <PackageSearch className="h-12 w-12 text-slate-700" />
          <p className="text-slate-400 font-bold uppercase text-sm tracking-widest">No assets found in current sector</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 pt-12 border-t border-white/5">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-brand-accent disabled:opacity-20 transition-all border border-white/5"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Index</span>
            <span className="text-sm font-black text-white">
              {page + 1} <span className="text-slate-600 mx-2">/</span> {totalPages}
            </span>
          </div>

          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-brand-accent disabled:opacity-20 transition-all border border-white/5"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}