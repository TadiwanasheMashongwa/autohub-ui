import { useState, useEffect, useCallback } from 'react';
import { partsApi } from '../../api/partsApi';
import { useAuth } from '../auth/AuthContext';
import PartCard from './PartCard';
import PartFilters from './PartFilters';
import VehicleSelector from './VehicleSelector';
import { Search, Loader2, PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function PartCatalog() {
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'CLERK';

  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({ categoryId: null, brand: null, condition: null });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      // LOGIC FIX: We must pass activeFilters (brand/condition) to the API calls
      if (selectedVehicle) {
        data = await partsApi.getPartsByVehicle(selectedVehicle.id, page);
      } else if (searchQuery) {
        data = await partsApi.searchParts(searchQuery, page, activeFilters);
      } else if (activeFilters.categoryId) {
        data = await partsApi.getPartsByCategory(activeFilters.categoryId, page, activeFilters);
      } else {
        data = await partsApi.getParts(page, activeFilters);
      }

      setParts(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      toast.show("Link Failure: Re-syncing Terminal", "error");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, activeFilters, selectedVehicle]);

  useEffect(() => {
    const delay = setTimeout(() => fetchInventory(), 400);
    return () => clearTimeout(delay);
  }, [fetchInventory]);

  return (
    <div className="flex bg-brand-dark min-h-screen">
      <PartFilters 
        activeFilters={activeFilters}
        onFilterChange={(f) => { setActiveFilters(f); setPage(0); }}
      />

      <div className="flex-1 px-10 py-10 max-w-[1600px] mx-auto">
        <VehicleSelector 
          selectedVehicle={selectedVehicle}
          onVehicleSelect={(v) => { setSelectedVehicle(v); setPage(0); }}
        />

        <header className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
              {isStaff ? 'Inventory Management' : 'Parts Catalog'}
            </h2>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em]">
              {isStaff ? 'Internal Logistics Link' : 'Premium Parts Fulfillment'}
            </p>
          </div>

          <div className="relative group w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="text"
              placeholder={isStaff ? "Search SKU, OEM, or Bin Location..." : "Search for high-performance parts..."}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white focus:outline-none focus:border-brand-accent/40 transition-all shadow-2xl font-medium"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
            />
          </div>
        </header>

        {loading ? (
          <div className="h-[40vh] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-brand-accent h-12 w-12" />
          </div>
        ) : parts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-8">
            {parts.map(part => <PartCard key={part.id} part={part} />)}
          </div>
        ) : (
          <div className="h-[40vh] flex flex-col items-center justify-center opacity-50 text-slate-500">
            <PackageSearch className="h-16 w-16 mb-4" />
            <p className="uppercase font-black text-xs tracking-widest">No matching assets in this sector</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-4">
            <button 
              disabled={page === 0} 
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 bg-white/5 rounded-xl text-white disabled:opacity-20"
            >
              <ChevronLeft />
            </button>
            <button 
              disabled={page >= totalPages - 1} 
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 bg-white/5 rounded-xl text-white disabled:opacity-20"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}