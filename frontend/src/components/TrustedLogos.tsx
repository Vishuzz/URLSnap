import React from 'react';

export const TrustedLogos: React.FC = () => {
  const logos = [
    { name: 'Northwind', icon: '●' },
    { name: 'Lattice', icon: '✦' },
    { name: 'Cobalt', icon: '❖' },
    { name: 'Vireo', icon: '◆' },
    { name: 'Halcyon', icon: '⬢' },
    { name: 'Sable', icon: '▲' },
  ];

  return (
    <div className="w-full bg-[#f4eee6] border-y border-[#e6dccf] py-8 my-4">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-xs tracking-wider uppercase text-[#8c7e72] font-medium mb-6">
          Trusted by fast-moving product, design, and research teams
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-70">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 text-[#4a3f35] font-serif text-lg tracking-wide hover:opacity-100 transition-opacity cursor-default"
            >
              <span className="text-xs text-[#a39486]">{logo.icon}</span>
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
