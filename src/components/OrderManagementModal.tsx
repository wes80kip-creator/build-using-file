import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import {
  X,
  PackageCheck,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Star,
  Send,
  Upload,
} from 'lucide-react';

interface OrderManagementModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderManagementModal: React.FC<OrderManagementModalProps> = ({ order, onClose }) => {
  const { releaseEscrow, submitDelivery, submitReview, formatPrice, user } = useApp();
  const [deliveryNote, setDeliveryNote] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('Excellent work, prompt delivery and professional code!');
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (!order) return null;

  const handleDeliver = (e: React.FormEvent) => {
    e.preventDefault();
    submitDelivery(order.id, deliveryNote || 'All project deliverables and source files delivered.');
    setDeliveryNote('');
  };

  const handleRelease = () => {
    releaseEscrow(order.id);
    setShowReviewForm(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview(order.id, rating, reviewComment);
    setShowReviewForm(false);
  };

  const isCompleted = order.orderStatus === 'completed';
  const isDelivered = order.orderStatus === 'delivered';
  const isBuyer = user.role === 'client' || order.buyer.email === user.email;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 text-left">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Order Workspace &bull; {order.orderNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Status & Title Banner */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
                {order.itemType.toUpperCase()} ORDER
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">{order.title}</h2>
              <span className="text-xs text-slate-500">
                Buyer: <strong>{order.buyer.name}</strong> &bull; Seller: <strong>{order.seller.name}</strong>
              </span>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xl font-black text-slate-900 block">
                {formatPrice(order.amount)}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800'
                    : isDelivered
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-indigo-100 text-indigo-800'
                }`}
              >
                {isCompleted ? 'Completed' : isDelivered ? 'Awaiting Review' : 'In Progress'}
              </span>
            </div>
          </div>

          {/* Escrow Status Indicator */}
          <div className="p-3.5 bg-teal-50/70 border border-teal-200 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-teal-900">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>
                Escrow State:{' '}
                <strong>
                  {order.escrowStatus === 'held_in_escrow'
                    ? 'Securely Held in Escrow'
                    : 'Released to Seller'}
                </strong>
              </span>
            </div>
            <span className="font-mono text-teal-700 font-bold uppercase">
              Paid via {order.paymentMethod}
            </span>
          </div>

          {/* Milestones Progress */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Project Milestones
            </h4>
            <div className="space-y-2">
              {order.milestones.map(m => (
                <div
                  key={m.id}
                  className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        m.status === 'completed' || isCompleted
                          ? 'text-emerald-500'
                          : 'text-slate-300'
                      }`}
                    />
                    <span className="font-semibold text-slate-800">{m.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900">{formatPrice(m.amount)}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        m.status === 'completed' || isCompleted
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {m.status === 'completed' || isCompleted ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Note if exists */}
          {order.deliveryNotes && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-xs">
              <span className="font-bold text-emerald-950 block">Seller Delivery Message:</span>
              <p className="text-emerald-800 leading-relaxed">{order.deliveryNotes}</p>
            </div>
          )}

          {/* Actions based on role and status */}
          {!isCompleted && (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Order Fulfillment Actions
              </h4>

              {/* Freelancer submit delivery form */}
              <form onSubmit={handleDeliver} className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Submit Work Deliverable (Freelancer)
                </label>
                <textarea
                  rows={3}
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                  placeholder="Provide repository link, live demo URL, or summary of deliverables..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Submit Deliverable to Client</span>
                </button>
              </form>

              {/* Client approve & release escrow button */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Client Approval &amp; Escrow Release
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Authorize release of {formatPrice(order.amount)} to {order.seller.name}
                  </span>
                </div>

                <button
                  onClick={handleRelease}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Release Escrow Payment</span>
                </button>
              </div>
            </div>
          )}

          {/* Review form if completed */}
          {showReviewForm && (
            <form onSubmit={handleReviewSubmit} className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3 text-left">
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Leave a 5-Star Review for {order.seller.name}
              </h4>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${star <= rating ? 'fill-current' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                className="w-full p-2 text-xs bg-white border border-amber-200 rounded-lg"
                placeholder="Share your experience working with this seller..."
                required
              />
              <button
                type="submit"
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
              >
                Post Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
