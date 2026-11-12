import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Currency, Role } from '../types';
import {
  Briefcase,
  Layers,
  GraduationCap,
  Crown,
  Share2,
  Bell,
  Wallet,
  ChevronDown,
  PlusCircle,
  ShieldCheck,
  Check,
  UserCheck,
  DollarSign,
  Menu,
  X,
  PackageCheck,
  ShieldAlert,
} from 'lucide-react';
import { GigWorkLogo } from './GigWorkLogo';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenPostGig: () => void;
  onOpenPostJob: () => void;
  onOpenPostCourse?: () => void;
  onOpenDomainModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenPostGig,
  onOpenPostJob,
  onOpenPostCourse,
  onOpenDomainModal,
}) => {
  const {
    user,
    switchRole,
    currency,
    setCurrency,
    formatPrice,
    orders,
    notifications,
    unreadCount,
    markNotificationsAsRead,
  } = useApp();

  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currencies: Currency[] = ['USD', 'KES', 'EUR', 'GBP'];

  const roles: { id: Role; label: string; desc: string; color: string }[] = [
    { id: 'freelancer', label: 'Freelancer', desc: 'Find work, offer gigs & earn', color: 'bg-emerald-500' },
    { id: 'client', label: 'Client / Buyer', desc: 'Post jobs & hire top talent', color: 'bg-indigo-500' },
    { id: 'affiliate', label: 'Affiliate Partner', desc: 'Earn 15% recurring rewards', color: 'bg-amber-500' },
    { id: 'admin', label: 'Platform Admin', desc: 'Disputes, escrow & metrics', color: 'bg-rose-500' },
  ];

  const activeOrdersCount = orders.filter(
    o => o.orderStatus === 'in_progress' || o.orderStatus === 'delivered'
  ).length;

  const navItems = [
    { id: 'gigs', label: 'Browse Gigs', icon: Layers },
    { id: 'jobs', label: 'Job Board', icon: Briefcase },
    { id: 'academy', label: 'Academy', icon: GraduationCap },
    { id: 'memberships', label: 'Memberships', icon: Crown },
    { id: 'affiliate', label: 'Affiliate 15%', icon: Share2, badge: 'High ROI' },
    { id: 'orders', label: 'My Orders', icon: PackageCheck, count: activeOrdersCount },
    { id: 'dashboard', label: 'Dashboard', icon: UserCheck },
    { id: 'admin', label: 'Admin Portal', icon: ShieldAlert, badge: 'CONTROL' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Escrow Guarantee
            </span>
            <span className="hidden sm:inline text-slate-400">•</span>
            <span className="hidden sm:inline text-slate-300">
              Instant payouts via <strong>M-Pesa (Kenya)</strong>, <strong>PayPal</strong> &amp; <strong>Stripe</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <button
              onClick={onOpenDomainModal}
              title="Manage Custom Domain (www.gigworksite.com) & Olitt Embed"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-mono hover:bg-teal-500/30 hover:text-white transition-colors cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>www.gigworksite.com</span>
            </button>
            <span className="hidden md:inline">
              Need Help? <a href="mailto:info@gigworksite.com" className="text-white hover:underline">info@gigworksite.com</a>
            </span>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo brand */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentTab('gigs')}
              className="flex items-center text-left focus:outline-none group cursor-pointer"
            >
              <GigWorkLogo variant="compact" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentTab(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">
                        {item.badge}
                      </span>
                    )}
                    {typeof item.count === 'number' && item.count > 0 && (
                      <span className="bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency selector */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Change display currency"
              >
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Currency
                  </div>
                  {currencies.map(curr => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer ${
                        currency === curr ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span>{curr}</span>
                      {currency === curr && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:border-indigo-300 transition-all shadow-2xs cursor-pointer"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    roles.find(r => r.id === user.role)?.color || 'bg-indigo-500'
                  }`}
                />
                <span className="capitalize text-slate-800 font-bold">{user.role}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-3 py-1 border-b border-slate-100 mb-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Switch Role Mode
                    </span>
                    <p className="text-[11px] text-slate-500">Test platform views &amp; features</p>
                  </div>
                  {roles.map(r => (
                    <button
                      key={r.id}
                      onClick={() => {
                        switchRole(r.id);
                        if (r.id === 'admin') setCurrentTab('admin');
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                        user.role === r.id ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${r.color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800">{r.label}</span>
                          {user.role === r.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <span className="text-[10px] text-slate-500 block">{r.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  if (!isNotificationsOpen) markNotificationsAsRead();
                }}
                className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Notifications</span>
                    <span className="text-[11px] text-indigo-600 font-medium">All Read</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Wallet Balance Pill */}
            <div
              onClick={() => setCurrentTab('dashboard')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold cursor-pointer hover:bg-emerald-100 transition-colors"
              title="Platform Balance"
            >
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{formatPrice(user.balance)}</span>
            </div>

            {/* Teach / Post Course Button */}
            <button
              onClick={onOpenPostCourse}
              title="Publish a Course on a Paid Creator Tier (Earn up to 95%)"
              className="hidden md:flex items-center gap-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-teal-600" />
              <span>Post Course</span>
            </button>

            {/* Primary Action Button (Role dependent) */}
            {user.role === 'client' ? (
              <button
                onClick={onOpenPostJob}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post a Job</span>
              </button>
            ) : (
              <button
                onClick={onOpenPostGig}
                className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post a Gig</span>
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-indigo-600" />
                  <span>{item.label}</span>
                </div>
                {item.count && (
                  <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              onClick={() => {
                if (onOpenPostCourse) onOpenPostCourse();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 text-teal-600" />
              <span>Post a Course (Creator Tier)</span>
            </button>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Signed in as <strong>{user.name}</strong></span>
            <span className="text-emerald-600 font-bold">{formatPrice(user.balance)}</span>
          </div>
        </div>
      )}
    </header>
  );
};
