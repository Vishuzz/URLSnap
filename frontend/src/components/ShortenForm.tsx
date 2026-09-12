import React, { useState } from 'react';
import { ArrowRight, Loader2, Link as LinkIcon, Clipboard } from 'lucide-react';

interface ShortenFormProps {
  onShorten: (url: string) => Promise<void>;
  loading: boolean;
}

export const ShortenForm: React.FC<ShortenFormProps> = ({ onShorten, loading }) => {
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState('');

  const validateUrl = (input: string): boolean => {
    const trimmed = input.trim();
    if (!trimmed) {
      setValidationError('Please enter a destination URL to shorten.');
      return false;
    }
    
    let target = trimmed;
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    try {
      new URL(target);
      setValidationError('');
      return true;
    } catch {
      setValidationError('Please enter a valid website URL (e.g. https://example.com)');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(url)) return;

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    await onShorten(targetUrl);
    setUrl('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        setValidationError('');
      }
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div id="shorten-form" className="w-full max-w-4xl mx-auto text-left pt-10 pb-16">
      {/* Hero Heading */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white font-normal leading-[1.1] mb-6 max-w-3xl">
        Give ambitious links <br className="hidden sm:inline" />
        a <em className="italic font-serif font-normal text-[#e69880]">calmer</em> way to turn <br className="hidden sm:inline" />
        ideas into short links.
      </h1>

      <p className="text-sm sm:text-base text-[#a8998c] max-w-xl mb-10 leading-relaxed font-sans">
        URLSnap keeps your destination URLs, Base62 codes, and database redirects in one considered space — with quiet intelligence that shows up when it earns its place.
      </p>

      {/* Main Shortener Input Box */}
      <div className="relative max-w-3xl">
        <form
          onSubmit={handleSubmit}
          className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 sm:p-3 rounded-2xl bg-[#1d0e22]/90 border border-[#3d2140] shadow-2xl backdrop-blur-xl"
        >
          <div className="relative flex-1 flex items-center">
            <div className="absolute left-4 text-[#8c7a6b] pointer-events-none">
              <LinkIcon className="w-5 h-5" />
            </div>

            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="Paste long URL (e.g. https://github.com/Vishuzz/Url-Shortner)"
              disabled={loading}
              className="w-full pl-12 pr-16 py-4 rounded-xl bg-[#0e0712] text-white placeholder-[#78695d] text-sm sm:text-base border border-[#2d1830] focus:border-[#e69880] focus:ring-2 focus:ring-[#e69880]/20 outline-none transition-all font-sans"
            />

            {!url && (
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 px-2.5 py-1 rounded-md bg-[#2a172c] hover:bg-[#3d2140] text-[#c9b8aa] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste</span>
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white hover:bg-[#f2ebe1] text-[#0d0814] font-semibold text-sm shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Shortening...</span>
              </>
            ) : (
              <>
                <span>Start for free</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Validation error */}
        {validationError && (
          <p className="mt-3 text-xs text-rose-400 flex items-center gap-1.5 animate-fade-in-up font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {validationError}
          </p>
        )}
      </div>

      {/* Preset helpers */}
      <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#8c7a6b] font-sans">
        <span>Quick samples:</span>
        <button
          type="button"
          onClick={() => {
            setUrl('https://github.com/Vishuzz/Url-Shortner');
            setValidationError('');
          }}
          className="text-[#e69880] hover:underline underline-offset-4 cursor-pointer"
        >
          GitHub Repository
        </button>
        <span>·</span>
        <button
          type="button"
          onClick={() => {
            setUrl('https://aws.amazon.com/ec2/autoscaling/');
            setValidationError('');
          }}
          className="text-[#e69880] hover:underline underline-offset-4 cursor-pointer"
        >
          AWS Auto Scaling Specs
        </button>
      </div>
    </div>
  );
};
