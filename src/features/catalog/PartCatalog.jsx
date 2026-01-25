import { useState, useEffect, useCallback } from 'react';
import { partsApi } from '../../api/partsApi';
import PartCard from './PartCard';
import PartFilters from './PartFilters';
import { Search, Loader2, PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function PartCatalog() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ categoryId: null, brand: null, condition: null });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // --- SV-Grade: Data Synchronization Logic ---
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      
      // Logic Flow: Search has highest priority, then Categories, then general filters
      if (searchQuery) {
        data = await partsApi.searchParts(searchQuery, page);
      } else if (activeFilters.categoryId) {
        data = await partsApi.getPartsByCategory(activeFilters.categoryId, page);
      } else {
        // Here we can pass brand/condition if your backend supports them on the base /parts endpoint
        data = await partsApi.getParts(page);
      }
      
      setParts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.show("Terminal Link Severed: Check Connection", "error");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, activeFilters]);

  // Debounced Search Effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchInventory();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [fetchInventory]);

  return (
    <div className="flex bg-brand-dark min-h-screen">
      {/* 1. Sidebar Refinement Engine */}
      <PartFilters 
        activeFilters={activeFilters}
        onFilterChange={(newFilters) => {
          setActiveFilters(newFilters);
          setPage(0);
          setSearchQuery(''); // Reset search if a filter is clicked
        }}
      />

      {/* 2. Main Inventory Terminal */}
      <div className="flex-1 px-8 py-10">
        <header className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
              Terminal <span className="text-brand-accent not-italic">Inventory</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em]">Live Database Sync</p>
            </div>
          </div>

          <div className="relative group w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="text"
              placeholder="Search by SKU, Name, or OEM Number..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white placeholder-slate-600 focus:outline-none focus:border-brand-accent/40 transition-all shadow-2xl"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
                setActiveFilters({ categoryId: null, brand: null, condition: null }); // Clear filters if searching
              }}
            />
          </div>
        </header>

        {loading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-6">
            <Loader2 className="h-14 w-14 text-brand-accent animate-spin" />
            <span className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Scanning Data Sectors...</span>
          </div>
        ) : parts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-8">
            {parts.map(part => (
              <PartCard key={part.id} part={part} />
            ))}
          </div>
        ) : (
          <div className="h-[60vh] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
            <PackageSearch className="h-20 w-20 text-slate-800 mb-6" />
            <h3 className="text-white font-black uppercase text-xl tracking-widest">Zero Matches Found</h3>
            <p className="text-slate-500 font-mono text-xs mt-2 uppercase">Adjust refinement parameters or search query</p>
          </div>
        )}

        {/* --- Pagination Circuit --- */}
        {totalPages > 1 && (
          <footer className="flex items-center justify-center gap-6 mt-16 pt-10 border-t border-white/5">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-brand-accent disabled:opacity-10 transition-all border border-white/5"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">Sector</span>
              <span className="text-sm font-black text-white">
                {page + 1} <span className="text-slate-600 mx-2">/</span> {totalPages}
              </span>
            </div>

            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-brand-accent disabled:opacity-10 transition-all border border-white/5"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}