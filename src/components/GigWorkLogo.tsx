import React from 'react';

interface GigWorkLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'hero';
  className?: string;
  theme?: 'dark' | 'light' | 'auto';
}

export const GigWorkLogo: React.FC<GigWorkLogoProps> = ({
  variant = 'compact',
  className = '',
  theme = 'auto',
}) => {
  // If icon only (the "GS" badge)
  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center font-black rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-md select-none overflow-hidden ${className || 'w-10 h-10'}`}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tighter text-lg font-black font-sans leading-none">
          GS
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-teal-500/10 to-transparent pointer-events-none" />
      </div>
    );
  }

  // Full Hero display matching user's exact uploaded image
  if (variant === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-950 border border-slate-800/80 shadow-2xl select-none ${className}`}>
        {/* Monogram GS */}
        <div className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 drop-shadow-[0_4px_24px_rgba(45,212,191,0.25)]">
          GS
        </div>

        {/* GIGWORK SITE */}
        <div className="mt-3 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[0.22em] text-teal-300 uppercase">
          GIGWORK SITE
        </div>

        {/* SINCE 2026 */}
        <div className="mt-2 text-xs sm:text-sm font-semibold tracking-[0.45em] text-cyan-400/90 uppercase">
          SINCE 2026
        </div>
      </div>
    );
  }

  // Compact navbar lockup
  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const subtitleColor = theme === 'dark' ? 'text-teal-400' : 'text-teal-600';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* GS Badge */}
      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800/90 flex items-center justify-center shadow-md shadow-teal-900/10 shrink-0">
        <span className="text-lg font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
          GS
        </span>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className={`text-lg font-black tracking-wider leading-none uppercase ${textColor}`}>
            GIGWORK <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">SITE</span>
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-widest">
            2026
          </span>
        </div>
        <span className={`text-[10px] font-bold tracking-[0.28em] uppercase mt-1 ${subtitleColor}`}>
          SINCE 2026
        </span>
      </div>
    </div>
  );
};
