import { useState, useEffect, useCallback } from 'react';
import { partsApi } from '../../api/partsApi';
import PartCard from './PartCard';
import PartFilters from './PartFilters';
import VehicleSelector from './VehicleSelector';
import { Search, Loader2, PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function PartCatalog() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ categoryId: null, brand: null, condition: null });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * Silicon Valley Grade: Fulfillment Logic
   * Executes the prioritized drill-down strategy.
   */
  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      let data;

      // PRIORITY 1: Compatibility Check (findByCompatibleVehiclesId)
      if (selectedVehicle) {
        data = await partsApi.getPartsByVehicle(selectedVehicle.id, page);
      } 
      // PRIORITY 2: Keyword Index Search (@Query searchParts)
      else if (searchQuery) {
        data = await partsApi.searchParts(searchQuery, page);
      } 
      // PRIORITY 3: Categorical Refinement (findByCategoryId)
      else if (activeFilters.categoryId) {
        data = await partsApi.getPartsByCategory(activeFilters.categoryId, page);
      } 
      // PRIORITY 4: General Distributed Inventory (findAll)
      else {
        data = await partsApi.getParts(page);
      }

      setParts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.show("Network Error: Inventory Link Interrupted", "error");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, activeFilters, selectedVehicle]);

  // Debounce circuit: prevents API spamming
  useEffect(() => {
    const delay = setTimeout(() => fetchInventory(), 400);
    return () => clearTimeout(delay);
  }, [fetchInventory]);

  return (
    <div className="flex bg-brand-dark min-h-screen">
      <PartFilters 
        activeFilters={activeFilters}
        onFilterChange={(newFilters) => {
          setActiveFilters(newFilters);
          setPage(0);
          setSearchQuery(''); 
        }}
      />

      <div className="flex-1 px-10 py-10 max-w-[1600px] mx-auto">
        <VehicleSelector 
          selectedVehicle={selectedVehicle}
          onVehicleSelect={(vehicle) => {
            setSelectedVehicle(vehicle);
            setPage(0);
            setSearchQuery('');
          }}
        />

        <header className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
              Inventory <span className="text-brand-accent not-italic">Terminal</span>
            </h2>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em]">Live Sector Sync</p>
            </div>
          </div>

          <div className="relative group w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="text"
              placeholder="Search SKU, Name, or OEM Number..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-white focus:outline-none focus:border-brand-accent/40 transition-all shadow-2xl font-medium"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
            />
          </div>
        </header>

        {loading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-6">
            <Loader2 className="h-14 w-14 text-brand-accent animate-spin" />
            <span className="text-slate-500 font-mono text-xs uppercase tracking-[0.4em]">Retrieving Encrypted Assets...</span>
          </div>
        ) : parts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-8">
            {parts.map(part => <PartCard key={part.id} part={part} />)}
          </div>
        ) : (
          <div className="h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
            <PackageSearch className="h-20 w-20 text-slate-800 mb-6" />
            <h3 className="text-white font-black uppercase tracking-widest text-center">No Assets Detected</h3>
            <p className="text-slate-500 font-mono text-[10px] mt-2 uppercase">Adjust Refinement Parameters</p>
          </div>
        )}

        {totalPages > 1 && (
          <footer className="flex items-center justify-center gap-8 mt-16 pt-10 border-t border-white/5">
            <button
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-brand-accent disabled:opacity-10 transition-all border border-white/5"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <span className="text-sm font-black text-white font-mono">
              {page + 1} <span className="text-slate-600 mx-2">/</span> {totalPages}
            </span>
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