import { useState, useEffect, useCallback } from 'react';
import { partsApi } from '../../api/partsApi';
import { useAuth } from '../auth/AuthContext';
import PartCard from './PartCard';
import PartFilters from './PartFilters';
import VehicleSelector from './VehicleSelector';
import { Search, Loader2, PackageSearch } from 'lucide-react';
import { toast } from '../../context/NotificationContext';

export default function PartCatalog() {
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'CLERK';

  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for Filters
  const [activeFilters, setActiveFilters] = useState({ categoryId: null, brand: null, condition: null });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [page, setPage] = useState(0);

  // 🛠️ HANDLER 1: User selects a Category/Brand
  const handleFilterChange = (newFilters) => {
    // Mutual Exclusion: If selecting a category, clear the vehicle
    if (newFilters.categoryId && newFilters.categoryId !== activeFilters.categoryId) {
      setSelectedVehicle(null); 
    }
    setActiveFilters(newFilters);
    setPage(0);
    setParts([]); // 🧹 CLEAR DATA IMMEDIATELY to prevent "Duplicate Key" error
  };

  // 🛠️ HANDLER 2: User selects a Vehicle
  const handleVehicleSelect = (vehicle) => {
    // Mutual Exclusion: If selecting a vehicle, clear the category
    if (vehicle) {
      setActiveFilters({ categoryId: null, brand: null, condition: null });
      setSearchQuery('');
    }
    setSelectedVehicle(vehicle);
    setPage(0);
    setParts([]); // 🧹 CLEAR DATA IMMEDIATELY
  };

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    
    try {
      let data;
      
      // PRIORITY LOGIC: Vehicle > Search > Category > All
      if (selectedVehicle) {
        data = await partsApi.getPartsByVehicle(selectedVehicle.id, page);
      } else if (searchQuery) {
        data = await partsApi.searchParts(searchQuery, page, activeFilters);
      } else if (activeFilters.categoryId) {
        // This is the call triggering the 500 error - see Backend Fix below
        data = await partsApi.getPartsByCategory(activeFilters.categoryId, page, activeFilters);
      } else {
        data = await partsApi.getParts(page, activeFilters);
      }

      setParts(data.content || []);
    } catch (error) {
      console.error("Sync Error:", error);
      toast.show("Inventory Sync Failed: Backend Unreachable", "error");
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
      {/* Sidebar - Passed the new mutual exclusion handler */}
      <PartFilters 
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange} 
      />

      {/* Main Content */}
      <div className="flex-1 px-10 py-10 max-w-[1600px] mx-auto">
        <VehicleSelector 
          selectedVehicle={selectedVehicle}
          onVehicleSelect={handleVehicleSelect} 
        />

        <header className="mb-12 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
              {isStaff ? 'Inventory Management' : 'Parts Catalog'}
            </h2>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-brand-accent rounded-full animate-pulse" />
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.5em]">Live Sector Sync</p>
            </div>
          </div>

          <div className="relative group w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600 group-focus-within:text-brand-accent transition-colors" />
            <input
              type="text"
              placeholder={isStaff ? "Search SKU, OEM..." : "Search parts..."}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 pl-14 pr-6 text-white focus:outline-none focus:border-brand-accent/40 transition-all shadow-2xl font-medium"
              value={searchQuery}
              onChange={(e) => { 
                setSearchQuery(e.target.value); 
                setSelectedVehicle(null);
                setActiveFilters({ categoryId: null, brand: null, condition: null });
                setPage(0);
                setParts([]); // 🧹 CLEAR DATA
              }}
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
          <div className="h-[40vh] flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.02]">
            <PackageSearch className="h-16 w-16 mb-4 text-slate-800" />
            <p className="text-white font-black uppercase text-xs tracking-widest">No matching assets in this sector</p>
          </div>
        )}
      </div>
    </div>
  );
}