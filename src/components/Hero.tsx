import React from 'react';
import { Search, ShieldCheck, Zap, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { GigWorkLogo } from './GigWorkLogo';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  categories: string[];
  onOpenPostCourse?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  onOpenPostCourse,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background radial glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Search */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>GIGWORK SITE &bull; Official Digital Marketplace &bull; Since 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Hire Elite Talent.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Secure Escrow.
              </span>{' '}
              Fast Regional Payouts.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Connect with top developers, designers, AI engineers, and digital specialists. Pay effortlessly with{' '}
              <strong className="text-teal-300 font-semibold">M-Pesa (Kenya)</strong>,{' '}
              <strong className="text-cyan-300 font-semibold">PayPal</strong>, and{' '}
              <strong className="text-emerald-300 font-semibold">Stripe</strong> with 100% milestone escrow protection.
            </p>

            {/* Live Search input */}
            <div className="relative max-w-2xl">
              <div className="flex items-center bg-white rounded-xl shadow-2xl p-1.5 border border-slate-200 focus-within:ring-2 focus-within:ring-teal-400 transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Try 'React developer', 'M-Pesa integration', 'UI/UX design', 'AI agent'..."
                  className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  onClick={() => {}}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-lg shadow-sm transition-all shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Quick Popular Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Popular:</span>
              {[
                '✨ Life Skills',
                'M-Pesa Daraja',
                'Next.js & React',
                'Financial Literacy',
                'Figma UI/UX',
                'AI Prompting',
                'Executive Coaching',
              ].map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    const cleanTag = tag.replace('✨ ', '');
                    if (cleanTag === 'Life Skills') {
                      setSelectedCategory('Life Skills');
                    } else {
                      setSearchQuery(cleanTag);
                    }
                  }}
                  className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-teal-300 border border-slate-800 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Trust highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-left">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Escrow Protection</h4>
                  <p className="text-[11px] text-slate-400">Funds released only on approval</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Instant M-Pesa STK</h4>
                  <p className="text-[11px] text-slate-400">Direct phone prompt &amp; payouts</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">15% Affiliate Share</h4>
                  <p className="text-[11px] text-slate-400">Recurring partner commissions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Prominent GIGWORK SITE Brand Emblem & Metrics */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-md">
              <GigWorkLogo variant="hero" className="border-teal-500/20 shadow-teal-500/5 hover:border-teal-400/40 transition-colors" />

              {/* Stats Bar */}
              <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
                <div>
                  <div className="text-base sm:text-lg font-black text-white">45,000+</div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Freelancers</div>
                </div>
                <div className="border-x border-slate-800">
                  <div className="text-base sm:text-lg font-black text-emerald-400">$14.8M+</div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Paid Out</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-black text-cyan-400">99.8%</div>
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xs'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All Categories
            </button>
            {categories.map(cat => {
              const isLifeSkills = cat.toLowerCase() === 'life skills';
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-black shadow-xs'
                      : isLifeSkills
                      ? 'bg-teal-950/80 text-teal-300 hover:bg-teal-900 border border-teal-500/40 font-bold'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800 font-semibold'
                  }`}
                >
                  {isLifeSkills && <Sparkles className="w-3 h-3 text-teal-400" />}
                  <span>{cat}</span>
                  {isLifeSkills && !isSelected && (
                    <span className="text-[9px] bg-teal-500/20 text-teal-300 border border-teal-400/30 px-1.5 py-0.2 rounded-full uppercase font-bold">
                      Popular
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Life Skills Category Active Callout */}
          {selectedCategory.toLowerCase() === 'life skills' && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-teal-950/90 via-slate-900 to-teal-950/90 border border-teal-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white">
                    Looking to Teach or Publish a Life Skills Course?
                  </h4>
                  <p className="text-[11px] text-teal-300">
                    Register as an instructor on a paid creator tier (Starter $19, Pro $49, Enterprise $99) &bull; Keep 85%&ndash;95% revenue with instant M-Pesa STK &amp; Stripe.
                  </p>
                </div>
              </div>

              {onOpenPostCourse && (
                <button
                  onClick={onOpenPostCourse}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Post Life Skills Course &amp; View Tiers</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
