import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PaymentMethod, PostCourseData, CreatorSubscriptionTier } from '../types';
import {
  X,
  GraduationCap,
  Sparkles,
  Check,
  CheckCircle2,
  ShieldCheck,
  DollarSign,
  Plus,
  Trash2,
  Clock,
  BookOpen,
  Award,
  Layers,
  Smartphone,
  CreditCard,
  Wallet,
  Zap,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface PostCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCoursePublished?: () => void;
  initialCategory?: string;
  initialTierId?: 'starter_creator' | 'pro_creator' | 'enterprise_creator';
  initialStep?: 1 | 2 | 3;
}

const THUMBNAIL_PRESETS = [
  {
    label: 'Life Skills: Speaking & Leadership',
    category: 'Life Skills',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'Life Skills: Personal Finance & Wealth',
    category: 'Life Skills',
    url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'Life Skills: Mental Resilience & EQ',
    category: 'Life Skills',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'Tech: Full Stack & Payments',
    category: 'Programming & Tech',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'AI: Agents & Prompting',
    category: 'Artificial Intelligence',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600',
  },
  {
    label: 'Business: Freelance Agency',
    category: 'Freelance Business',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=600',
  },
];

export const PostCourseModal: React.FC<PostCourseModalProps> = ({
  isOpen,
  onClose,
  onCoursePublished,
  initialCategory = 'Life Skills',
  initialTierId = 'pro_creator',
  initialStep = 1,
}) => {
  const {
    user,
    formatPrice,
    currency,
    creatorSubscriptionTiers,
    addCourse,
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(initialStep);
  const [selectedTierId, setSelectedTierId] = useState<'starter_creator' | 'pro_creator' | 'enterprise_creator'>(initialTierId);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  // Course Details State
  const [title, setTitle] = useState('High-Impact Life Skills: Executive Negotiation & Communication Mastery');
  const [category, setCategory] = useState(initialCategory);

  useEffect(() => {
    if (isOpen) {
      if (initialCategory) setCategory(initialCategory);
      if (initialTierId) setSelectedTierId(initialTierId);
      if (initialStep) setStep(initialStep);
    }
  }, [isOpen, initialCategory, initialTierId, initialStep]);
  const [level, setLevel] = useState<'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced'>('All Levels');
  const [price, setPrice] = useState(49);
  const [originalPrice, setOriginalPrice] = useState(129);
  const [durationHours, setDurationHours] = useState(6.5);
  const [lessonsCount, setLessonsCount] = useState(32);
  const [thumbnail, setThumbnail] = useState(
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600'
  );
  const [description, setDescription] = useState(
    'A comprehensive life skills masterclass designed for ambitious professionals. Master persuasive negotiation, high-stakes communication, emotional composure, and decisive problem-solving.'
  );
  const [certificateIncluded, setCertificateIncluded] = useState(true);

  // Curriculum Builder State
  const [modules, setModules] = useState<
    { title: string; lessons: string[] }[]
  >([
    {
      title: 'Module 1: Foundations & Psychological Principles',
      lessons: [
        'Overcoming Communication Friction & Imposter Syndrome',
        'Active Listening & Non-Verbal De-escalation',
        'Establishing Immediate Authority & Warmth',
      ],
    },
    {
      title: 'Module 2: High-Stakes Negotiation & Persuasion Frameworks',
      lessons: [
        'BATNA & Value-Based Pricing Anchoring',
        'Tactical Empathy & Handling Tough Counter-Offers',
        'Closing Long-Term Contracts with Confidence',
      ],
    },
    {
      title: 'Module 3: Daily Habits for Peak Mental Clarity & Resilience',
      lessons: [
        'Managing Stress & Emotional Triggers in Real-Time',
        'Boundary Setting & Saying "No" Gracefully',
        'Action Blueprint & Certification Project Submission',
      ],
    },
  ]);

  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newLessonText, setNewLessonText] = useState('');
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '0712345678');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [publishedCourseTitle, setPublishedCourseTitle] = useState('');

  if (!isOpen) return null;

  const selectedTier =
    creatorSubscriptionTiers.find(t => t.id === selectedTierId) ||
    creatorSubscriptionTiers[1];

  const tierPrice =
    billingCycle === 'annual' ? selectedTier.annualPrice : selectedTier.monthlyPrice;

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) return;
    setModules(prev => [
      ...prev,
      { title: newModuleTitle.trim(), lessons: ['Introduction to this module'] },
    ]);
    setNewModuleTitle('');
    setActiveModuleIndex(modules.length);
  };

  const handleRemoveModule = (index: number) => {
    if (modules.length <= 1) return;
    setModules(prev => prev.filter((_, i) => i !== index));
    if (activeModuleIndex >= modules.length - 1) {
      setActiveModuleIndex(Math.max(0, modules.length - 2));
    }
  };

  const handleAddLesson = (moduleIdx: number) => {
    if (!newLessonText.trim()) return;
    setModules(prev =>
      prev.map((m, i) => {
        if (i === moduleIdx) {
          return { ...m, lessons: [...m.lessons, newLessonText.trim()] };
        }
        return m;
      })
    );
    setNewLessonText('');
  };

  const handleRemoveLesson = (moduleIdx: number, lessonIdx: number) => {
    setModules(prev =>
      prev.map((m, i) => {
        if (i === moduleIdx) {
          return { ...m, lessons: m.lessons.filter((_, li) => li !== lessonIdx) };
        }
        return m;
      })
    );
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const coursePayload: PostCourseData = {
        title,
        category,
        thumbnail,
        price,
        originalPrice,
        durationHours,
        lessonsCount: modules.reduce((acc, m) => acc + m.lessons.length, 0) || lessonsCount,
        level,
        description,
        curriculum: modules,
        certificateIncluded,
        subscriptionTierId: selectedTierId,
        billingCycle,
        paymentMethod,
        phoneNumber,
      };

      const result = addCourse(coursePayload);
      setIsSubmitting(false);
      setPublishedCourseTitle(result.course.title);
      setIsSuccess(true);
      if (onCoursePublished) onCoursePublished();
    }, 1200);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 text-left">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 sm:px-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <GraduationCap className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white">
                  Course Creator &amp; Instructor Studio
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Paid Creator Tier
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Publish your life skills or professional courses on GIGWORK SITE &amp; earn up to 95% revenue payout.
              </p>
            </div>
          </div>

          <button
            onClick={resetAndClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        {!isSuccess && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-2 cursor-pointer ${
                step === 1 ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 1
                    ? 'bg-teal-600 text-white'
                    : step > 1
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > 1 ? <Check className="w-3.5 h-3.5" /> : '1'}
              </span>
              <span>1. Choose Subscription Tier</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300" />

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-2 cursor-pointer ${
                step === 2 ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 2
                    ? 'bg-teal-600 text-white'
                    : step > 2
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > 2 ? <Check className="w-3.5 h-3.5" /> : '2'}
              </span>
              <span>2. Course Details &amp; Curriculum</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300" />

            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-2 cursor-pointer ${
                step === 3 ? 'text-teal-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </span>
              <span>3. Checkout &amp; Instant Publish</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-8">
          {/* SUCCESS SCREEN */}
          {isSuccess ? (
            <div className="py-8 text-center max-w-lg mx-auto space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full">
                  Subscription Active &bull; Course Live
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Congratulations, {user.name}!
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Your course <strong className="text-slate-900">&quot;{publishedCourseTitle}&quot;</strong> has been
                  published under the <strong className="text-teal-700">{category}</strong> category and is now visible across
                  the <strong>All Categories</strong> section and Academy catalog.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Instructor Tier:</span>
                  <span className="font-bold text-slate-900">{selectedTier.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Revenue Payout Rate:</span>
                  <span className="font-black text-emerald-600">{selectedTier.revenueSharePercent}% to You</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Listing Price:</span>
                  <span className="font-bold text-slate-900">{formatPrice(price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Escrow Payout Method:</span>
                  <span className="font-bold text-teal-700 uppercase">{paymentMethod}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-2">
                <button
                  onClick={resetAndClose}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:from-teal-600 hover:to-emerald-700 transition-all cursor-pointer"
                >
                  View Course in Academy
                </button>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setStep(2);
                    setTitle('');
                  }}
                  className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-5 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Post Another Course
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* STEP 1: CHOOSE SUBSCRIPTION TIER */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center max-w-xl mx-auto">
                    <h4 className="text-xl font-black text-slate-900">
                      Select Your Instructor Subscription Tier
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Choose an educator tier that fits your catalog. Keep up to 95% of every student enrollment with instant escrow payouts.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-2 p-1 bg-slate-100 rounded-xl mt-4 border border-slate-200">
                      <button
                        type="button"
                        onClick={() => setBillingCycle('monthly')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          billingCycle === 'monthly'
                            ? 'bg-white text-slate-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Monthly Billing
                      </button>
                      <button
                        type="button"
                        onClick={() => setBillingCycle('annual')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          billingCycle === 'annual'
                            ? 'bg-teal-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <span>Annual Billing</span>
                        <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full">
                          Save 20%
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Tier Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {creatorSubscriptionTiers.map(tier => {
                      const isSelected = selectedTierId === tier.id;
                      const currentPrice =
                        billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;

                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedTierId(tier.id)}
                          className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-teal-500 bg-teal-50/20 shadow-lg ring-2 ring-teal-400/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white shadow-2xs'
                          }`}
                        >
                          {tier.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                                Most Popular Tier
                              </span>
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-slate-900">
                                {tier.name}
                              </span>
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isSelected
                                    ? 'border-teal-600 bg-teal-600 text-white'
                                    : 'border-slate-300'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-500 mt-1 min-h-[32px]">
                              {tier.tagline}
                            </p>

                            <div className="my-4 pt-3 border-t border-slate-100">
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900">
                                  {formatPrice(currentPrice)}
                                </span>
                                <span className="text-xs text-slate-400">
                                  /{billingCycle === 'annual' ? 'year' : 'month'}
                                </span>
                              </div>
                              <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                <Zap className="w-3 h-3 text-emerald-600" />
                                <span>{tier.revenueSharePercent}% Instructor Payout</span>
                              </div>
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-100">
                              {tier.features.map((feat, fi) => (
                                <div key={fi} className="flex items-start gap-2 text-xs text-slate-700">
                                  <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                                  <span className="leading-tight">{feat}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedTierId(tier.id);
                              setStep(2);
                            }}
                            className={`mt-5 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            {isSelected ? 'Continue with This Tier' : 'Select Plan'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-teal-600" /> Cancel or switch plans anytime. 100% money-back guarantee.
                    </span>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to Course Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: COURSE DETAILS & CURRICULUM */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-teal-50/70 border border-teal-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                        Selected Subscription
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        {selectedTier.name} &bull; {formatPrice(tierPrice)}/{billingCycle} ({selectedTier.revenueSharePercent}% Payout)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-teal-700 hover:underline cursor-pointer"
                    >
                      Change Tier
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Course Title */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Course Masterclass Title *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="e.g. Life Skills: Public Speaking, Interview Mastery & Executive Communication"
                        className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none font-semibold text-slate-900"
                        required
                      />
                    </div>

                    {/* Category Selector */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category (Shows in All Categories &amp; Academy) *
                      </label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl font-bold text-teal-800 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                      >
                        <option value="Life Skills">✨ Life Skills &amp; Personal Development (High Demand)</option>
                        <option value="Programming & Tech">Programming &amp; Tech</option>
                        <option value="Freelance Business">Freelance Business &amp; Agency</option>
                        <option value="Artificial Intelligence">Artificial Intelligence &amp; Prompting</option>
                        <option value="Graphics & Design">Graphics &amp; Design</option>
                        <option value="Digital Marketing">Digital Marketing &amp; Ads</option>
                        <option value="Writing & Translation">Writing &amp; Content</option>
                        <option value="Video & Animation">Video &amp; Motion Graphics</option>
                      </select>
                    </div>

                    {/* Level */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Experience Level
                      </label>
                      <select
                        value={level}
                        onChange={e => setLevel(e.target.value as any)}
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl font-semibold text-slate-700"
                      >
                        <option value="All Levels">All Levels (Beginner to Expert)</option>
                        <option value="Beginner">Beginner Friendly</option>
                        <option value="Intermediate">Intermediate Practitioner</option>
                        <option value="Advanced">Advanced Mastery</option>
                      </select>
                    </div>

                    {/* Price in USD */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student Enrollment Price (USD) *
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="number"
                          min={5}
                          value={price}
                          onChange={e => {
                            const val = Number(e.target.value);
                            setPrice(val);
                            if (val > originalPrice) setOriginalPrice(val * 2);
                          }}
                          className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        Converted price: {formatPrice(price)} &bull; Your cut: {formatPrice(price * (selectedTier.revenueSharePercent / 100))}
                      </span>
                    </div>

                    {/* Original/Discounted Price */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Original Price (for discount badge)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="number"
                          min={price}
                          value={originalPrice}
                          onChange={e => setOriginalPrice(Number(e.target.value))}
                          className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-medium text-slate-600 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                        />
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                        Shows {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF on cards
                      </span>
                    </div>

                    {/* Duration & Lessons */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Estimated Video Duration (Hours)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min={1}
                        value={durationHours}
                        onChange={e => setDurationHours(Number(e.target.value))}
                        className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Certificate Included?
                      </label>
                      <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                        <input
                          type="checkbox"
                          id="certCheck"
                          checked={certificateIncluded}
                          onChange={e => setCertificateIncluded(e.target.checked)}
                          className="w-4 h-4 text-teal-600 rounded"
                        />
                        <label htmlFor="certCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                          Issue Verified Certificate upon completion
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Course Thumbnail Image
                    </label>
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-32 aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0 shadow-2xs">
                        <img
                          src={thumbnail}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600';
                          }}
                        />
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="url"
                          value={thumbnail}
                          onChange={e => setThumbnail(e.target.value)}
                          placeholder="Paste image URL..."
                          className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
                        />
                        <div className="flex flex-wrap gap-1.5 text-[10px]">
                          <span className="text-slate-400 font-medium py-0.5">Quick Presets:</span>
                          {THUMBNAIL_PRESETS.map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setThumbnail(preset.url);
                                if (preset.category === 'Life Skills') {
                                  setCategory('Life Skills');
                                }
                              }}
                              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 transition-colors cursor-pointer"
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Course Description &amp; Overview
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe what students will master, practical exercises included, and outcomes..."
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Interactive Curriculum Builder */}
                  <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-teal-600" />
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Curriculum Modules &amp; Lessons Builder ({modules.length} Modules)
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {modules.map((mod, mIdx) => (
                        <div
                          key={mIdx}
                          className="p-3 bg-white rounded-xl border border-slate-200 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-teal-800">
                              {mod.title}
                            </span>
                            {modules.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveModule(mIdx)}
                                className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                                title="Remove module"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="space-y-1 pl-2">
                            {mod.lessons.map((lesson, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex items-center justify-between text-[11px] text-slate-600 py-0.5"
                              >
                                <div className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                  <span>{lesson}</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveLesson(mIdx, lIdx)}
                                  className="text-slate-400 hover:text-rose-600 text-[10px] cursor-pointer"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            <input
                              type="text"
                              placeholder="Add lesson title to this module..."
                              value={activeModuleIndex === mIdx ? newLessonText : ''}
                              onFocus={() => setActiveModuleIndex(mIdx)}
                              onChange={e => setNewLessonText(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddLesson(mIdx);
                                }
                              }}
                              className="flex-1 p-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddLesson(mIdx)}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
                            >
                              Add Lesson
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Add new module title (e.g. Module 4: Crisis Leadership)..."
                        value={newModuleTitle}
                        onChange={e => setNewModuleTitle(e.target.value)}
                        className="flex-1 p-2 text-xs bg-white border border-slate-200 rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={handleAddModule}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Module</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to Tiers
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Proceed to Tier Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: CHECKOUT & TIER ACTIVATION */}
              {step === 3 && (
                <form onSubmit={handlePublish} className="space-y-6">
                  <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                          Order Summary
                        </span>
                        <h4 className="text-base font-bold text-white mt-0.5">
                          {selectedTier.name} Subscription &amp; Course Publication
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-emerald-400">
                          {formatPrice(tierPrice)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          /{billingCycle}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                      <div>
                        <span className="text-slate-400">Course Title:</span>
                        <p className="font-semibold text-white truncate">{title}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Category:</span>
                        <p className="font-semibold text-teal-300">{category}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Platform Split:</span>
                        <p className="font-semibold text-emerald-300">{selectedTier.revenueSharePercent}% Instructor Payout</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Course Price:</span>
                        <p className="font-semibold text-white">{formatPrice(price)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Gateway Options */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      Select Payment Method for Subscription Tier
                    </label>

                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('mpesa')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'mpesa'
                            ? 'border-emerald-600 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Smartphone className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-black">M-Pesa (Kenya)</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Instant STK Push</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('stripe')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'stripe'
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-800 ring-2 ring-indigo-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-indigo-600" />
                        <span className="text-xs font-black">Card / Stripe</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Visa, Mastercard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          paymentMethod === 'paypal'
                            ? 'border-cyan-600 bg-cyan-50/50 text-cyan-800 ring-2 ring-cyan-500/20'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Wallet className="w-5 h-5 text-cyan-600" />
                        <span className="text-xs font-black">PayPal</span>
                        <span className="text-[10px] text-slate-400 font-semibold">Global Checkout</span>
                      </button>
                    </div>

                    {/* M-PESA Input */}
                    {paymentMethod === 'mpesa' && (
                      <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                          <span>Safaricom Daraja STK Push</span>
                          <span className="text-emerald-700">KES {(tierPrice * 132.5).toLocaleString()}</span>
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={e => setPhoneNumber(e.target.value)}
                          placeholder="e.g. 0712345678 or 254712345678"
                          className="w-full p-2.5 text-xs bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                          required
                        />
                        <p className="text-[11px] text-emerald-800">
                          A direct PIN prompt will be sent to this phone number immediately upon clicking &quot;Activate Tier &amp; Publish Course&quot;.
                        </p>
                      </div>
                    )}

                    {/* Stripe Card Input */}
                    {paymentMethod === 'stripe' && (
                      <div className="bg-indigo-50/50 border border-indigo-200 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                          <span>Credit or Debit Card</span>
                          <span>256-Bit SSL Encrypted</span>
                        </div>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                          className="w-full p-2.5 text-xs bg-white border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          required
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to Course Details
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing Payment &amp; Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>Activate Tier &amp; Publish Course</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
