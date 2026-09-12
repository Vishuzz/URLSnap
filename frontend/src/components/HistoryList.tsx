import React, { useState } from 'react';
import { History, Copy, Check, Trash2, ArrowUpRight } from 'lucide-react';
import type { HistoryItem } from '../types';

interface HistoryListProps {
  items: HistoryItem[];
  onClear: () => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ items, onClear }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (items.length === 0) return null;

  const handleCopy = async (id: string, shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div id="history" className="w-full max-w-6xl mx-auto my-16 animate-fade-in-up">
      <div className="p-8 sm:p-10 rounded-3xl bg-[#f5efe6] border border-[#e6dccf] shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e2d6c6]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#eae2d5] text-[#8c432d]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-[#1c1613]">Recent Shortened Links</h3>
              <p className="text-xs text-[#8c7a6b]">Your recently generated short URL sessions</p>
            </div>
            <span className="ml-2 px-2.5 py-0.5 rounded-full bg-[#eae2d5] text-xs font-mono text-[#6e6054]">
              {items.length}
            </span>
          </div>

          <button
            onClick={onClear}
            className="text-xs text-[#8c7a6b] hover:text-rose-600 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-[#faf7f2] border border-[#e8dfd3] hover:border-[#d9cca8] transition-all group shadow-2xs"
            >
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm font-bold text-[#8c432d] hover:text-[#5a281a] flex items-center gap-1 truncate"
                  >
                    <span>{item.shortUrl}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#a8998c] group-hover:text-[#8c432d] transition-colors shrink-0" />
                  </a>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#eee7dc] text-[#6e6054]">
                    {item.code}
                  </span>
                </div>
                <p className="text-xs text-[#78695d] truncate font-mono">
                  {item.originalUrl}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#eee7dc]">
                <span className="text-xs text-[#9e8f82] font-mono">
                  {item.createdAt}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(item.id, item.shortUrl)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    copiedId === item.id
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#1c1613] hover:bg-[#332a24] text-white'
                  }`}
                  title="Copy short link"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
