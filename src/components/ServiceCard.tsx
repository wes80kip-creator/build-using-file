import React from 'react';
import { Service } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Clock, ShieldCheck } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onSelect: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const { formatPrice } = useApp();

  return (
    <div
      onClick={() => onSelect(service)}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-teal-500/40 transition-all duration-300 flex flex-col text-left cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={service.thumbnail}
          alt={service.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md border border-white/10">
            {service.category}
          </span>
        </div>

        {service.seller.badge && (
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 uppercase tracking-wider">
              {service.seller.badge}
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller row */}
          <div className="flex items-center gap-2 mb-2.5">
            <img
              src={service.seller.avatar}
              alt={service.seller.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 hover:text-teal-600 transition-colors">
                  {service.seller.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">({service.seller.country})</span>
              </div>
              <span className="text-[10px] text-teal-600 font-medium">{service.seller.level}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-teal-600 transition-colors">
            {service.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="font-black text-slate-800">{service.rating.toFixed(2)}</span>
            <span className="text-slate-400 text-[11px]">({service.reviewsCount})</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px]">{service.salesCount} orders</span>
          </div>
        </div>

        {/* Card Footer: Delivery & Pricing */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{service.packages.basic.deliveryDays}d delivery</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Starting At
            </span>
            <span className="text-base font-black text-slate-900 group-hover:text-teal-600 transition-colors">
              {formatPrice(service.startingPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
