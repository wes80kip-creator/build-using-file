import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wallet,
  TrendingUp,
  PackageCheck,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle,
  Clock,
  ExternalLink,
  Crown,
  Activity,
  Layers,
  Building2,
} from 'lucide-react';
import { Order } from '../types';

interface DashboardProps {
  onSelectOrder: (order: Order) => void;
  setCurrentTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectOrder, setCurrentTab }) => {
  const { user, orders, formatPrice, services, jobs, affiliateStats } = useApp();

  const activeOrders = orders.filter(
    o => o.orderStatus === 'in_progress' || o.orderStatus === 'delivered'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left space-y-8">
      {/* User Header Profile */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500 shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
              ✓
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h2>
              {user.badge && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                  {user.badge}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">{user.title}</p>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-400">
              <span>{user.country}</span>
              <span>&bull;</span>
              <span>⭐ {user.rating} ({user.reviewsCount} reviews)</span>
              <span>&bull;</span>
              <span className="text-teal-600 font-semibold uppercase">{user.membershipTier} Tier</span>
              {user.institutionName && (
                <>
                  <span>&bull;</span>
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-bold border border-emerald-200">
                    <Building2 className="w-3 h-3" />
                    {user.institutionName} ({user.teamSeats || 1} Seats)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => setCurrentTab('memberships')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Crown className="w-4 h-4 text-teal-600" />
            <span>Manage Membership</span>
          </button>
        </div>

        {/* Balance Card */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-5 sm:min-w-[280px] justify-between border border-slate-800 shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Available Escrow Balance
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">
              {formatPrice(user.balance)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Role Adaptive Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {user.role === 'freelancer' && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Orders In Escrow
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {activeOrders.length}
              </span>
              <span className="text-[11px] text-teal-600 font-semibold block mt-1">
                Guaranteed escrow funds
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Listed Gigs
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {services.length}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Unlimited slots available</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Commission Rate
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-600">5.0%</span>
              <span className="text-[11px] text-slate-400 block mt-1">Pro Verified 50% discount</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Avg. Response Rate
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">100%</span>
              <span className="text-[11px] text-slate-400 block mt-1">&lt; 1 hour turnaround</span>
            </div>
          </>
        )}

        {user.role === 'client' && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Projects Commissioned
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">12</span>
              <span className="text-[11px] text-teal-600 font-semibold block mt-1">100% Milestone met</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Escrow Protected Funds
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {formatPrice(380)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Awaiting your approval</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Client Trust Score
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-600">99.4%</span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">Verified Buyer</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Open Job Posts
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">{jobs.length}</span>
              <span className="text-[11px] text-slate-400 block mt-1">Bids arriving in real-time</span>
            </div>
          </>
        )}

        {user.role === 'admin' && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Platform GMV Volume
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {formatPrice(148200)}
              </span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">+24.5% this month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Escrow Reserve Vault
              </span>
              <span className="text-2xl sm:text-3xl font-black text-teal-600">
                {formatPrice(34500)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Backed by Safaricom &amp; Stripe</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Active Disputes
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">0</span>
              <span className="text-[11px] text-emerald-600 font-bold block mt-1">100% Resolved</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Payment Gateways Health
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">Healthy</span>
              <span className="text-[11px] text-slate-400 block mt-1">M-Pesa, Stripe, PayPal 99.9%</span>
            </div>
          </>
        )}

        {user.role === 'affiliate' && (
          <>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Available Commission
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {formatPrice(affiliateStats.availableBalance)}
              </span>
              <span className="text-[11px] text-teal-600 font-bold block mt-1">Instant Payouts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Referred Users
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900">
                {affiliateStats.registeredUsers}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Active buyers &amp; sellers</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Partner Tier
              </span>
              <span className="text-xl font-black text-amber-600">{affiliateStats.tier}</span>
              <span className="text-[11px] text-slate-400 block mt-1">Highest revenue share</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Lifetime Commissions
              </span>
              <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                {formatPrice(affiliateStats.lifetimeEarnings)}
              </span>
              <span className="text-[11px] text-slate-400 block mt-1">Paid to M-Pesa &amp; PayPal</span>
            </div>
          </>
        )}
      </div>

      {user.role === 'admin' && (
        <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block mb-1">
              Admin Command Center
            </span>
            <h3 className="text-base font-bold">Admin Portal &amp; Live App Controls Ready</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Control Safaricom M-Pesa ShortCodes, manage KYC badges, arbitrate disputes, and set platform fee rates.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('admin')}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer shadow-md transition-all shrink-0"
          >
            Launch Full Admin Portal →
          </button>
        </div>
      )}

      {/* Orders Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">Active Orders &amp; Escrow Deliveries</h3>
            <p className="text-xs text-slate-500">Track milestone progress, submit deliverables, or release escrow.</p>
          </div>
          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
            {orders.length} Total Orders
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="p-4">Order #</th>
                <th className="p-4">Service / Milestone</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Gateway</th>
                <th className="p-4">Escrow State</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 font-mono font-bold text-slate-900">{order.orderNumber}</td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-900 block truncate max-w-[240px]">
                      {order.title}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Due {new Date(order.deliveryDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4 font-black text-slate-900">{formatPrice(order.amount)}</td>
                  <td className="p-4 font-bold uppercase text-teal-700">{order.paymentMethod}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        order.escrowStatus === 'held_in_escrow'
                          ? 'text-teal-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {order.escrowStatus === 'held_in_escrow' ? 'Held in Escrow' : 'Released'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        order.orderStatus === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.orderStatus === 'delivered'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {order.orderStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSelectOrder(order)}
                      className="bg-slate-900 hover:bg-teal-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Open Workspace
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
