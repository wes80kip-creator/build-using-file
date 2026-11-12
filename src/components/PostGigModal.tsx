import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, PlusCircle, Check } from 'lucide-react';

interface PostGigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostGigModal: React.FC<PostGigModalProps> = ({ isOpen, onClose }) => {
  const { addService, user } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programming & Tech');
  const [subcategory, setSubcategory] = useState('Web Development');
  const [description, setDescription] = useState('');
  const [basicPrice, setBasicPrice] = useState(80);
  const [standardPrice, setStandardPrice] = useState(180);
  const [premiumPrice, setPremiumPrice] = useState(380);
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [tags, setTags] = useState('React, TypeScript, Node.js');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addService({
      title,
      category,
      subcategory,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
      description,
      startingPrice: basicPrice,
      seller: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        level: user.badge || 'Level 1 Seller',
        badge: user.badge,
        country: user.country,
        responseHours: 1,
      },
      packages: {
        basic: {
          name: 'Essential Package',
          price: basicPrice,
          description: 'Basic deliverable and initial implementation.',
          deliveryDays,
          revisions: '2 Revisions',
          features: ['Source Code Included', 'Responsive Design', 'Quick Setup'],
        },
        standard: {
          name: 'Pro Package',
          price: standardPrice,
          description: 'Full production feature suite with testing and documentation.',
          deliveryDays: deliveryDays + 2,
          revisions: 'Unlimited',
          features: ['Complete Solution', 'API Integration', 'Unit Testing', '14-Day Support'],
        },
        premium: {
          name: 'Enterprise Package',
          price: premiumPrice,
          description: 'Turnkey architectural implementation with priority support.',
          deliveryDays: deliveryDays + 5,
          revisions: 'Unlimited',
          features: ['Complete Solution', 'CI/CD Deployment', 'Escrow Milestones', '30-Day SLA'],
        },
      },
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 text-left">
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-black text-slate-900">Publish a New Gig on GIGWORK SITE</h3>
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
              Gig Title (Starts with &quot;I will...&quot;)
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. I will build a full-stack Next.js web application with M-Pesa payments"
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
              <label className="block text-xs font-bold text-slate-700 mb-1">Subcategory</label>
              <input
                type="text"
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of your service, deliverables, and technical approach..."
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Basic Price ($)
              </label>
              <input
                type="number"
                min="10"
                value={basicPrice}
                onChange={e => setBasicPrice(Number(e.target.value))}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Standard Price ($)
              </label>
              <input
                type="number"
                min="20"
                value={standardPrice}
                onChange={e => setStandardPrice(Number(e.target.value))}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Premium Price ($)
              </label>
              <input
                type="number"
                min="50"
                value={premiumPrice}
                onChange={e => setPremiumPrice(Number(e.target.value))}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Basic Delivery Time (Days)
              </label>
              <input
                type="number"
                min="1"
                value={deliveryDays}
                onChange={e => setDeliveryDays(Number(e.target.value))}
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Search Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="React, M-Pesa, Tailwind"
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>
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
              Publish Gig to GIGWORK SITE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
