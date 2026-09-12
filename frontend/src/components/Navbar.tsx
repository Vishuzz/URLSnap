import React, { useEffect, useState } from 'react';
import { checkBackendHealth } from '../services/api';
import type { HealthResponse } from '../types';
import { RefreshCw, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDocs }) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await checkBackendHealth();
      setHealth(data);
      setError(false);
    } catch {
      setError(true);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-[#0d0814] text-[#e2d8ce] border-b border-[#2a172c]">
      <div className="w-full px-6 sm:px-10 h-20 flex items-center justify-between">
        {/* Extreme Left: Brand Mark */}
        <div className="flex items-center">
          <a href="#" className="text-2xl sm:text-3xl font-serif tracking-tight text-white font-semibold flex items-center gap-2">
            <span>URLSnap</span>
          </a>
        </div>

        {/* Center: Clean Navigation Links (Features removed, API Docs -> Docs) */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-xs sm:text-sm text-[#a8998c] font-sans tracking-wide">
          <a href="#architecture" className="hover:text-white transition-colors">
            Architecture
          </a>
          <a href="#history" className="hover:text-white transition-colors">
            Recent History
          </a>
          <button
            onClick={onOpenDocs}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#e69880]" />
            <span>Docs</span>
          </button>
        </nav>

        {/* Extreme Right: Status & CTA */}
        <div className="flex items-center gap-3">
          {/* Backend Status Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#3b233c] text-xs font-medium bg-[#1a0f21]"
            title="Go Backend Status"
          >
            {loading && !health && !error ? (
              <>
                <RefreshCw className="w-3 h-3 text-[#c084fc] animate-spin" />
                <span className="text-[#a8998c]">Connecting...</span>
              </>
            ) : error ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Offline
                </span>
              </>
            ) : (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  {health?.database === 'connected' ? 'MySQL Active' : 'In-Memory'}
                </span>
              </>
            )}
          </div>

          <a
            href="#shorten-form"
            className="px-5 py-2.5 rounded-full bg-white hover:bg-[#f2ebe1] text-[#0d0814] text-xs font-semibold tracking-wide transition-all shadow-md"
          >
            Start for free
          </a>
        </div>
      </div>
    </header>
  );
};
