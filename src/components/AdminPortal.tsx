import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Users,
  CreditCard,
  Scale,
  Settings,
  Layers,
  DollarSign,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  Lock,
  Radio,
  FileText,
  BadgeCheck,
  ArrowRight,
  TrendingUp,
  Percent,
  Sliders,
  Send,
  Zap,
  BarChart3,
  Banknote,
  Building2,
  Download,
  CheckCircle,
  Calendar,
  ArrowDownRight,
  Receipt,
  KeyRound,
  Coins,
  PieChart,
  Printer,
  X,
  Globe,
  Cloud,
  Server,
  Code2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import {
  User,
  Dispute,
  GatewaySettings,
  RevenueRecord,
  RevenueStreamType,
  AdminWithdrawalRecord,
  AdminWithdrawalMethod,
} from '../types';

export const AdminPortal: React.FC = () => {
  const {
    formatPrice,
    convertPrice,
    currency,
    user,
    orders,
    services,
    jobs,
    allUsers,
    updateUserBadge,
    toggleUserSuspension,
    adjustUserBalance,
    disputes,
    resolveDispute,
    gatewaySettings,
    updateGatewaySettings,
    platformFeeSettings,
    updatePlatformFeeSettings,
    auditLogs,
    addAuditLog,
    affiliateStats,
    approveAffiliatePayout,
    toggleServiceFeature,
    removeService,
    removeJob,
    addToast,
    revenueRecords,
    adminWithdrawals,
    treasuryStats,
    requestAdminWithdrawal,
    approveAdminWithdrawal,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'revenue' | 'withdrawals' | 'users' | 'escrow' | 'gateways' | 'fees' | 'moderation' | 'payouts' | 'logs' | 'domain'
  >('overview');

  // Revenue tracking state
  const [revenueFilter, setRevenueFilter] = useState<'all' | RevenueStreamType>('all');
  const [revenueSearch, setRevenueSearch] = useState('');

  // Admin withdrawal portal state
  const [withdrawAmount, setWithdrawAmount] = useState(2500);
  const [withdrawMethod, setWithdrawMethod] = useState<AdminWithdrawalMethod>('M-Pesa Business (B2C)');
  const [withdrawAccount, setWithdrawAccount] = useState('Safaricom Paybill 174379 / Acc: 0712345678 (Chief Treasury)');
  const [adminPin, setAdminPin] = useState('');
  const [withdrawNotes, setWithdrawNotes] = useState('Executive corporate profit withdrawal');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<AdminWithdrawalRecord | null>(null);

  // User search/filter
  const [userSearch, setUserSearch] = useState('');
  const [selectedUserFilter, setSelectedUserFilter] = useState<'all' | 'freelancer' | 'client' | 'admin'>('all');

  // Gateway form state
  const [mpesaShortcode, setMpesaShortcode] = useState(gatewaySettings.mpesa.shortcode);
  const [mpesaEnv, setMpesaEnv] = useState<'sandbox' | 'production'>(gatewaySettings.mpesa.env);
  const [mpesaPasskey, setMpesaPasskey] = useState(gatewaySettings.mpesa.passkey);
  const [stripeKey, setStripeKey] = useState(gatewaySettings.stripe.publishableKey);
  const [paypalId, setPaypalId] = useState(gatewaySettings.paypal.clientId);

  // Fee state
  const [standardFee, setStandardFee] = useState(platformFeeSettings.standardFee);
  const [proFee, setProFee] = useState(platformFeeSettings.proFee);
  const [agencyFee, setAgencyFee] = useState(platformFeeSettings.agencyFee);
  const [affiliateRate, setAffiliateRate] = useState(platformFeeSettings.affiliateCommissionRate);
  const [announcement, setAnnouncement] = useState(platformFeeSettings.announcementBanner);
  const [maintenanceMode, setMaintenanceMode] = useState(platformFeeSettings.maintenanceMode);

  // Simulation test STK
  const [testPhone, setTestPhone] = useState('254712345678');
  const [testStkStatus, setTestStkStatus] = useState<string | null>(null);

  const handleTestStk = (e: React.FormEvent) => {
    e.preventDefault();
    setTestStkStatus('Pinging Safaricom Daraja API...');
    setTimeout(() => {
      setTestStkStatus('STK Push dispatched successfully! Response: [200 OK - MerchantRequestID: 88129-33019]');
      addToast('M-Pesa Test Ping', `Simulated STK Push sent to ${testPhone}`, 'payment');
      addAuditLog('MPESA_DARAYA_TEST', `Phone: ${testPhone}`, 'Dispatched sandbox ping');
    }, 1200);
  };

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    updateGatewaySettings({
      mpesa: {
        ...gatewaySettings.mpesa,
        shortcode: mpesaShortcode,
        env: mpesaEnv,
        passkey: mpesaPasskey,
      },
      stripe: {
        ...gatewaySettings.stripe,
        publishableKey: stripeKey,
      },
      paypal: {
        ...gatewaySettings.paypal,
        clientId: paypalId,
      },
    });
  };

  const handleSaveFees = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformFeeSettings({
      standardFee,
      proFee,
      agencyFee,
      affiliateCommissionRate: affiliateRate,
      announcementBanner: announcement,
      maintenanceMode,
    });
  };

  const filteredUsers = allUsers.filter(u => {
    const matchesFilter = selectedUserFilter === 'all' || u.role === selectedUserFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.title.toLowerCase().includes(userSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPlatformEscrow = orders.reduce(
    (acc, o) => (o.escrowStatus === 'held_in_escrow' ? acc + o.amount : acc),
    34500
  );

  const handleSelectWithdrawMethod = (method: AdminWithdrawalMethod) => {
    setWithdrawMethod(method);
    switch (method) {
      case 'M-Pesa Business (B2C)':
        setWithdrawAccount('Safaricom Paybill 174379 / Acc: 0712345678 (Chief Treasury)');
        break;
      case 'Corporate Bank Wire (USD/KES)':
        setWithdrawAccount('Standard Chartered Bank Kenya / Acct #01080291847 / Swift: SCBLKENX (USD Corporate)');
        break;
      case 'PayPal Corporate':
        setWithdrawAccount('treasury@gigworksite.com (Verified Corporate Treasury)');
        break;
      case 'Stripe Treasury Connect':
        setWithdrawAccount('acct_1M6xyzPlatformTreasury (Direct Corporate Debit)');
        break;
    }
  };

  const currentWithdrawalFee =
    withdrawMethod === 'Corporate Bank Wire (USD/KES)'
      ? 25
      : withdrawMethod === 'PayPal Corporate'
      ? 15
      : withdrawMethod === 'Stripe Treasury Connect'
      ? 10
      : 0;

  const netWithdrawalAmount = Math.max(0, withdrawAmount - currentWithdrawalFee);

  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPin || adminPin.trim().length < 4) {
      addToast('PIN Required', 'Please enter your 4-digit Master Admin PIN (e.g. 1234) to authorize treasury disbursement.', 'payment');
      return;
    }
    if (withdrawAmount <= 0) {
      addToast('Invalid Amount', 'Please specify a disbursement amount greater than $0.', 'payment');
      return;
    }
    if (withdrawAmount > treasuryStats.availableProfits) {
      addToast('Exceeds Treasury Balance', `Amount cannot exceed available profits of ${formatPrice(treasuryStats.availableProfits)}.`, 'payment');
      return;
    }
    setIsProcessingWithdrawal(true);
    setTimeout(() => {
      const ok = requestAdminWithdrawal(withdrawAmount, withdrawMethod, withdrawAccount, withdrawNotes);
      setIsProcessingWithdrawal(false);
      if (ok) {
        setAdminPin('');
        const newlyCreated: AdminWithdrawalRecord = {
          id: `wd_${Date.now()}`,
          reference: `ADM-WD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: withdrawAmount,
          method: withdrawMethod,
          accountDetails: withdrawAccount,
          status: 'completed',
          requestedAt: new Date().toISOString(),
          processedAt: new Date().toISOString(),
          approvedBy: user.name || 'Alexandre Mercer (Chief Admin)',
          fee: currentWithdrawalFee,
          netAmount: netWithdrawalAmount,
          notes: withdrawNotes,
        };
        setSelectedVoucher(newlyCreated);
      }
    }, 1200);
  };

  const totalMarketplaceFees = revenueRecords
    .filter(r => r.stream === 'marketplace_fee')
    .reduce((sum, r) => sum + r.netFee, 0);

  const totalSubscriptions = revenueRecords
    .filter(r => r.stream === 'membership_subscription')
    .reduce((sum, r) => sum + r.netFee, 0);

  const totalAcademyRevenue = revenueRecords
    .filter(r => r.stream === 'academy_sales')
    .reduce((sum, r) => sum + r.netFee, 0);

  const totalEscrowSurcharges = revenueRecords
    .filter(r => r.stream === 'escrow_protection_fee')
    .reduce((sum, r) => sum + r.netFee, 0);

  const totalListingPromotions = revenueRecords
    .filter(r => r.stream === 'listing_promotion')
    .reduce((sum, r) => sum + r.netFee, 0);

  const totalComputedNetRevenue = revenueRecords.reduce((sum, r) => sum + r.netFee, 0);

  const filteredRevenueRecords = revenueRecords.filter(r => {
    const matchesFilter = revenueFilter === 'all' || r.stream === revenueFilter;
    const matchesSearch =
      r.source.toLowerCase().includes(revenueSearch.toLowerCase()) ||
      r.referenceNumber.toLowerCase().includes(revenueSearch.toLowerCase()) ||
      r.gateway.toLowerCase().includes(revenueSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left space-y-6">
      {/* Admin Title & System Status Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>GIGWORK SITE &bull; Central Control &amp; Operations Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Platform Administration &amp; Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Live revenue generation tracking, executive profit withdrawal portal, Safaricom Daraja M-Pesa management, and escrow vault arbitration.
          </p>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs space-y-2 shrink-0 z-10">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Environment:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              PROD (www.gigworksite.com)
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Net Available Profits:</span>
            <span className="font-bold text-emerald-400">{formatPrice(treasuryStats.availableProfits)}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Escrow Reserve:</span>
            <span className="font-bold text-teal-400">{formatPrice(totalPlatformEscrow)}</span>
          </div>
          <button
            onClick={() => setActiveAdminTab('withdrawals')}
            className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-md hover:shadow-emerald-500/20 cursor-pointer group"
          >
            <Banknote className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
            <span>Withdraw Treasury Profits</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto text-slate-950/80 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Admin Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {[
          { id: 'overview', label: 'Telemetry & Stats', icon: TrendingUp },
          { id: 'revenue', label: 'Revenue Tracking', icon: BarChart3, badge: 'LIVE' },
          { id: 'withdrawals', label: 'Treasurer Panel', icon: Banknote, badge: 'TREASURY' },
          { id: 'users', label: 'Users & KYC', icon: Users, count: allUsers.length },
          { id: 'escrow', label: 'Escrow & Disputes', icon: Scale, count: disputes.filter(d => d.status !== 'resolved').length },
          { id: 'gateways', label: 'Payment Gateways', icon: CreditCard },
          { id: 'fees', label: 'Fees & Platform Controls', icon: Sliders },
          { id: 'moderation', label: 'Catalog Moderation', icon: Layers },
          { id: 'payouts', label: 'Affiliate Payouts', icon: DollarSign, count: affiliateStats.payoutHistory.filter(p => p.status === 'processing').length },
          { id: 'logs', label: 'Audit Trail', icon: FileText },
          { id: 'domain', label: 'Domain & Olitt (gigworksite.com)', icon: Globe, badge: 'PROD' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {'badge' in tab && tab.badge && (
                <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                  isActive ? 'bg-teal-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {tab.badge}
                </span>
              )}
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-teal-500 text-slate-950' : 'bg-slate-100 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Telemetry */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Gross Platform GMV
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatPrice(148200)}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">+18.2% vs last month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Secured Escrow Vault
              </span>
              <span className="text-2xl sm:text-3xl font-black text-teal-600">
                {formatPrice(totalPlatformEscrow)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Held across {orders.length} orders</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Platform Commission Earned
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                {formatPrice(11480)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Average 6.8% effective take rate</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Member Community
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                45,120
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">99.8% verification score</span>
            </div>
          </div>

          {/* Real-Time Payment Gateway Health Status */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Real-Time Integration &amp; Gateway Telemetry</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      M
                    </span>
                    <span className="font-bold text-xs text-slate-900">Safaricom Daraja 2.0</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    OPERATIONAL
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>ShortCode:</span>
                    <span className="font-mono text-slate-800 font-semibold">{gatewaySettings.mpesa.shortcode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span className="text-emerald-600 font-bold">118ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STK Success Rate:</span>
                    <span className="text-emerald-600 font-bold">99.8%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                      S
                    </span>
                    <span className="font-bold text-xs text-slate-900">Stripe Payments &amp; 3DS</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    OPERATIONAL
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="text-slate-800 font-semibold">{gatewaySettings.stripe.liveMode ? 'Live 3DS' : 'Test'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Webhook Pipeline:</span>
                    <span className="text-emerald-600 font-bold">Active (0 failed)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dispute Rate:</span>
                    <span className="text-emerald-600 font-bold">0.01% (Safe)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      P
                    </span>
                    <span className="font-bold text-xs text-slate-900">PayPal Express Orders</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    OPERATIONAL
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Auto-Capture:</span>
                    <span className="text-slate-800 font-semibold">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Settlement Delay:</span>
                    <span className="text-slate-800 font-semibold">Instant Escrow</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Currency Support:</span>
                    <span className="text-emerald-600 font-bold">USD, EUR, GBP, KES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Treasury Status & Rapid Payout Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 border border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold tracking-wide uppercase">
                <Banknote className="w-3.5 h-3.5" />
                <span>Treasurer Control &amp; Profit Disbursement</span>
              </div>
              <h4 className="text-lg font-black tracking-tight text-white">
                Net Available Profits for Payout: <span className="text-emerald-400">{formatPrice(treasuryStats.availableProfits)}</span>
              </h4>
              <p className="text-xs text-slate-300 max-w-xl">
                Accrued from settled marketplace commissions, tier enrollments, and escrow fees. Direct payout available via M-Pesa B2C, Wire, or PayPal.
              </p>
            </div>
            <button
              onClick={() => setActiveAdminTab('withdrawals')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Banknote className="w-4 h-4" />
              <span>Open Treasurer Panel &amp; Withdraw</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab: Revenue Tracking */}
      {activeAdminTab === 'revenue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide uppercase mb-2">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Real-Time Platform Revenue Generation</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Marketplace Revenue Streams &amp; Financial Ledger
                </h3>
                <p className="text-xs text-slate-500 max-w-xl mt-1">
                  Granular multi-channel revenue monitoring across service sales, premium subscriptions, escrow arbitration fees, and academy modules.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setActiveAdminTab('withdrawals')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Banknote className="w-4 h-4" />
                  <span>Treasurer Withdrawal ({formatPrice(treasuryStats.availableProfits)})</span>
                </button>
              </div>
            </div>

            {/* Revenue Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="p-4 rounded-2xl bg-slate-900 text-white col-span-2 lg:col-span-2 border border-slate-800 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Total Platform Net Revenue
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {formatPrice(totalComputedNetRevenue)}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">100% reconciled &amp; settled</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Marketplace Fees
                </span>
                <span className="text-lg font-black text-slate-900">
                  {formatPrice(totalMarketplaceFees)}
                </span>
                <span className="text-[10px] text-teal-600 font-semibold block mt-1">Standard 10% / Pro 5%</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Subscriptions
                </span>
                <span className="text-lg font-black text-slate-900">
                  {formatPrice(totalSubscriptions)}
                </span>
                <span className="text-[10px] text-teal-600 font-semibold block mt-1">Tiers &amp; Institutions</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Escrow Fees
                </span>
                <span className="text-lg font-black text-slate-900">
                  {formatPrice(totalEscrowSurcharges)}
                </span>
                <span className="text-[10px] text-teal-600 font-semibold block mt-1">2% buyer protection</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Academy &amp; Promos
                </span>
                <span className="text-lg font-black text-slate-900">
                  {formatPrice(totalAcademyRevenue + totalListingPromotions)}
                </span>
                <span className="text-[10px] text-teal-600 font-semibold block mt-1">Masterclass &amp; Ads</span>
              </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All Streams' },
                  { id: 'marketplace_fee', label: 'Marketplace Fees' },
                  { id: 'membership_subscription', label: 'Memberships' },
                  { id: 'escrow_protection_fee', label: 'Escrow Fees' },
                  { id: 'academy_sales', label: 'Academy' },
                  { id: 'listing_promotion', label: 'Promotions' },
                ].map(flt => (
                  <button
                    key={flt.id}
                    onClick={() => setRevenueFilter(flt.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      revenueFilter === flt.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={revenueSearch}
                  onChange={e => setRevenueSearch(e.target.value)}
                  placeholder="Filter by ref, source, gateway..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none w-full sm:w-64"
                />
              </div>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Reference &amp; Date</th>
                    <th className="p-3.5">Source &amp; Description</th>
                    <th className="p-3.5">Revenue Stream</th>
                    <th className="p-3.5">Gross Volume</th>
                    <th className="p-3.5">Net Fee Earned</th>
                    <th className="p-3.5">Settlement Gateway</th>
                    <th className="p-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRevenueRecords.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <span className="font-mono font-bold text-slate-900 block text-[11px]">
                          {rec.referenceNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(rec.date).toLocaleDateString()} &bull; {new Date(rec.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-bold text-slate-900 block">{rec.source}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {rec.stream.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">
                        {formatPrice(rec.grossAmount)}
                      </td>
                      <td className="p-3.5 font-black text-emerald-600">
                        +{formatPrice(rec.netFee)}
                      </td>
                      <td className="p-3.5">
                        <span className="text-[11px] font-semibold text-slate-700">
                          {rec.gateway}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Settled</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Treasurer Panel & Executive Withdrawal Portal */}
      {activeAdminTab === 'withdrawals' && (
        <div className="space-y-6">
          {/* Treasurer Overview Header */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  <Banknote className="w-4 h-4 text-emerald-400" />
                  <span>Central Treasurer &amp; Payout Disbursement Control</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Executive Treasury Profit Withdrawal Portal
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Authorize direct corporate profit disbursements from accumulated marketplace fees, tier subscription revenue, and escrow arbitration profits into official business accounts.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-3.5 py-2 rounded-2xl text-xs text-slate-300">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Multi-Sign 4-Digit Security Authorization Active</span>
              </div>
            </div>

            {/* Treasury 4-Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 space-y-1 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Available For Withdrawal
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-3xl font-black text-emerald-400">
                  {formatPrice(treasuryStats.availableProfits)}
                </div>
                <p className="text-[11px] text-emerald-300/80 font-medium">
                  Instant clearance &bull; Unlocked profits
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Protected Escrow Vault
                </span>
                <div className="text-3xl font-black text-teal-400">
                  {formatPrice(totalPlatformEscrow)}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Safeguarded for client milestones (Locked)
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Lifetime Profits Disbursed
                </span>
                <div className="text-3xl font-black text-white">
                  {formatPrice(treasuryStats.lifetimeWithdrawn)}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Audited executive withdrawals to date
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Monthly Run Rate Trajectory
                </span>
                <div className="text-3xl font-black text-indigo-400">
                  {formatPrice(treasuryStats.monthlyRunRate)}
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Estimated 30-day recurring velocity
                </p>
              </div>
            </div>
          </div>

          {/* Main Withdrawal Panel Form */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <span>Initiate Treasury Disbursement</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Select your payout destination, configure the disbursement volume, and authorize with the Master Admin PIN.
              </p>
            </div>

            <form onSubmit={handleExecuteWithdrawal} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Col: Amount & Destination */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Amount Configuration */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Withdrawal Amount (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">
                        $
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={treasuryStats.availableProfits}
                        step="1"
                        value={withdrawAmount}
                        onChange={e => setWithdrawAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-9 pr-4 py-3.5 text-xl font-black text-slate-900 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                        placeholder="Enter amount..."
                      />
                    </div>

                    {/* Quick Amount Chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {[500, 1000, 2500, 5000, 10000].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setWithdrawAmount(val)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            withdrawAmount === val
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          +${val.toLocaleString()}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setWithdrawAmount(Math.floor(treasuryStats.availableProfits))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                          withdrawAmount === Math.floor(treasuryStats.availableProfits)
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        Max All (${Math.floor(treasuryStats.availableProfits).toLocaleString()})
                      </button>
                    </div>

                    {withdrawAmount > treasuryStats.availableProfits && (
                      <p className="text-xs text-rose-600 font-bold flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Amount exceeds available net profits ({formatPrice(treasuryStats.availableProfits)}).
                      </p>
                    )}
                  </div>

                  {/* Payout Gateway / Method Picker */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Select Disbursement Method
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: 'M-Pesa Business (B2C)' as AdminWithdrawalMethod,
                          name: 'M-Pesa Business (B2C)',
                          sub: 'Instant STK / Paybill Credit',
                          fee: '$0.00 fee',
                          badge: 'FASTEST',
                          badgeColor: 'bg-emerald-100 text-emerald-800',
                        },
                        {
                          id: 'Corporate Bank Wire (USD/KES)' as AdminWithdrawalMethod,
                          name: 'Corporate Bank Wire',
                          sub: 'Standard Chartered SWIFT/RTGS',
                          fee: '$25 clearing fee',
                          badge: 'DIRECT',
                          badgeColor: 'bg-blue-100 text-blue-800',
                        },
                        {
                          id: 'PayPal Corporate' as AdminWithdrawalMethod,
                          name: 'PayPal Corporate',
                          sub: 'API instant treasury settlement',
                          fee: '$15 processing fee',
                          badge: 'GLOBAL',
                          badgeColor: 'bg-indigo-100 text-indigo-800',
                        },
                        {
                          id: 'Stripe Treasury Connect' as AdminWithdrawalMethod,
                          name: 'Stripe Treasury Connect',
                          sub: 'Direct corporate balance payout',
                          fee: '$10 network fee',
                          badge: 'AUTOMATED',
                          badgeColor: 'bg-purple-100 text-purple-800',
                        },
                      ].map(m => {
                        const isSelected = withdrawMethod === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleSelectWithdrawMethod(m.id)}
                            className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer space-y-1 ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900">{m.name}</span>
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${m.badgeColor}`}>
                                {m.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500">{m.sub}</p>
                            <span className="text-[10px] font-bold text-slate-600 block">{m.fee}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Account Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                        Destination Beneficiary / Account Details
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSelectWithdrawMethod(withdrawMethod)}
                        className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                      >
                        Reset to Verified Default
                      </button>
                    </div>
                    <input
                      type="text"
                      value={withdrawAccount}
                      onChange={e => setWithdrawAccount(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="e.g. Paybill or Bank Account Details"
                    />
                  </div>

                  {/* Notes / Executive Reference */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Executive Reference / Audit Purpose
                    </label>
                    <input
                      type="text"
                      value={withdrawNotes}
                      onChange={e => setWithdrawNotes(e.target.value)}
                      className="w-full px-4 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      placeholder="e.g. Q4 Executive Profit Withdrawal"
                    />
                  </div>
                </div>

                {/* Right Col: Calculation & Master PIN Authorization */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
                      <span>Disbursement Ledger Preview</span>
                      <Receipt className="w-4 h-4 text-emerald-400" />
                    </h4>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Gross Disbursement:</span>
                        <span className="font-bold text-white text-sm">{formatPrice(withdrawAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Gateway Processing Fee:</span>
                        <span className="font-semibold text-rose-300">
                          {currentWithdrawalFee === 0 ? 'FREE ($0.00)' : `-${formatPrice(currentWithdrawalFee)}`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-800 pt-2.5">
                        <span className="text-slate-300 font-bold">Net Payout to Executive:</span>
                        <span className="font-black text-xl text-emerald-400">
                          {formatPrice(netWithdrawalAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[11px] text-slate-400">
                        <span>Treasury Remaining:</span>
                        <span className="font-mono font-bold text-slate-200">
                          {formatPrice(Math.max(0, treasuryStats.availableProfits - withdrawAmount))}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Instant Disbursement Settlement</span>
                      </div>
                      <p className="text-slate-400 text-[10px]">
                        Disbursements under $10,000 are processed automatically via Safaricom Daraja B2C / SWIFT clearing.
                      </p>
                    </div>
                  </div>

                  {/* Master Security PIN Input */}
                  <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                          Master Admin Authorization PIN
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAdminPin('1234')}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-900 cursor-pointer"
                        title="Auto-fill 1234 Master Override"
                      >
                        Use Master PIN (1234)
                      </button>
                    </div>

                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        maxLength={6}
                        value={adminPin}
                        onChange={e => setAdminPin(e.target.value)}
                        placeholder="Enter 4-digit Master PIN (e.g. 1234)"
                        className="w-full pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest text-slate-900 bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Required for executive treasury release. Default Master Security Key: <strong className="text-slate-700">1234</strong>.
                    </p>
                  </div>

                  {/* THE ENABLED WITHDRAWAL BUTTON */}
                  <button
                    type="submit"
                    disabled={
                      isProcessingWithdrawal ||
                      withdrawAmount <= 0 ||
                      withdrawAmount > treasuryStats.availableProfits
                    }
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm transition-all shadow-md flex items-center justify-center gap-3 cursor-pointer ${
                      isProcessingWithdrawal
                        ? 'bg-slate-800 text-slate-300 cursor-wait'
                        : withdrawAmount > treasuryStats.availableProfits || withdrawAmount <= 0
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:shadow-emerald-500/25 hover:shadow-xl active:scale-[0.99]'
                    }`}
                  >
                    {isProcessingWithdrawal ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Authorizing &amp; Disbursing {formatPrice(withdrawAmount)} via {withdrawMethod}...</span>
                      </>
                    ) : (
                      <>
                        <Banknote className="w-5 h-5 text-slate-950" />
                        <span>Authorize &amp; Execute Withdrawal of {formatPrice(withdrawAmount)}</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    All disbursements are permanently stamped in the central immutable audit log.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Historical Disbursement Records & Vouchers */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <span>Treasury Disbursement Ledger &amp; Vouchers</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Historical archive of all executive profit releases, disbursement vouchers, and banking references.
                </p>
              </div>

              <div className="text-xs font-bold text-slate-500">
                Total Disbursed: <span className="text-slate-900 font-black">{formatPrice(treasuryStats.lifetimeWithdrawn)}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Reference &amp; Date</th>
                    <th className="p-4">Method &amp; Target Account</th>
                    <th className="p-4">Gross Amount</th>
                    <th className="p-4">Clearance Fee</th>
                    <th className="p-4">Net Disbursed</th>
                    <th className="p-4">Approved By</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Voucher</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {adminWithdrawals.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-900 block text-xs">
                          {w.reference}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(w.requestedAt).toLocaleDateString()} &bull; {new Date(w.requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block text-xs">{w.method}</span>
                        <span className="text-[11px] text-slate-500 block truncate max-w-xs">{w.accountDetails}</span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {formatPrice(w.amount)}
                      </td>
                      <td className="p-4 text-rose-500 font-semibold">
                        {w.fee > 0 ? `-${formatPrice(w.fee)}` : '$0.00'}
                      </td>
                      <td className="p-4 font-black text-emerald-600 text-sm">
                        {formatPrice(w.netAmount)}
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {w.approvedBy}
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span className="capitalize">{w.status}</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedVoucher(w)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Receipt className="w-3.5 h-3.5 text-teal-600" />
                          <span>View Voucher</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: User & KYC Management */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Platform User Directory &amp; KYC Verification</h3>
              <p className="text-xs text-slate-500">Manage user verification status, balances, and suspension state.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search user name or email..."
                className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
              <select
                value={selectedUserFilter}
                onChange={e => setSelectedUserFilter(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-bold"
              >
                <option value="all">All Roles</option>
                <option value="freelancer">Freelancers</option>
                <option value="client">Clients</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Verification Badge</th>
                  <th className="p-4">Wallet Balance</th>
                  <th className="p-4">Membership</th>
                  <th className="p-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200" />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[11px] text-slate-400">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={u.badge || ''}
                        onChange={e => updateUserBadge(u.id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                          u.badge === 'Pro Verified'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : u.badge === 'Suspended'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="">Standard</option>
                        <option value="Pro Verified">Pro Verified</option>
                        <option value="Top Rated">Top Rated</option>
                        <option value="Rising Talent">Rising Talent</option>
                        <option value="Super Affiliate">Super Affiliate</option>
                        <option value="Suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="p-4 font-black text-slate-900">
                      {formatPrice(u.balance)}
                    </td>
                    <td className="p-4 font-bold text-teal-700">
                      <div className="uppercase">{u.membershipTier.replace('_', ' ')}</div>
                      {u.institutionName && (
                        <div className="text-[10px] text-slate-500 font-normal">
                          {u.institutionName} ({u.teamSeats || 1} seats)
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => adjustUserBalance(u.id, 50)}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer"
                        title="Add $50 credit"
                      >
                        +$50
                      </button>
                      <button
                        onClick={() => toggleUserSuspension(u.id)}
                        className={`font-bold px-2.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                          u.badge === 'Suspended'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                        }`}
                      >
                        {u.badge === 'Suspended' ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Escrow & Dispute Resolution */}
      {activeAdminTab === 'escrow' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Escrow Dispute Resolution Center</h3>
                <p className="text-xs text-slate-500">
                  Mediate between buyers and freelancers. Enforce binding escrow releases or refunds.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                {disputes.length} Registered Cases
              </span>
            </div>

            <div className="space-y-4">
              {disputes.map(disp => (
                <div
                  key={disp.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {disp.orderNumber}
                      </span>
                      <span className="text-xs text-slate-500">
                        Buyer: <strong>{disp.buyerName}</strong> &bull; Seller: <strong>{disp.sellerName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-base font-black text-slate-900">
                        {formatPrice(disp.amount)} in Escrow
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          disp.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {disp.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                    <strong className="text-slate-900">Dispute Claim:</strong> {disp.reason}
                  </p>

                  {disp.resolution && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
                      ✓ {disp.resolution}
                    </div>
                  )}

                  {disp.status !== 'resolved' && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => resolveDispute(disp.id, 'release_to_seller')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer"
                      >
                        Release to Seller ({disp.sellerName})
                      </button>
                      <button
                        onClick={() => resolveDispute(disp.id, 'refund_buyer')}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer"
                      >
                        Refund to Buyer ({disp.buyerName})
                      </button>
                      <button
                        onClick={() => resolveDispute(disp.id, 'split')}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-xs cursor-pointer"
                      >
                        50 / 50 Split Resolution
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Payment Gateways Control (M-Pesa, Stripe, PayPal) */}
      {activeAdminTab === 'gateways' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <h3 className="text-lg font-black text-slate-900">Safaricom Daraja &amp; Payment API Parameters</h3>
              <p className="text-xs text-slate-500">Configure Shortcodes, Passkeys, and environment routing.</p>
            </div>

            <form onSubmit={handleSaveGateways} className="space-y-4">
              {/* Safaricom M-Pesa Settings */}
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>Lipa Na M-Pesa Daraja Settings</span>
                  </span>
                  <select
                    value={mpesaEnv}
                    onChange={e => setMpesaEnv(e.target.value as any)}
                    className="text-xs font-bold px-2 py-1 rounded border border-emerald-300 bg-white"
                  >
                    <option value="production">Production (Live)</option>
                    <option value="sandbox">Sandbox (Testing)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Business ShortCode (Paybill/Till)
                    </label>
                    <input
                      type="text"
                      value={mpesaShortcode}
                      onChange={e => setMpesaShortcode(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      STK Push Timeout (Seconds)
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Daraja Online Passkey
                  </label>
                  <input
                    type="password"
                    value={mpesaPasskey}
                    onChange={e => setMpesaPasskey(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Stripe Settings */}
              <div className="p-4 bg-indigo-50/50 border border-indigo-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-600" />
                    <span>Stripe Card Gateway</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    3D-SECURE 2.0
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Stripe Publishable Key
                  </label>
                  <input
                    type="text"
                    value={stripeKey}
                    onChange={e => setStripeKey(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* PayPal Settings */}
              <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                  <span>PayPal Express Smart Buttons</span>
                </span>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    PayPal Client ID
                  </label>
                  <input
                    type="text"
                    value={paypalId}
                    onChange={e => setPaypalId(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Save Payment Gateway Parameters
              </button>
            </form>
          </div>

          {/* Right Column: Simulated STK Trigger Testing Tool */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-slate-900">Daraja STK Push Test Utility</h3>
            </div>
            <p className="text-xs text-slate-500">
              Dispatch an instant simulated Daraja STK Push trigger to test webhook callbacks and phone PIN prompt responsiveness.
            </p>

            <form onSubmit={handleTestStk} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Test Phone
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={e => setTestPhone(e.target.value)}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Test Amount (KES)
                </label>
                <input
                  type="number"
                  defaultValue={100}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-mono font-bold"
                  readOnly
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
              >
                Trigger Test M-Pesa Prompt
              </button>

              {testStkStatus && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-mono">
                  {testStkStatus}
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Tab 5: Fees & Platform Controls */}
      {activeAdminTab === 'fees' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs max-w-3xl space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">Platform Commission &amp; System Toggles</h3>
            <p className="text-xs text-slate-500">
              Adjust marketplace fee percentages, affiliate revenue share, and platform-wide broadcast messages.
            </p>
          </div>

          <form onSubmit={handleSaveFees} className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Standard Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={standardFee}
                  onChange={e => setStandardFee(Number(e.target.value))}
                  className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pro Verified Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={proFee}
                  onChange={e => setProFee(Number(e.target.value))}
                  className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Agency Tier Fee (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={agencyFee}
                  onChange={e => setAgencyFee(Number(e.target.value))}
                  className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Affiliate Share (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={affiliateRate}
                  onChange={e => setAffiliateRate(Number(e.target.value))}
                  className="w-full p-2 text-sm bg-white border border-slate-300 rounded-lg font-bold text-teal-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Global Header Announcement Banner
              </label>
              <input
                type="text"
                value={announcement}
                onChange={e => setAnnouncement(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg font-medium"
              />
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Maintenance Mode</span>
                <span className="text-[11px] text-slate-500">
                  When enabled, non-admin users will see a scheduled maintenance notice.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative cursor-pointer ${
                  maintenanceMode ? 'bg-rose-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Save Platform Controls
            </button>
          </form>
        </div>
      )}

      {/* Tab 6: Catalog Moderation */}
      {activeAdminTab === 'moderation' && (
        <div className="space-y-6">
          {/* Services Moderation */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Active Marketplace Gigs Moderation</h3>
            <div className="space-y-3">
              {services.map(s => {
                const isFeatured = s.tags.includes('Staff Pick');
                return (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.thumbnail} alt={s.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 block truncate max-w-md">{s.title}</span>
                        <span className="text-slate-500">
                          Seller: <strong>{s.seller.name}</strong> &bull; Category: {s.category} &bull; Starting: {formatPrice(s.startingPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleServiceFeature(s.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer ${
                          isFeatured
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {isFeatured ? '★ Staff Pick (Active)' : 'Mark as Staff Pick'}
                      </button>
                      <button
                        onClick={() => removeService(s.id)}
                        className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer"
                        title="Remove Gig"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Jobs Moderation */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Job Board Listings Moderation</h3>
            <div className="space-y-3">
              {jobs.map(j => (
                <div
                  key={j.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{j.title}</span>
                    <span className="text-slate-500">
                      Client: <strong>{j.client.name}</strong> &bull; Budget: {formatPrice(j.budget)} &bull; {j.proposalsCount} proposals
                    </span>
                  </div>

                  <button
                    onClick={() => removeJob(j.id)}
                    className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer shrink-0"
                    title="Remove Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Affiliate Payout Queue */}
      {activeAdminTab === 'payouts' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4 border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Affiliate Commission Payout Authorizations</h3>
              <p className="text-xs text-slate-500">Review and authorize partner disbursements to M-Pesa, PayPal, or Bank.</p>
            </div>
          </div>

          <div className="space-y-3">
            {affiliateStats.payoutHistory.map(p => (
              <div
                key={p.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{formatPrice(p.amount)}</span>
                    <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {p.method}
                    </span>
                  </div>
                  <span className="text-slate-500 mt-1 block">
                    Target Account: <strong className="font-mono text-slate-800">{p.account}</strong> &bull; Date: {p.date}
                  </span>
                </div>

                <div>
                  {p.status === 'processing' ? (
                    <button
                      onClick={() => approveAffiliatePayout(p.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer shadow-xs"
                    >
                      Approve &amp; Disburse
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Disbursed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 8: Audit Trail */}
      {activeAdminTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-black text-slate-900">System &amp; Administrative Audit Trail</h3>
            <p className="text-xs text-slate-500">Immutable record of security events, configuration updates, and escrow operations.</p>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="font-bold text-slate-800">{log.target}</span>
                  </div>
                  <span className="text-slate-400 text-[10px]">{log.timestamp}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{log.details}</p>
                <span className="text-[10px] text-slate-400 block">Operator: {log.adminName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Domain & Olitt Setup Tab */}
      {activeAdminTab === 'domain' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 rounded-2xl p-6 sm:p-8 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-mono font-bold">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>Production Custom Domain: https://www.gigworksite.com</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Custom Domain &amp; Olitt Integration Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Connect and manage your live brand domain <span className="text-teal-300 font-mono font-bold">www.gigworksite.com</span>. Resolve SSL certificate handshakes via Cloudflare Proxy or embed directly into your Olitt website builder.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://www.gigworksite.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open www.gigworksite.com</span>
                </a>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText('https://www.gigworksite.com');
                    addToast('Domain Copied', 'https://www.gigworksite.com copied to clipboard', 'affiliate');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>Copy Domain URL</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cloudflare SSL & CNAME Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Cloudflare DNS &amp; SSL Handshake Fix</h3>
                  <p className="text-xs text-slate-500">Fixes the &quot;SSL: no alternative certificate subject name&quot; error</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
                <p className="font-bold text-amber-950">Why the browser shows an SSL certificate error:</p>
                <p>
                  Google Cloud Run certificates only cover <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">*.a.run.app</code>. When you point a CNAME for <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">www.gigworksite.com</code> directly without Cloudflare proxy, the browser sees the Cloud Run cert instead of your domain cert.
                </p>
              </div>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900">Required Cloudflare Record:</div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="block text-slate-400 text-[9px] uppercase">Type</span>
                      <span className="font-bold text-slate-800">CNAME</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="block text-slate-400 text-[9px] uppercase">Name</span>
                      <span className="font-bold text-slate-800">www</span>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="block text-slate-400 text-[9px] uppercase">Proxy Status</span>
                      <span className="font-bold text-amber-600">Proxied (Orange)</span>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-600 break-all bg-white p-2 rounded border border-slate-200">
                    <span className="text-slate-400">Target: </span>ais-pre-r4du7u5tzlzoja4vwa3vys-951950510633.europe-west2.run.app
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Solution in 1 Click:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Set Proxy status to <strong>Proxied (Orange Cloud)</strong> and set Cloudflare SSL/TLS to <strong>Full</strong>. Cloudflare will serve its own valid SSL certificate for www.gigworksite.com!
                  </p>
                </div>
              </div>
            </div>

            {/* Olitt Embed Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Olitt Website Builder Embed</h3>
                    <p className="text-xs text-slate-500">Embed full interactive app in your Olitt site</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const snippet = `<iframe src="https://ais-pre-r4du7u5tzlzoja4vwa3vys-951950510633.europe-west2.run.app" title="GIGWORK SITE Platform" style="width: 100%; height: 100vh; border: none; min-height: 100vh;" allow="camera; microphone; geolocation; payment"></iframe>`;
                    navigator.clipboard?.writeText(snippet);
                    addToast('Embed Code Copied', 'Paste into your Olitt Custom Code block', 'affiliate');
                  }}
                  className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold text-xs cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] border border-slate-800 overflow-x-auto leading-relaxed">
                {`<iframe src="https://ais-pre-r4du7u5tzlzoja4vwa3vys-951950510633.europe-west2.run.app" style="width: 100%; height: 100vh; border: none;" allow="camera; microphone; geolocation; payment"></iframe>`}
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="font-bold text-slate-800">Quick Steps in Olitt:</div>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>In your Olitt builder page on <strong>gigworksite.com</strong></li>
                  <li>Click <strong>Add Block &gt; Custom Code / HTML</strong></li>
                  <li>Paste the code snippet above and click <strong>Publish</strong></li>
                </ol>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Production Bundle Archive</span>
                  <span className="text-[11px] text-slate-500">gigworksite_build.zip (includes .htaccess, _redirects &amp; sitemap)</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 font-mono text-[10px] font-bold">
                  Ready in Root
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disbursement Voucher Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedVoucher(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Receipt className="w-3 h-3" />
                <span>Official Corporate Treasury Voucher</span>
              </div>
              <h3 className="text-xl font-black">Profit Disbursement Receipt</h3>
              <p className="text-xs text-slate-400 mt-1">
                Ref: <span className="font-mono text-emerald-400 font-bold">{selectedVoucher.reference}</span>
              </p>
            </div>

            {/* Voucher Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Gateway:</span>
                  <span className="font-bold text-slate-900">{selectedVoucher.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Beneficiary Target:</span>
                  <span className="font-semibold text-slate-800 text-right max-w-xs">{selectedVoucher.accountDetails}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authorized By:</span>
                  <span className="font-semibold text-slate-800">{selectedVoucher.approvedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Disbursement Date:</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(selectedVoucher.requestedAt).toLocaleString()}
                  </span>
                </div>
                {selectedVoucher.notes && (
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="text-slate-400">Purpose Note:</span>
                    <span className="font-medium text-slate-700">{selectedVoucher.notes}</span>
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-2 bg-white">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Gross Disbursement:</span>
                  <span className="font-bold text-slate-900">{formatPrice(selectedVoucher.amount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Gateway Handling Fee:</span>
                  <span className="font-semibold text-rose-500">
                    {selectedVoucher.fee > 0 ? `-${formatPrice(selectedVoucher.fee)}` : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black border-t border-slate-200 pt-2 text-slate-900">
                  <span>Net Settled Amount:</span>
                  <span className="text-emerald-600 text-base">{formatPrice(selectedVoucher.netAmount)}</span>
                </div>
              </div>

              {/* Digital Stamp */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-xs text-emerald-950 block">Disbursement Settled &amp; Certified</span>
                  <span className="text-[10px] text-emerald-800">
                    Signed by Central Treasury Ledger &bull; Immutable record
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
