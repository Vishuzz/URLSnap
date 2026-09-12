import React from 'react';

export const BentoGrid: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 my-16 space-y-12">
      {/* 3 Unhurried Steps Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#f5efe6] border border-[#e6dccf] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12 border-b border-[#e2d6c6] pb-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#8c7a6b] uppercase block mb-2">
              Simple Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#1c1613] leading-tight">
              Three unhurried steps <br className="hidden sm:inline" />
              from scattered to <em className="italic font-serif font-normal text-[#8c432d]">in flow</em>.
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6e6054] max-w-xs leading-relaxed">
            No complex setup or month-long onboarding. Instant Base62 encoding backed by AWS Auto Scaling and Multi-AZ MySQL.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 01 */}
          <div className="space-y-3">
            <span className="text-3xl font-serif text-[#b8a798] block">01</span>
            <h3 className="text-lg font-serif text-[#1c1613]">Bring your long URL</h3>
            <p className="text-xs text-[#6e6054] leading-relaxed">
              Paste any lengthy, complex destination link into the shortener input field.
            </p>
          </div>

          {/* Step 02 */}
          <div className="space-y-3">
            <span className="text-3xl font-serif text-[#b8a798] block">02</span>
            <h3 className="text-lg font-serif text-[#1c1613]">Shape it into a code</h3>
            <p className="text-xs text-[#6e6054] leading-relaxed">
              Go backend generates a unique 6-character Base62 collision-free hash code in milliseconds.
            </p>
          </div>

          {/* Step 03 */}
          <div className="space-y-3">
            <span className="text-3xl font-serif text-[#b8a798] block">03</span>
            <h3 className="text-lg font-serif text-[#1c1613]">Let the quiet help in</h3>
            <p className="text-xs text-[#6e6054] leading-relaxed">
              Share your short URL with one click or generate a high-res QR code for immediate distribution.
            </p>
          </div>
        </div>
      </div>

      {/* Quote + Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Quote Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#f5efe6] border border-[#e6dccf] flex flex-col justify-between shadow-sm">
          <blockquote className="text-xl sm:text-2xl font-serif text-[#1c1613] leading-snug mb-8">
            &ldquo;URLSnap is the first URL tool our whole team actually kept. The noise dropped — and within a week, the links simply got <em className="italic text-[#8c432d]">clearer</em>.&rdquo;
          </blockquote>
          <div>
            <p className="text-xs font-semibold text-[#1c1613]">Maya Dionisio</p>
            <p className="text-xs text-[#8c7a6b]">Head of Product, Northwind</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#f5efe6] border border-[#e6dccf] flex flex-col justify-between shadow-sm">
          <div className="grid grid-cols-3 gap-4 border-b border-[#e2d6c6] pb-8">
            <div>
              <span className="text-3xl sm:text-4xl font-serif text-[#1c1613] block">38%</span>
              <span className="text-[11px] text-[#8c7a6b]">Less time on links</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-serif text-[#1c1613] block">2×</span>
              <span className="text-[11px] text-[#8c7a6b]">Faster redirect resolution</span>
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-serif text-[#1c1613] block">12k</span>
              <span className="text-[11px] text-[#8c7a6b]">Active short links</span>
            </div>
          </div>

          <div className="pt-6">
            <h4 className="text-sm font-serif text-[#1c1613] mb-1">A single source of truth</h4>
            <p className="text-xs text-[#6e6054] leading-relaxed">
              Every link mapping is stored securely in Amazon RDS MySQL Multi-AZ, ensuring persistent access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
