import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, Download, QrCode } from 'lucide-react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortUrl: string;
  code: string;
}

export const QRModal: React.FC<QRModalProps> = ({ isOpen, onClose, shortUrl, code }) => {
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `urlsnap-qr-${code}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in-up">
      <div className="relative w-full max-w-sm p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-1">QR Code Preview</h3>
        <p className="text-xs text-slate-400 mb-6 truncate px-4">
          Scan to open: <span className="text-indigo-300">{shortUrl}</span>
        </p>

        {/* QR Canvas Container */}
        <div ref={qrRef} className="inline-block p-4 rounded-xl bg-white shadow-inner mb-6">
          <QRCodeCanvas
            value={shortUrl}
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>
      </div>
    </div>
  );
};
