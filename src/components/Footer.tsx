import React from 'react';
import { GigWorkLogo } from './GigWorkLogo';
import { ShieldCheck, Heart, Globe, Lock, ArrowUpRight, Mail } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  onOpenDomainModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, onOpenDomainModal }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-left pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <GigWorkLogo variant="compact" theme="dark" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              GIGWORK SITE is the all-in-one digital marketplace empowering freelancers, micro-workers, and digital creators worldwide with high-demand gigs, remote jobs, and instant regional payouts.
            </p>

            <div className="flex flex-col gap-2.5 pt-1 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="https://www.gigworksite.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-teal-300 font-mono font-bold hover:underline"
                >
                  <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>https://www.gigworksite.com</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                {onOpenDomainModal && (
                  <button
                    onClick={onOpenDomainModal}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <span>Domain Hub</span>
                  </button>
                )}
              </div>

              <a
                href="mailto:info@gigworksite.com"
                className="inline-flex items-center gap-2 text-slate-300 hover:text-teal-300 transition-colors font-medium"
              >
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Support: info@gigworksite.com</span>
              </a>

              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Guaranteed Milestone Escrow &bull; Since 2026</span>
              </div>
            </div>
          </div>

          {/* Navigation Category 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('gigs')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Browse Freelance Gigs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('jobs')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Job Board &amp; Contracts
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('academy')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Digital Skills Academy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('memberships')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Membership Tiers &amp; Badges
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation Category 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Partner Programs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentTab('affiliate')}
                  className="hover:text-teal-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>15% Affiliate Program</span>
                  <span className="text-[9px] bg-teal-500/20 text-teal-300 px-1.5 py-0.2 rounded font-bold">
                    HOT
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Freelancer Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentTab('dashboard')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Client Hiring Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Payment Gateways Supported */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Payment Partners
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                  M
                </span>
                <span className="font-semibold text-white">Safaricom Lipa Na M-Pesa</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">
                  P
                </span>
                <span className="font-semibold text-white">PayPal Global Express</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px]">
                  S
                </span>
                <span className="font-semibold text-white">Stripe (Visa &amp; MC)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>&copy; 2026 GIGWORK SITE. All rights reserved.</span>
            <span>&bull;</span>
            <span className="text-teal-400 font-bold">SINCE 2026</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Escrow Protection Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
