import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Job } from '../types';
import {
  Briefcase,
  DollarSign,
  Clock,
  Send,
  ShieldCheck,
  Filter,
  CheckCircle,
  MapPin,
  PlusCircle,
} from 'lucide-react';
import { JobModal } from './JobModal';

interface JobBoardProps {
  onOpenPostJob: () => void;
}

export const JobBoard: React.FC<JobBoardProps> = ({ onOpenPostJob }) => {
  const { jobs, formatPrice, user } = useApp();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'fixed' | 'hourly'>('all');
  const [searchJob, setSearchJob] = useState('');

  const filteredJobs = jobs.filter(job => {
    const matchesType = filterType === 'all' || job.budgetType === filterType;
    const matchesSearch =
      job.title.toLowerCase().includes(searchJob.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchJob.toLowerCase())) ||
      job.description.toLowerCase().includes(searchJob.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" /> GIGWORK SITE Job Board
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            High-Budget Client Projects &amp; Contracts
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Browse verified client job posts. Submit proposals with milestone milestones and guaranteed escrow payouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPostJob}
            className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Job Requirement</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 my-6">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
          {(['all', 'fixed', 'hourly'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-white text-teal-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {type === 'all' ? 'All Budgets' : `${type} Price`}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            value={searchJob}
            onChange={e => setSearchJob(e.target.value)}
            placeholder="Search skills, title, tech..."
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No jobs match your filter</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your search query or budget filters.</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="group bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-lg hover:border-teal-500/40 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              {/* Left Column: Job Info */}
              <div className="space-y-2.5 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded text-[11px]">
                    {job.category}
                  </span>
                  <span>&bull;</span>
                  <span>Posted {job.createdAt}</span>
                  <span>&bull;</span>
                  <span className="capitalize">{job.experienceLevel} Level</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map(skill => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Client info bar */}
                <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-slate-800">{job.client.name}</span>
                    <span className="text-slate-400">({job.client.country})</span>
                  </div>
                  {job.client.paymentVerified && (
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" /> Payment Verified
                    </span>
                  )}
                  <span>&bull;</span>
                  <span>${job.client.totalSpent.toLocaleString()} spent</span>
                </div>
              </div>

              {/* Right Column: Budget & Proposal CTA */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 shrink-0 gap-3">
                <div className="text-left md:text-right">
                  <div className="text-lg sm:text-xl font-black text-slate-900">
                    {formatPrice(job.budget)}
                    {job.budgetType === 'hourly' && <span className="text-xs font-normal text-slate-500"> /hr</span>}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                    {job.budgetType === 'fixed' ? 'Fixed Price Escrow' : 'Hourly Rate'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    {job.proposalsCount} proposals
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedJob(job);
                    }}
                    className="bg-slate-900 group-hover:bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Submit Bid</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Job Modal */}
      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};
