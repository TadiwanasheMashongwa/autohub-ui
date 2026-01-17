import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // In production, you would send this to a service like Sentry
    console.error("Terminal Error Captured:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center">
          <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">System Interruption</h1>
          <p className="text-slate-500 font-mono text-xs mt-2 max-w-xs">
            A critical UI error occurred. The session has been isolated to prevent data corruption.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-8 flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all font-bold uppercase text-xs tracking-widest"
          >
            <RefreshCcw className="h-4 w-4" /> Reset Terminal
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;