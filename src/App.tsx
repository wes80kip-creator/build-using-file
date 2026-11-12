/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServiceCard } from './components/ServiceCard';
import { ServiceModal } from './components/ServiceModal';
import { JobBoard } from './components/JobBoard';
import { Academy } from './components/Academy';
import { Memberships } from './components/Memberships';
import { AffiliateProgram } from './components/AffiliateProgram';
import { Dashboard } from './components/Dashboard';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderManagementModal } from './components/OrderManagementModal';
import { PostGigModal } from './components/PostGigModal';
import { PostJobModal } from './components/PostJobModal';
import { PostCourseModal } from './components/PostCourseModal';
import { LifeSkillsPostCourseSection } from './components/LifeSkillsPostCourseSection';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { DomainLinkingModal } from './components/DomainLinkingModal';
import { Service, Order } from './types';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';

const VALID_TABS = ['gigs', 'jobs', 'academy', 'memberships', 'affiliate', 'orders', 'dashboard', 'admin'];

const MainAppContent: React.FC = () => {
  const { services, activeOrder, setActiveOrder, addToast } = useApp();

  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam && VALID_TABS.includes(tabParam)) {
        return tabParam;
      }
    }
    return 'gigs';
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [isPostGigOpen, setIsPostGigOpen] = useState(false);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [isPostCourseOpen, setIsPostCourseOpen] = useState(false);
  const [postCourseTier, setPostCourseTier] = useState<'starter_creator' | 'pro_creator' | 'enterprise_creator'>('pro_creator');
  const [postCourseInitialTitle, setPostCourseInitialTitle] = useState<string>('');
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);

  const handleOpenPostCourse = (tierId?: 'starter_creator' | 'pro_creator' | 'enterprise_creator', initialTitle?: string) => {
    if (tierId) setPostCourseTier(tierId);
    if (initialTitle) setPostCourseInitialTitle(initialTitle);
    setIsPostCourseOpen(true);
  };

  // Sync tab navigation with browser address bar (custom domain deep linking)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (currentTab === 'gigs') {
        params.delete('tab');
      } else {
        params.set('tab', currentTab);
      }
      const qs = params.toString();
      const newRelativePathQuery = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState({ tab: currentTab }, '', newRelativePathQuery);
    }
  }, [currentTab]);

  // Handle incoming affiliate link query params (e.g. ?ref=GIG-WES80)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref');
      if (refCode) {
        localStorage.setItem('gw_referrer', refCode);
        addToast('Affiliate Partner Code Linked', `Browsing via partner referral code: ${refCode}`, 'affiliate');
      }
    }
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(services.map(s => s.category));
    return Array.from(cats);
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesCategory =
        selectedCategory === 'All' || service.category === selectedCategory;
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Primary Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenPostGig={() => setIsPostGigOpen(true)}
        onOpenPostJob={() => setIsPostJobOpen(true)}
        onOpenPostCourse={() => handleOpenPostCourse('pro_creator')}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
      />

      {/* Main Body Routing */}
      <main className="flex-1">
        {currentTab === 'gigs' && (
          <div>
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              onOpenPostCourse={() => handleOpenPostCourse('pro_creator')}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Life Skills Category Active Hub: Option to Post Course, Registration Tiers & Components */}
              {selectedCategory.toLowerCase() === 'life skills' && (
                <LifeSkillsPostCourseSection
                  onOpenPostCourse={handleOpenPostCourse}
                  onNavigateToAcademy={() => setCurrentTab('academy')}
                />
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 text-left">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-teal-600" />
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      {selectedCategory === 'All' ? 'Trending Freelance Gigs' : `${selectedCategory} Gigs`}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Showing {filteredServices.length} verified digital services with milestone escrow protection.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-medium">Sort by:</span>
                  <select className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-700 focus:outline-none">
                    <option>Most Popular</option>
                    <option>Top Rated Sellers</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>

              {filteredServices.length === 0 ? (
                <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
                  <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-800">No services found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for different keywords like &quot;React&quot;, &quot;M-Pesa&quot;, &quot;Figma&quot;, or &quot;AI&quot;.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 bg-teal-600 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onSelect={s => setSelectedService(s)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'jobs' && (
          <JobBoard onOpenPostJob={() => setIsPostJobOpen(true)} />
        )}

        {currentTab === 'academy' && (
          <Academy onOpenPostCourse={handleOpenPostCourse} />
        )}

        {currentTab === 'memberships' && <Memberships />}

        {currentTab === 'affiliate' && <AffiliateProgram />}

        {(currentTab === 'orders' || currentTab === 'dashboard') && (
          <Dashboard
            onSelectOrder={ord => setActiveOrder(ord)}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'admin' && <AdminPortal />}
      </main>

      {/* Footer */}
      <Footer
        setCurrentTab={setCurrentTab}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
      />

      {/* Global Modals */}
      <DomainLinkingModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        currentTab={currentTab}
      />

      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

      <CheckoutModal />

      <OrderManagementModal
        order={activeOrder}
        onClose={() => setActiveOrder(null)}
      />

      <PostGigModal
        isOpen={isPostGigOpen}
        onClose={() => setIsPostGigOpen(false)}
      />

      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
      />

      <PostCourseModal
        isOpen={isPostCourseOpen}
        onClose={() => setIsPostCourseOpen(false)}
        initialCategory="Life Skills"
        initialTierId={postCourseTier}
        onCoursePublished={() => setCurrentTab('academy')}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
