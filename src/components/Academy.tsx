import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';
import {
  GraduationCap,
  Star,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  PlayCircle,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  Sparkles,
  Zap,
  Search,
  Check,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { LifeSkillsPostCourseSection } from './LifeSkillsPostCourseSection';

interface AcademyProps {
  onOpenPostCourse?: (tierId?: 'starter_creator' | 'pro_creator' | 'enterprise_creator', initialTitle?: string) => void;
}

export const Academy: React.FC<AcademyProps> = ({ onOpenPostCourse }) => {
  const { courses, formatPrice, enrolledCourseIds, openCheckout, creatorSubscriptionTiers, user } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const courseCategories = useMemo(() => {
    const set = new Set(courses.map(c => c.category));
    return ['All', ...Array.from(set)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesCategory =
        selectedCategory === 'All' || course.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  const handleEnroll = (course: Course) => {
    openCheckout({
      id: course.id,
      type: 'course',
      title: course.title,
      subtitle: `Masterclass by ${course.instructor.name}`,
      amount: course.price,
      sellerName: 'GigWork Academy',
      features: [
        'Lifetime On-Demand Access',
        `${course.durationHours} Hours Video Lectures`,
        `${course.lessonsCount} Hands-On Exercises`,
        'Certificate of Completion',
      ],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left">
      {/* Academy Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl relative overflow-hidden mb-8">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-teal-400" />
              <span>GIGWORK SITE Upskilling &amp; Life Skills Academy</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Master High-Income Skills &amp;{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
                Essential Life Skills
              </span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              From executive communication, personal financial literacy, and stress resilience, to M-Pesa fintech integrations and AI prompt engineering. Verified certificates &amp; lifetime access.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-semibold">Featured Topics:</span>
              <button
                onClick={() => {
                  setSelectedCategory('Life Skills');
                  setSearchQuery('');
                }}
                className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-teal-400" />
                <span>Life Skills (Negotiation &amp; Finance)</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('Payment');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                M-Pesa &amp; Stripe Gateways
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('AI');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
              >
                AI Prompt Engineering
              </button>
            </div>
          </div>

          {/* Right CTA for Instructors & Creators */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-teal-500/30 rounded-2xl p-5 text-left space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400">
                Teach &amp; Earn
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Keep up to 95%
              </span>
            </div>

            <h3 className="text-sm font-black text-white">
              Post Your Course on a Paid Creator Tier
            </h3>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Reach 45,000+ global students. Host HD video, issue verified certificates, and get instant payouts via M-Pesa &amp; PayPal.
            </p>

            <button
              onClick={() => onOpenPostCourse && onOpenPostCourse('pro_creator')}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post a Course (Creator Tier)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {courseCategories.map(cat => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const isLifeSkills = cat.toLowerCase() === 'life skills';

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-xs font-black'
                    : isLifeSkills
                    ? 'bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100 font-extrabold'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {isLifeSkills && <Sparkles className="w-3.5 h-3.5 text-teal-600" />}
                <span>{cat === 'All' ? 'All Categories' : cat}</span>
                {isLifeSkills && !isSelected && (
                  <span className="text-[9px] bg-teal-600 text-white font-bold px-1.5 py-0.2 rounded-full uppercase">
                    High Demand
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search courses, instructors, topics..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
        </div>
      </div>

      {/* Life Skills Category Active Hub: Option to Post Course, Registration Tiers & Components */}
      {selectedCategory.toLowerCase() === 'life skills' && (
        <LifeSkillsPostCourseSection
          onOpenPostCourse={(tier, title) => {
            if (onOpenPostCourse) onOpenPostCourse(tier, title);
          }}
        />
      )}

      {/* Courses Count & Instructor Prompt */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{selectedCategory === 'All' ? 'All Courses' : `${selectedCategory} Courses`}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredCourses.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {selectedCategory === 'Life Skills'
              ? 'Essential non-technical & interpersonal masterclasses for career acceleration, wealth, and resilience.'
              : 'Practical video courses with hands-on projects and accredited completion credentials.'}
          </p>
        </div>

        <button
          onClick={() => onOpenPostCourse && onOpenPostCourse('pro_creator')}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Publish Your Course</span>
        </button>
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            No courses found in &quot;{selectedCategory}&quot;
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, or be the first instructor to publish a course in this category on our paid creator subscription tier!
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={() => onOpenPostCourse && onOpenPostCourse('pro_creator')}
              className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post a Course in {selectedCategory}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Courses Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const isEnrolled = enrolledCourseIds.includes(course.id);
            const isLifeSkills = course.category.toLowerCase() === 'life skills';

            return (
              <div
                key={course.id}
                className={`bg-white rounded-2xl border overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between ${
                  isLifeSkills
                    ? 'border-teal-300/80 hover:border-teal-500'
                    : 'border-slate-200 hover:border-indigo-400'
                }`}
              >
                <div>
                  {/* Course Thumbnail */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden group">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600';
                      }}
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider backdrop-blur-md shadow-xs ${
                          isLifeSkills
                            ? 'bg-teal-900/90 text-teal-200 border border-teal-400/30'
                            : 'bg-slate-950/80 text-white'
                        }`}
                      >
                        {course.category}
                      </span>
                    </div>

                    {isEnrolled && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Enrolled
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={course.instructor.avatar}
                          alt={course.instructor.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                          {course.instructor.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{course.rating.toFixed(2)}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2 min-h-[44px]">
                      {course.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Metadata indicators */}
                    <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{course.durationHours} hrs</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        <span>{course.lessonsCount} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-3 h-3 text-emerald-500" />
                        <span>Certificate</span>
                      </div>
                    </div>

                    {/* Curriculum Preview */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Core Syllabus Modules
                      </span>
                      <div className="space-y-1">
                        {course.curriculum.slice(0, 2).map((mod, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                            <PlayCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span className="truncate">{mod.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xl font-black text-slate-900">
                          {formatPrice(course.price)}
                        </span>
                        {course.originalPrice > course.price && (
                          <span className="text-xs text-slate-400 line-through">
                            {formatPrice(course.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold block">
                        Instant Access &bull; Lifetime
                      </span>
                    </div>

                    {isEnrolled ? (
                      <button
                        onClick={() => setSelectedCourse(course)}
                        className="bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Continue</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course)}
                        className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Instructor Paid Subscription Tiers Drawer/Section */}
      <div className="mt-16 bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>For Clients, Instructors &amp; Academies</span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Instructor Subscription Tiers &amp; Course Publishing
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Monetize your expertise. Choose a plan, upload your video lessons, and reach our thriving community with automated escrow payouts.
            </p>
          </div>

          <button
            onClick={() => onOpenPostCourse && onOpenPostCourse('pro_creator')}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-xs sm:text-sm font-black px-6 py-3 rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Course Now</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creatorSubscriptionTiers.map(tier => {
            return (
              <div
                key={tier.id}
                className="bg-slate-900/80 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between hover:border-teal-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-white">{tier.name}</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                      {tier.revenueSharePercent}% Payout
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 min-h-[36px]">{tier.tagline}</p>

                  <div className="my-4 pt-3 border-t border-slate-800">
                    <span className="text-2xl font-black text-white">{formatPrice(tier.monthlyPrice)}</span>
                    <span className="text-xs text-slate-400"> /month</span>
                    <span className="text-[11px] text-emerald-400 font-bold block mt-0.5">
                      Annual: {formatPrice(tier.annualPrice)} /yr (-20%)
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {tier.features.slice(0, 4).map((feat, fi) => (
                      <div key={fi} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenPostCourse && onOpenPostCourse(tier.id)}
                  className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-teal-600 hover:text-white text-slate-200 transition-colors cursor-pointer"
                >
                  Publish with {tier.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enrolled Course Modal View */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 text-left space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">{selectedCourse.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center text-white p-6 text-center">
              <PlayCircle className="w-16 h-16 text-teal-400 animate-pulse mb-3" />
              <h4 className="text-base font-bold">Module 1: Introduction &amp; Practical Exercises</h4>
              <p className="text-xs text-slate-400 mt-1">45:20 remaining &bull; High Definition 1080p</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Curriculum Outline</h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {selectedCourse.curriculum.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-800">
                    <span className="font-bold text-teal-700">{m.title}</span>
                    <ul className="list-disc list-inside text-slate-600 text-[11px] mt-1 space-y-0.5">
                      {m.lessons.map((l, li) => (
                        <li key={li}>{l}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Certificate ready upon completion
              </span>
              <button
                onClick={() => setSelectedCourse(null)}
                className="bg-slate-900 text-white font-bold px-4 py-2 rounded-lg cursor-pointer"
              >
                Back to Academy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
