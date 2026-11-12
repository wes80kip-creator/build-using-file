import React, { useState } from 'react';
import { Service, ServicePackage } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  Clock,
  RotateCcw,
  Check,
  ShieldCheck,
  MessageSquare,
  Award,
  Globe,
  Share2,
} from 'lucide-react';

interface ServiceModalProps {
  service: Service | null;
  onClose: () => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  const { formatPrice, openCheckout, addToast } = useApp();
  const [selectedTier, setSelectedTier] = useState<'basic' | 'standard' | 'premium'>('standard');

  if (!service) return null;

  const currentPkg: ServicePackage = service.packages[selectedTier];

  const handleOrder = () => {
    openCheckout({
      id: service.id,
      type: 'service',
      title: service.title,
      subtitle: `${currentPkg.name} (${selectedTier.toUpperCase()})`,
      amount: currentPkg.price,
      sellerName: service.seller.name,
      packageName: currentPkg.name,
      deliveryDays: currentPkg.deliveryDays,
      features: currentPkg.features,
    });
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Link Copied', 'Gig link copied to clipboard.', 'order');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60">
              {service.category}
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">{service.subcategory}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Share Gig"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          {/* Left Column: Gig Details & Media */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {service.title}
            </h2>

            {/* Thumbnail banner */}
            <div className="rounded-xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-xs">
              <img
                src={service.thumbnail}
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Seller profile box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <img
                src={service.seller.avatar}
                alt={service.seller.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-xs"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{service.seller.name}</h4>
                    {service.seller.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                        {service.seller.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-slate-800">{service.rating.toFixed(2)}</span>
                    <span className="text-slate-400">({service.reviewsCount})</span>
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-slate-600">
                  <div>
                    <span className="text-slate-400 block">From:</span>
                    <span className="font-semibold text-slate-800">{service.seller.country}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Level:</span>
                    <span className="font-semibold text-teal-600">{service.seller.level}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Avg. Response:</span>
                    <span className="font-semibold text-slate-800">{service.seller.responseHours} hour</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                About This Service
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {service.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-2">
              {service.tags.map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Escrow safety badge */}
            <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/70 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-teal-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-teal-900 block">GIGWORK SITE Escrow Protection</span>
                <span className="text-teal-700">
                  Your payment is safely held until you review the deliverable and authorize fund release.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Tier Package Selection & Order Checkout Button */}
          <div className="lg:col-span-5">
            <div className="sticky top-4 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Package Tier Tabs */}
              <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200 text-xs font-bold text-center">
                {(['basic', 'standard', 'premium'] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`py-3 capitalize transition-all cursor-pointer ${
                      selectedTier === tier
                        ? 'bg-white text-teal-700 border-b-2 border-teal-600 shadow-2xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>

              {/* Selected Package Details */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-slate-900">{currentPkg.name}</h4>
                  <span className="text-2xl font-black text-slate-900">
                    {formatPrice(currentPkg.price)}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed min-h-[40px]">
                  {currentPkg.description}
                </p>

                {/* Delivery & Revisions metadata */}
                <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-100 text-xs text-slate-700 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span>{currentPkg.deliveryDays} Days Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-teal-600" />
                    <span>{currentPkg.revisions}</span>
                  </div>
                </div>

                {/* Features Checklist */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    What&apos;s Included:
                  </span>
                  {currentPkg.features.map(feat => (
                    <div key={feat} className="flex items-center gap-2 text-xs text-slate-700">
                      <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Continue to Order button */}
                <button
                  onClick={handleOrder}
                  className="w-full mt-4 bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black py-3 px-4 rounded-xl shadow-md hover:shadow-teal-500/20 text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Order Now &bull; {formatPrice(currentPkg.price)}</span>
                </button>

                <p className="text-center text-[11px] text-slate-400">
                  Supports M-Pesa, PayPal, Stripe &amp; Wallet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
