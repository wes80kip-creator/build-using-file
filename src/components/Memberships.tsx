import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MembershipPackage, MembershipCategory } from '../types';
import { MembershipEnrollmentModal } from './MembershipEnrollmentModal';
import {
  Crown,
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  Building2,
  GraduationCap,
  Briefcase,
  Users,
  Award,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const Memberships: React.FC = () => {
  const { membershipPackages, formatPrice, user } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [selectedCategory, setSelectedCategory] = useState<'all' | MembershipCategory>('all');
  const [enrollModalPkg, setEnrollModalPkg] = useState<MembershipPackage | null>(null);

  const filteredPackages = membershipPackages.filter(pkg => {
    if (selectedCategory === 'all') return true;
    return pkg.category === selectedCategory;
  });

  const handleOpenEnrollment = (pkg: MembershipPackage) => {
    setEnrollModalPkg(pkg);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
      {/* Header */}
      <div className="max-w-3xl mx-auto space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-3.5 py-1 rounded-full uppercase tracking-wider border border-teal-200">
          <Crown className="w-3.5 h-3.5" /> GIGWORK SITE Membership Programs
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Keep More Of Your Hard-Earned Money &amp; Scale Faster
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Tailored membership categories for independent freelancers, hiring employers, digital agencies, and accredited universities &amp; educational institutions.
        </p>

        {/* Category Switcher Tabs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            All Categories ({membershipPackages.length})
          </button>
          <button
            onClick={() => setSelectedCategory('freelancer')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'freelancer'
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Freelancers &amp; Talent</span>
          </button>
          <button
            onClick={() => setSelectedCategory('client')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'client'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Clients &amp; Employers</span>
          </button>
          <button
            onClick={() => setSelectedCategory('institution')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'institution'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Universities, Bootcamps &amp; Agencies</span>
          </button>
        </div>

        {/* Billing Switcher */}
        <div className="pt-3 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-13 h-7 bg-slate-900 rounded-full p-1 transition-colors relative cursor-pointer"
            aria-label="Toggle annual billing"
          >
            <div
              className={`w-5 h-5 rounded-full bg-teal-400 transition-transform ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-slate-900' : 'text-slate-400'}`}>
              Annual Billing
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-left max-w-7xl mx-auto items-stretch">
        {filteredPackages.map(pkg => {
          const isCurrent = user.membershipTier === pkg.id;
          const displayPrice =
            pkg.monthlyPrice === 0
              ? 0
              : billingCycle === 'annual'
              ? pkg.annualPrice
              : pkg.monthlyPrice;

          return (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                pkg.popular
                  ? 'border-2 border-teal-500 shadow-2xl scale-102 ring-4 ring-teal-500/10'
                  : 'border border-slate-200 shadow-sm hover:shadow-lg'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-widest shadow-xs">
                    {pkg.category === 'institution' ? 'Most Popular for Academics' : 'Most Popular'}
                  </span>
                </div>
              )}

              <div>
                {/* Header Category & Badge */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {pkg.category === 'institution'
                      ? 'Institutional Track'
                      : pkg.category === 'client'
                      ? 'Employer Track'
                      : 'Talent Track'}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    {pkg.badge}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mt-2">{pkg.name}</h3>

                <p className="text-xs text-slate-500 min-h-[36px] leading-relaxed mt-1">
                  {pkg.tagline}
                </p>

                {/* Price Display */}
                <div className="my-5 pb-5 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900">
                      {pkg.monthlyPrice === 0 ? 'Free' : formatPrice(displayPrice)}
                    </span>
                    {pkg.monthlyPrice > 0 && (
                      <span className="text-xs font-semibold text-slate-500">
                        {billingCycle === 'annual' ? ' /year' : ' /month'}
                      </span>
                    )}
                  </div>

                  {/* Highlights tag */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs font-semibold text-teal-700">
                    {typeof pkg.platformFeePercent === 'number' && pkg.platformFeePercent > 0 && (
                      <span className="inline-flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded">
                        <Sparkles className="w-3 h-3 text-teal-600" />
                        {pkg.platformFeePercent}% Platform Fee
                      </span>
                    )}
                    {pkg.bidsPerMonth && pkg.bidsPerMonth !== 'N/A' && (
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {pkg.bidsPerMonth} Bids/mo
                      </span>
                    )}
                    {pkg.teamSeats && (
                      <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-bold">
                        {pkg.teamSeats} {typeof pkg.teamSeats === 'number' ? 'Seat' + (pkg.teamSeats > 1 ? 's' : '') : 'Seats'}
                      </span>
                    )}
                  </div>

                  {pkg.requiresInstitutionDetails && (
                    <div className="mt-2 text-[11px] text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Supports Institutional PO &amp; University Invoicing</span>
                    </div>
                  )}
                </div>

                {/* Features list */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Tier Privileges &amp; Features:
                  </span>
                  {pkg.features.map(feat => (
                    <div key={feat} className="flex items-start gap-2 text-xs text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Fully Clickable & Enabled for All Packages! */}
              <div className="pt-6 mt-4 border-t border-slate-100">
                {isCurrent ? (
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleOpenEnrollment(pkg)}
                      className="w-full py-3 px-4 rounded-xl font-black text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Active Tier (View / Update Credentials)</span>
                    </button>
                    <span className="text-[10px] text-slate-400 text-center block">
                      Currently applied to your profile
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenEnrollment(pkg)}
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-teal-500/25 ring-2 ring-teal-400/50'
                        : pkg.category === 'institution'
                        ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {pkg.monthlyPrice === 0
                        ? 'Enroll Free Now'
                        : pkg.requiresInstitutionDetails
                        ? `Enroll Institution (${pkg.name})`
                        : `Enroll in ${pkg.name}`}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                )}

                <span className="text-[10px] text-slate-400 text-center block mt-2">
                  {pkg.requiresInstitutionDetails
                    ? 'Supports M-Pesa, Card, PayPal & Official Institutional PO'
                    : 'Supports M-Pesa, Card, PayPal & Wallet Balance'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* INSTITUTIONAL & ACADEMIC COLLABORATION BANNER */}
      <div className="mt-16 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 rounded-3xl p-8 sm:p-10 text-white text-left relative overflow-hidden shadow-2xl border border-teal-500/20">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-teal-400" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-teal-500/30">
            <Building2 className="w-3.5 h-3.5" /> Academic &amp; Enterprise Institutional Partnership Program
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Connecting Universities, Colleges &amp; Bootcamps Directly to Global Employers
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            GIGWORK SITE empowers accredited educational institutions, technical vocational colleges (TVETs), coding academies, and creative agencies to register student cohorts in bulk. Enrolled students gain immediate industry visibility with the verified <strong>&quot;Campus Graduate Talent&quot;</strong> badge, live escrow milestone projects, and direct employer talent pipelines.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 text-xs">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <GraduationCap className="w-6 h-6 text-teal-400 mb-2" />
              <h4 className="font-bold text-white mb-1">50 to 500+ Student Seats</h4>
              <p className="text-slate-300 text-[11px]">
                Bulk enroll graduating classes with custom verification and portfolio showcases.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <FileCheck2 className="w-6 h-6 text-emerald-400 mb-2" />
              <h4 className="font-bold text-white mb-1">Institutional PO Invoicing</h4>
              <p className="text-slate-300 text-[11px]">
                Support for University Purchase Orders, Net-30 invoice terms, and corporate bank wires.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <Award className="w-6 h-6 text-amber-400 mb-2" />
              <h4 className="font-bold text-white mb-1">Campus Placement Dashboard</h4>
              <p className="text-slate-300 text-[11px]">
                Track student earnings, completed milestones, ratings, and job placement analytics in real time.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const academicPkg = membershipPackages.find(p => p.id === 'institution_academic');
                if (academicPkg) handleOpenEnrollment(academicPkg);
              }}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>Enroll Your Institution / College Now</span>
            </button>
            <a
              href="mailto:info@gigworksite.com?subject=Institutional%20Partnership%20Inquiry%20-%20GIGWORK%20SITE"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-2"
            >
              <span>Contact Academic Relations (info@gigworksite.com)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Membership Enrollment Modal */}
      <MembershipEnrollmentModal
        pkg={enrollModalPkg}
        isOpen={Boolean(enrollModalPkg)}
        onClose={() => setEnrollModalPkg(null)}
        initialBillingCycle={billingCycle}
      />
    </div>
  );
};
