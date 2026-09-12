import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0d0711] text-[#a8998c] border-t border-[#251229] mt-20">
      {/* Bottom CTA Sunset Card */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12">
        <div className="relative p-10 sm:p-16 rounded-3xl bg-sunset-bottom border border-[#3b1c3e] overflow-hidden text-left mb-16 shadow-2xl">
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl sm:text-5xl font-serif text-white leading-tight mb-6">
              Bring a little more <em className="italic font-serif font-normal text-[#e69880]">calm</em> <br />
              to how your team works.
            </h2>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#shorten-form"
                className="px-6 py-3 rounded-full bg-white hover:bg-[#f2ebe1] text-[#0d0711] text-xs font-semibold tracking-wide transition-all shadow-lg"
              >
                Start for free
              </a>
              <a
                href="#docs"
                className="px-6 py-3 rounded-full border border-[#4a244d] hover:border-[#6b356f] text-white text-xs font-medium transition-all"
              >
                View Documentation →
              </a>
            </div>

            <p className="text-[11px] text-[#78675a] mt-4">
              Free for small teams · No credit card required
            </p>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-8 border-t border-[#251229] text-xs">
          <div>
            <span className="font-serif text-lg text-white font-semibold block mb-2">URLSnap</span>
            <p className="text-[11px] text-[#78675a] leading-relaxed">
              The calm workspace where long URLs turn into quiet, elegant short links.
            </p>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3">Product</h5>
            <ul className="space-y-2 text-[#78675a]">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#architecture" className="hover:text-white transition-colors">AWS Architecture</a></li>
              <li><a href="#changelog" className="hover:text-white transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3">Company</h5>
            <ul className="space-y-2 text-[#78675a]">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Customers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-semibold mb-3">Resources</h5>
            <ul className="space-y-2 text-[#78675a]">
              <li><a href="#" className="hover:text-white transition-colors">Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Help Centre</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#1a0a1c] flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#5e5045] gap-4">
          <p>© 2026 URLSnap Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
