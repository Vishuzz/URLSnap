import React, { useState } from 'react';
import { X, Copy, Check, BookOpen, Server, Shield } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // Fallback
    }
  };

  const curlShorten = `curl -i -X POST http://url-shortener-alb-756938069.ap-south-1.elb.amazonaws.com/shorten \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://github.com/google"}'`;

  const curlRedirect = `curl -i http://url-shortener-alb-756938069.ap-south-1.elb.amazonaws.com/roDWNQ`;

  const curlHealth = `curl -i http://url-shortener-alb-756938069.ap-south-1.elb.amazonaws.com/health`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0d0711]/85 backdrop-blur-md animate-fade-in-up">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#140b1a] border border-[#3d1c3e] rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2d1530] bg-[#0b050f]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#2e1730] text-[#e69880]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-white">URLSnap API & System Documentation</h2>
              <p className="text-xs text-[#a8998c]">RESTful endpoints, JSON schemas & environment specification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#a8998c] hover:text-white hover:bg-[#28132b] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-xs sm:text-sm text-[#d4c3b5]">
          {/* Base URL info */}
          <div className="p-4 rounded-2xl bg-[#0a040c] border border-[#2d1530] flex items-center gap-3">
            <Server className="w-5 h-5 text-[#e69880] shrink-0" />
            <div>
              <span className="text-xs text-[#8c7a6b] block">Production API Endpoint</span>
              <span className="text-xs sm:text-sm font-mono text-[#e69880]">
                http://url-shortener-alb-756938069.ap-south-1.elb.amazonaws.com
              </span>
            </div>
          </div>

          {/* Endpoint 1: POST /shorten */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                POST
              </span>
              <span className="font-mono text-white text-base font-semibold">/shorten</span>
              <span className="text-xs text-[#8c7a6b]">— Generates Base62 short code</span>
            </div>

            <p className="text-xs text-[#a8998c] leading-relaxed">
              Accepts a long URL JSON payload, generates a unique 6-character collision-resistant hash code, and saves the mapping into Amazon RDS MySQL.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#09040b] border border-[#251227]">
                <span className="text-xs font-mono text-[#8c7a6b] block mb-2">Request Body (JSON)</span>
                <pre className="font-mono text-xs text-[#e69880] overflow-x-auto">
{`{
  "url": "https://github.com/google"
}`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-[#09040b] border border-[#251227]">
                <span className="text-xs font-mono text-[#8c7a6b] block mb-2">Response (201 Created)</span>
                <pre className="font-mono text-xs text-emerald-400 overflow-x-auto">
{`{
  "code": "roDWNQ",
  "short_url": "http://<alb-dns>/roDWNQ"
}`}
                </pre>
              </div>
            </div>

            {/* cURL snippet */}
            <div className="relative p-3 rounded-xl bg-[#050207] border border-[#251227]">
              <button
                onClick={() => handleCopy(curlShorten, 1)}
                className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#251227] hover:bg-[#3b1c3e] text-xs text-[#d4c3b5] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 1 ? 'Copied' : 'Copy cURL'}</span>
              </button>
              <pre className="font-mono text-xs text-[#b8a798] overflow-x-auto pr-24 whitespace-pre-wrap">
                {curlShorten}
              </pre>
            </div>
          </div>

          <hr className="border-[#251227]" />

          {/* Endpoint 2: GET /{code} */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-400 font-mono text-xs font-bold">
                GET
              </span>
              <span className="font-mono text-white text-base font-semibold">/&#123;code&#125;</span>
              <span className="text-xs text-[#8c7a6b]">— Resolves short code & redirects</span>
            </div>

            <p className="text-xs text-[#a8998c] leading-relaxed">
              Looks up the short code in the database, increments the click counter atomically, and returns a HTTP 302 Found redirect to the destination URL.
            </p>

            <div className="relative p-3 rounded-xl bg-[#050207] border border-[#251227]">
              <button
                onClick={() => handleCopy(curlRedirect, 2)}
                className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#251227] hover:bg-[#3b1c3e] text-xs text-[#d4c3b5] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedIndex === 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 2 ? 'Copied' : 'Copy cURL'}</span>
              </button>
              <pre className="font-mono text-xs text-[#b8a798] overflow-x-auto pr-24 whitespace-pre-wrap">
                {curlRedirect}
              </pre>
            </div>
          </div>

          <hr className="border-[#251227]" />

          {/* Endpoint 3: GET /health */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-purple-500/20 text-purple-400 font-mono text-xs font-bold">
                GET
              </span>
              <span className="font-mono text-white text-base font-semibold">/health</span>
              <span className="text-xs text-[#8c7a6b]">— ALB Healthcheck endpoint</span>
            </div>

            <p className="text-xs text-[#a8998c] leading-relaxed">
              Used by AWS Application Load Balancer to check system health. Returns HTTP 200 OK status along with database connectivity status.
            </p>

            <div className="relative p-3 rounded-xl bg-[#050207] border border-[#251227]">
              <button
                onClick={() => handleCopy(curlHealth, 3)}
                className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#251227] hover:bg-[#3b1c3e] text-xs text-[#d4c3b5] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedIndex === 3 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIndex === 3 ? 'Copied' : 'Copy cURL'}</span>
              </button>
              <pre className="font-mono text-xs text-[#b8a798] overflow-x-auto pr-24 whitespace-pre-wrap">
                {curlHealth}
              </pre>
            </div>
          </div>

          <hr className="border-[#251227]" />

          {/* Environment Variables Reference */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#e69880]" />
              Environment Variables Configuration
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse">
                <thead>
                  <tr className="border-b border-[#2d1530] text-[#8c7a6b] text-left">
                    <th className="py-2 pr-4">Variable Name</th>
                    <th className="py-2 pr-4">Description</th>
                    <th className="py-2">Default / Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f0d22] text-[#d4c3b5]">
                  <tr>
                    <td className="py-2 pr-4 text-[#e69880]">PORT</td>
                    <td className="py-2 pr-4">Go HTTP listener port</td>
                    <td className="py-2">8080</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-[#e69880]">BASE_URL</td>
                    <td className="py-2 pr-4">Host URL for generated short links</td>
                    <td className="py-2">http://&lt;alb-dns-name&gt;</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-[#e69880]">DB_HOST</td>
                    <td className="py-2 pr-4">Amazon RDS MySQL Host Address</td>
                    <td className="py-2">url-shortener-rds.c9wuq...rds.amazonaws.com</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-[#e69880]">VITE_API_BASE_URL</td>
                    <td className="py-2 pr-4">Frontend API endpoint target</td>
                    <td className="py-2">http://localhost:8080</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2d1530] bg-[#0b050f] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white hover:bg-[#f2ebe1] text-[#0d0814] text-xs font-semibold transition-all cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
