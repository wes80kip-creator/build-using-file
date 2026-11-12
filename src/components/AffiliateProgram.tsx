import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Share2,
  Copy,
  Check,
  DollarSign,
  Users,
  MousePointerClick,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Wallet,
  Calculator,
} from 'lucide-react';

export const AffiliateProgram: React.FC = () => {
  const { affiliateStats, formatPrice, requestAffiliatePayout, addToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState(affiliateStats.availableBalance);
  const [payoutMethod, setPayoutMethod] = useState<'M-Pesa' | 'PayPal' | 'Bank Transfer'>('M-Pesa');
  const [payoutAccount, setPayoutAccount] = useState('+254 712 345 678');
  const [calculatorVolume, setCalculatorVolume] = useState(25);

  const handleCopy = () => {
    navigator.clipboard?.writeText(affiliateStats.referralLink);
    setCopied(true);
    addToast('Referral Link Copied', 'Share your link to earn 15% recurring commissions!', 'affiliate');
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = requestAffiliatePayout(payoutAmount, payoutMethod, payoutAccount);
    if (success) {
      setIsPayoutModalOpen(false);
    }
  };

  const estimatedMonthlyCommission = Math.round(calculatorVolume * 150 * 0.15);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-teal-800/40 shadow-xl relative overflow-hidden">
        <div className="relative max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
            <Share2 className="w-3.5 h-3.5" />
            <span>GIGWORK SITE Affiliate Rewards Program</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Earn <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">15% Recurring Commission</span> on Every Gig, Job &amp; Membership
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Invite freelancers and businesses to GIGWORK SITE. Earn instant, automated commissions paid straight to your M-Pesa or PayPal on all their marketplace transactions.
          </p>

          {/* Referral Link Box */}
          <div className="pt-3 max-w-xl">
            <label className="block text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1.5">
              Your Exclusive Referral Link:
            </label>
            <div className="flex items-center bg-slate-950/80 border border-teal-500/40 rounded-xl p-1.5 shadow-md">
              <input
                type="text"
                readOnly
                value={affiliateStats.referralLink}
                className="w-full bg-transparent px-3 py-2 text-xs text-teal-200 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
            <Wallet className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatPrice(affiliateStats.availableBalance)}
          </div>
          <button
            onClick={() => {
              setPayoutAmount(affiliateStats.availableBalance);
              setIsPayoutModalOpen(true);
            }}
            disabled={affiliateStats.availableBalance <= 0}
            className="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Request Payout
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Referrals</span>
            <Users className="w-4 h-4 text-teal-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {affiliateStats.registeredUsers}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold mt-2">
            {affiliateStats.conversionRate}% conversion rate
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Clicks</span>
            <MousePointerClick className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {affiliateStats.totalClicks}
          </div>
          <span className="text-[11px] text-slate-400 font-medium mt-2">Organic partner traffic</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Lifetime Earned</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {formatPrice(affiliateStats.lifetimeEarnings)}
          </div>
          <span className="text-[11px] text-indigo-600 font-bold mt-2">
            Tier: {affiliateStats.tier}
          </span>
        </div>
      </div>

      {/* Interactive Calculator & Commission Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Earnings Simulator */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Commission Earnings Simulator</h3>
          </div>
          <p className="text-xs text-slate-600">
            Calculate your passive recurring income based on referred clients ordering gigs or purchasing memberships.
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Referred Active Clients per month:</span>
              <span className="text-teal-600 text-sm font-black">{calculatorVolume} referrals</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              value={calculatorVolume}
              onChange={e => setCalculatorVolume(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>5 clients</span>
              <span>100 clients</span>
              <span>200 clients</span>
            </div>
          </div>

          <div className="p-4 bg-teal-50/70 border border-teal-200/60 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                Estimated Monthly Earnings
              </span>
              <span className="text-2xl font-black text-teal-950">
                {formatPrice(estimatedMonthlyCommission)}
              </span>
            </div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-100/60 px-3 py-1.5 rounded-lg">
              Paid directly to M-Pesa or PayPal
            </span>
          </div>
        </div>

        {/* Tier Roadmap */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-base font-bold text-slate-900">Partner Tier Roadmap</h3>
          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Bronze Affiliate</span>
                <span className="text-slate-500 text-[11px]">1 - 10 active referrals</span>
              </div>
              <span className="font-extrabold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">5% Share</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Silver Partner</span>
                <span className="text-slate-500 text-[11px]">11 - 30 active referrals</span>
              </div>
              <span className="font-extrabold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">10% Share</span>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-300 flex items-center justify-between text-xs">
              <div>
                <span className="font-black text-teal-950 block">Gold Ambassador (Your Tier)</span>
                <span className="text-teal-700 text-[11px]">31+ active referrals</span>
              </div>
              <span className="font-black text-white bg-teal-600 px-2.5 py-0.5 rounded shadow-2xs">15% Share</span>
            </div>
          </div>
        </div>
      </div>

      {/* Referral Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Referral Commissions</h3>
          <span className="text-xs text-slate-400">Real-time ledger updates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Referred User</th>
                <th className="p-4">Action / Product</th>
                <th className="p-4">Order Value</th>
                <th className="p-4">Your 15% Cut</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {affiliateStats.recentReferrals.map(ref => (
                <tr key={ref.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono font-medium">{ref.user}</td>
                  <td className="p-4 font-semibold text-slate-900">{ref.action}</td>
                  <td className="p-4 font-bold">{formatPrice(ref.amount)}</td>
                  <td className="p-4 font-bold text-emerald-600">+{formatPrice(ref.commission)}</td>
                  <td className="p-4 text-slate-400">{ref.date}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ref.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ref.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Request Affiliate Payout</h3>
              <button
                onClick={() => setIsPayoutModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Withdrawal Amount ($ USD)
                </label>
                <input
                  type="number"
                  min="1"
                  max={affiliateStats.availableBalance}
                  value={payoutAmount}
                  onChange={e => setPayoutAmount(Number(e.target.value))}
                  className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-lg font-bold"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Available: {formatPrice(affiliateStats.availableBalance)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payout Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['M-Pesa', 'PayPal', 'Bank Transfer'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setPayoutMethod(m);
                        if (m === 'M-Pesa') setPayoutAccount('+254 712 345 678');
                        if (m === 'PayPal') setPayoutAccount('wes80kip@gmail.com');
                        if (m === 'Bank Transfer') setPayoutAccount('Equity Bank Acct #018029...');
                      }}
                      className={`p-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                        payoutMethod === m
                          ? 'border-teal-600 bg-teal-50 text-teal-800'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {payoutMethod === 'M-Pesa'
                    ? 'Safaricom Phone Number'
                    : payoutMethod === 'PayPal'
                    ? 'PayPal Email'
                    : 'Bank Account Details'}
                </label>
                <input
                  type="text"
                  value={payoutAccount}
                  onChange={e => setPayoutAccount(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Confirm Payout ({formatPrice(payoutAmount)})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
