import React, { useState } from 'react';
import { Copy, Check, ExternalLink, QrCode, Sparkles } from 'lucide-react';
import type { ShortenResponse } from '../types';
import { QRModal } from './QRModal';

interface ResultCardProps {
  result: ShortenResponse;
  originalUrl: string;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, originalUrl }) => {
  const [copied, setCopied] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in-up">
        <div className="relative p-6 sm:p-8 rounded-3xl bg-[#1d0d21] border border-[#4a244d] shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Top copper gradient border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e69880] via-[#8c432d] to-[#e69880]"></div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#361a3b]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#3d203f] text-[#e69880]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-[#e69880] tracking-wider uppercase font-sans">
                Short Link Generated
              </span>
            </div>

            <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#120715] text-[#d4c3b5] border border-[#331838]">
              Code: <strong className="text-[#e69880]">{result.code}</strong>
            </span>
          </div>

          {/* Short URL Container */}
          <div className="my-6">
            <label className="block text-xs font-medium text-[#a8998c] mb-2 font-sans">
              Shortened Destination URL
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2.5 bg-[#0b050d] rounded-2xl border border-[#2d1530]">
              <a
                href={result.short_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 font-mono text-base sm:text-lg font-bold text-[#e69880] hover:text-white truncate px-3 py-2 flex items-center gap-2 transition-colors"
              >
                <span className="truncate">{result.short_url}</span>
                <ExternalLink className="w-4 h-4 text-[#78675a] shrink-0" />
              </a>

              <div className="flex items-center gap-2 shrink-0">
                {/* QR Code Button */}
                <button
                  type="button"
                  onClick={() => setIsQrOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2a142e] hover:bg-[#3d1d42] text-white text-xs font-medium transition-colors cursor-pointer"
                  title="Generate QR Code"
                >
                  <QrCode className="w-4 h-4 text-[#e69880]" />
                  <span className="hidden sm:inline">QR Code</span>
                </button>

                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-white hover:bg-[#f2ebe1] text-[#0d0814] shadow-lg'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Original URL Reference */}
          <div className="pt-2 text-left">
            <span className="text-xs text-[#78675a] block mb-1">Original Destination:</span>
            <p className="text-xs text-[#b8a798] font-mono truncate bg-[#0e0610] p-3 rounded-xl border border-[#251229]">
              {originalUrl}
            </p>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      <QRModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        shortUrl={result.short_url}
        code={result.code}
      />
    </>
  );
};
