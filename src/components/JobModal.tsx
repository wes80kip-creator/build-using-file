import React, { useState } from 'react';
import { Job } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Briefcase,
  DollarSign,
  Clock,
  ShieldCheck,
  Send,
  Star,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface JobModalProps {
  job: Job;
  onClose: () => void;
}

export const JobModal: React.FC<JobModalProps> = ({ job, onClose }) => {
  const { formatPrice, submitProposal, user } = useApp();
  const [bidAmount, setBidAmount] = useState(job.budget);
  const [deliveryDays, setDeliveryDays] = useState(job.deadlineDays || 7);
  const [coverLetter, setCoverLetter] = useState(
    `Hi ${job.client.name},\n\nI have reviewed your requirements for "${job.title}" and have extensive hands-on experience delivering similar production solutions. I can complete this with clean documentation, milestone updates, and reliable communication.\n\nLooking forward to discussing the next steps!`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      submitProposal(job.id, bidAmount, deliveryDays, coverLetter);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 text-left">
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 border border-teal-200">
              {job.category}
            </span>
            <span className="text-xs text-slate-400">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">Job Details &amp; Proposal</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Job Overview */}
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {job.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pb-3 border-b border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Budget</span>
                <span className="text-base font-black text-slate-900">{formatPrice(job.budget)}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Type</span>
                <span className="font-semibold text-slate-800 capitalize">{job.budgetType} Price</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Level</span>
                <span className="font-semibold text-slate-800">{job.experienceLevel}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Proposals</span>
                <span className="font-semibold text-teal-600">{job.proposalsCount} active</span>
              </div>
            </div>

            {/* Client Card */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img
                  src={job.client.avatar}
                  alt={job.client.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>{job.client.name}</span>
                    <span className="text-slate-400 font-normal">({job.client.country})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-slate-500">
                    {job.client.paymentVerified && (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1 text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" /> Escrow Verified
                      </span>
                    )}
                    <span>&bull;</span>
                    <span>${job.client.totalSpent.toLocaleString()} spent</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{job.client.rating}</span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Project Scope &amp; Specifications
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Required Skills */}
            <div className="space-y-1.5 pt-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          <div className="pt-4 border-t border-slate-200">
            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-emerald-950">Proposal Submitted Successfully!</h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  Your bid has been dispatched to {job.client.name}. When the client accepts your proposal, funds will be placed into milestone escrow.
                </p>
                <button
                  onClick={onClose}
                  className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Close &amp; Return to Jobs
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-600" />
                    <span>Submit Your Bid &amp; Proposal</span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Your Tier: <strong className="text-teal-600 uppercase font-bold">{user.membershipTier}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bid Amount ($ USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        min="10"
                        value={bidAmount}
                        onChange={e => setBidAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none font-bold"
                        required
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Platform fee (5%): ${(bidAmount * 0.05).toFixed(2)} &bull; You receive: ${(bidAmount * 0.95).toFixed(2)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Estimated Delivery (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={deliveryDays}
                      onChange={e => setDeliveryDays(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none font-bold"
                      required
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Milestone delivery schedule will be generated
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cover Letter &amp; Technical Approach
                  </label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    placeholder="Explain why you are the best fit, relevant past work, and timeline..."
                    required
                  />
                </div>

                <div className="p-3 bg-teal-50/60 border border-teal-200/60 rounded-xl flex items-center justify-between text-xs text-teal-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Payment will be held in secure escrow upon proposal acceptance.</span>
                  </div>
                  <span className="font-bold">M-Pesa / PayPal / Stripe</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Proposal for {formatPrice(bidAmount)}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
