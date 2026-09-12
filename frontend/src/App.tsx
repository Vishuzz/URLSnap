import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ShortenForm } from './components/ShortenForm';
import { ResultCard } from './components/ResultCard';
import { TrustedLogos } from './components/TrustedLogos';
import { BentoGrid } from './components/BentoGrid';
import { ArchitectureSection } from './components/ArchitectureSection';
import { HistoryList } from './components/HistoryList';
import { Footer } from './components/Footer';
import { DocsModal } from './components/DocsModal';
import { shortenUrl } from './services/api';
import type { ShortenResponse, HistoryItem } from './types';
import { AlertTriangle, X } from 'lucide-react';

export const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [currentResult, setCurrentResult] = useState<{
    result: ShortenResponse;
    originalUrl: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('urlsnap_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('urlsnap_history', JSON.stringify(history));
    } catch {
      // Storage full
    }
  }, [history]);

  const handleShorten = async (targetUrl: string) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await shortenUrl(targetUrl);
      setCurrentResult({
        result: res,
        originalUrl: targetUrl,
      });

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        originalUrl: targetUrl,
        shortUrl: res.short_url,
        code: res.code,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setHistory((prev) => [newItem, ...prev.filter((i) => i.code !== res.code)].slice(0, 10));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred while shortening URL';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('urlsnap_history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#1c1917] font-sans">
      {/* Top Navbar */}
      <Navbar onOpenDocs={() => setIsDocsOpen(true)} />

      {/* Hero Header Section */}
      <div className="w-full bg-sunset-hero text-white pb-12 border-b border-[#361a3b]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Error Alert Banner */}
          {errorMsg && (
            <div className="max-w-3xl mx-auto mt-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-200 text-sm flex items-start justify-between gap-3 backdrop-blur-md animate-fade-in-up">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <strong className="font-semibold block text-rose-300">Shorten Request Failed</strong>
                  <span className="text-xs text-rose-300/80">{errorMsg}</span>
                </div>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="p-1 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Shorten Form */}
          <ShortenForm onShorten={handleShorten} loading={loading} />

          {/* Result Card */}
          {currentResult && (
            <ResultCard
              result={currentResult.result}
              originalUrl={currentResult.originalUrl}
            />
          )}
        </div>
      </div>

      {/* Trusted Logos */}
      <TrustedLogos />

      {/* Bento Grid Features */}
      <BentoGrid />

      {/* Interactive Architecture Section (System Design) */}
      <ArchitectureSection />

      {/* History List */}
      <HistoryList items={history} onClear={clearHistory} />

      {/* Footer */}
      <Footer />

      {/* Interactive Docs Modal */}
      <DocsModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />
    </div>
  );
};

export default App;
