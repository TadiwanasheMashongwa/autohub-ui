import { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Static Bridge: Allows non-component files (like apiClient.js) 
 * to trigger notifications globally.
 */
export let toast = {
  show: (msg, type) => console.warn("NotificationProvider not ready:", msg)
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  // Link the static bridge to this stateful function
  toast.show = showNotification;

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      
      {/* Toast Overlay Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map(({ id, message, type }) => (
          <div
            key={id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-lg border shadow-2xl transition-all duration-300 animate-in slide-in-from-right-full ${
              type === 'error' ? 'bg-red-950 border-red-500/50 text-red-100' :
              type === 'success' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-100' :
              'bg-slate-900 border-slate-700 text-slate-100'
            }`}
          >
            {type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
            {type === 'success' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
            {type !== 'error' && type !== 'success' && <Info className="h-5 w-5 text-blue-500" />}
            
            <span className="text-sm font-medium">{message}</span>
            
            <button 
              onClick={() => removeNotification(id)} 
              className="ml-auto p-1 hover:bg-white/10 rounded-md transition-colors"
            >
              <X className="h-4 w-4 opacity-70" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);