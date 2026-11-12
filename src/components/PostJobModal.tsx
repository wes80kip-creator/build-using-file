import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Briefcase, PlusCircle } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose }) => {
  const { addJob, user } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming & Tech');
  const [description, setDescription] = useState('');
  const [budgetType, setBudgetType] = useState<'fixed' | 'hourly'>('fixed');
  const [budget, setBudget] = useState(500);
  const [experienceLevel, setExperienceLevel] = useState<'Entry' | 'Intermediate' | 'Expert'>('Intermediate');
  const [deadlineDays, setDeadlineDays] = useState(14);
  const [skills, setSkills] = useState('React, Node.js, Payment Integration');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addJob({
      title,
      category,
      description,
      budgetType,
      budget,
      experienceLevel,
      deadlineDays,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      client: {
        name: user.name,
        avatar: user.avatar,
        country: user.country,
        paymentVerified: true,
        totalSpent: 4200,
        rating: 5.0,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 text-left">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-black text-slate-900">Post a Job on GIGWORK SITE</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Build an Escrow Fintech Payment Platform with M-Pesa & PayPal"
              className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
              >
                <option>Life Skills</option>
                <option>Programming & Tech</option>
                <option>Graphics & Design</option>
                <option>AI Services</option>
                <option>Writing & Translation</option>
                <option>Video & Animation</option>
                <option>Digital Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as any)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
              >
                <option value="Entry">Entry Level</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert Required</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Job Description &amp; Scope</label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the tasks, milestones, deliverables, tech stack, and timeline..."
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Budget Type</label>
              <select
                value={budgetType}
                onChange={e => setBudgetType(e.target.value as any)}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
              >
                <option value="fixed">Fixed Price</option>
                <option value="hourly">Hourly Rate</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {budgetType === 'fixed' ? 'Total Budget ($)' : 'Hourly Rate ($/hr)'}
              </label>
              <input
                type="number"
                min="10"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Deadline (Days)</label>
              <input
                type="number"
                min="1"
                value={deadlineDays}
                onChange={e => setDeadlineDays(Number(e.target.value))}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="React, TypeScript, M-Pesa API, Node.js"
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
            >
              Post Job to Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
