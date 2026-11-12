import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  Award,
  ShieldCheck,
  Zap,
  Check,
  PlusCircle,
  PlayCircle,
  Smartphone,
  CreditCard,
  Users,
  BarChart3,
  Share2,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface LifeSkillsPostCourseSectionProps {
  onOpenPostCourse: (tierId?: 'starter_creator' | 'pro_creator' | 'enterprise_creator', initialTitle?: string) => void;
  onNavigateToAcademy?: () => void;
}

const LIFE_SKILLS_TOPICS = [
  {
    title: 'Executive Communication & Public Speaking',
    desc: 'Pitching, boardroom presence, vocal delivery, and persuasion.',
    recommendedPrice: 49,
  },
  {
    title: 'Personal Financial Literacy & Wealth Habits',
    desc: 'Zero-based budgeting, tax optimization, index investing & passive cashflow.',
    recommendedPrice: 39,
  },
  {
    title: 'Emotional Intelligence (EQ) & Stress Mastery',
    desc: 'Somatic stress resets, conflict de-escalation & mental resilience.',
    recommendedPrice: 35,
  },
  {
    title: 'High-Stakes Negotiation & Value Pricing',
    desc: 'Harvard negotiation framework, closing enterprise contracts & retainers.',
    recommendedPrice: 45,
  },
  {
    title: 'Critical Thinking & Strategic Mental Models',
    desc: 'First principles, second-order thinking & rapid decision matrices.',
    recommendedPrice: 42,
  },
  {
    title: 'Time Management, Focus & High Performance',
    desc: 'Deep work protocols, boundary setting, and burnout prevention.',
    recommendedPrice: 30,
  },
];

export const LifeSkillsPostCourseSection: React.FC<LifeSkillsPostCourseSectionProps> = ({
  onOpenPostCourse,
  onNavigateToAcademy,
}) => {
  const { formatPrice, creatorSubscriptionTiers, user } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="bg-gradient-to-b from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 border border-teal-500/30 shadow-2xl mb-10 relative overflow-hidden text-left">
      {/* Background glow effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-teal-500/20">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Life Skills Category &bull; Creator &amp; Client Publishing Hub</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Post Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">Life Skills Course</span> on a Paid Creator Tier
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Are you a Life Skills Coach, Certified Financial Planner, Public Speaking Mentor, or Leadership Consultant? Monetize your expertise on GIGWORK SITE Academy. Keep <strong>up to 95% revenue payout</strong> with automated Lipa Na M-Pesa STK, Stripe card checkout, and accredited certificates.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenPostCourse('pro_creator')}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Life Skills Course</span>
          </button>

          {onNavigateToAcademy && (
            <button
              onClick={onNavigateToAcademy}
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Explore Life Skills Catalog</span>
            </button>
          )}
        </div>
      </div>

      {/* Billing Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-8 mb-6">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Applicable Creator Registration Tiers</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
              Escrow Guaranteed
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent pricing with zero hidden fees. Select a subscription pass to immediately activate course publishing privileges.
          </p>
        </div>

        {/* Monthly vs Annual Toggle */}
        <div className="inline-flex items-center gap-1 p-1 bg-slate-900/90 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              billingCycle === 'annual'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Registration Tiers Applicable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creatorSubscriptionTiers.map(tier => {
          const isPro = tier.id === 'pro_creator';
          const price = billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;

          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                isPro
                  ? 'bg-gradient-to-b from-slate-900/90 to-teal-950/80 border-teal-500/60 shadow-xl ring-2 ring-teal-500/20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-500 to-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-md">
                    Recommended for Coaches
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-white">{tier.name}</h4>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    {tier.revenueSharePercent}% Payout
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 min-h-[36px] leading-relaxed">
                  {tier.tagline}
                </p>

                <div className="my-5 pt-4 border-t border-slate-800">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-white">{formatPrice(price)}</span>
                    <span className="text-xs text-slate-400">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  <span className="text-[11px] text-teal-400 font-bold block mt-1">
                    Keep {tier.revenueSharePercent}% of every student registration
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  {tier.features.map((feat, fi) => (
                    <div key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onOpenPostCourse(tier.id)}
                className={`mt-6 w-full py-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  isPro
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <span>Select {tier.name} &amp; Post Course</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Components Included in the Life Skills Course System */}
      <div className="mt-12 pt-8 border-t border-teal-500/20">
        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block">
            End-To-End Infrastructure
          </span>
          <h3 className="text-lg font-black text-white mt-1">
            Life Skills Course Components &amp; Features Included
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Everything you need to deliver world-class personal development education without coding or setting up servers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 mb-2">
              <PlayCircle className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Full Video Curriculum Player</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Multi-module syllabus organizer, video auto-resume tracking, interactive chapter playlists, and mobile HD streaming.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-2">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Lipa Na M-Pesa STK + Cards</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Instant Safaricom M-Pesa push prompts for Kenyan students, alongside global Visa, Mastercard, and PayPal express payments.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-2">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Accredited QR Certificates</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Automatically generated, cryptographically verifiable certificates that students can download and share on LinkedIn and CVs.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Instructor Analytics &amp; Drop-off</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Track student enrollment velocity, lesson completion percentages, quiz scores, and net earnings payouts in real time.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Direct Escrow Payouts (12h-24h)</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Earnings are held in protected escrow and disbursed directly to your M-Pesa phone number or bank account without friction.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 mb-2">
              <Share2 className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">15% Affiliate Growth Network</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              45,000+ platform affiliates promote your course across social media and communities with automated attribution.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Course Topics Fast-Track */}
      <div className="mt-8 pt-6 border-t border-teal-500/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-300">
            High-Demand Life Skills Topics You Can Post:
          </span>
          <span className="text-[11px] text-teal-400 font-semibold hidden sm:inline">
            Click any topic to pre-fill your course template
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {LIFE_SKILLS_TOPICS.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => onOpenPostCourse('pro_creator', topic.title)}
              className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 rounded-xl text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                  {topic.title}
                </span>
                <span className="text-[10px] font-black text-emerald-400">
                  {formatPrice(topic.recommendedPrice)}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {topic.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
