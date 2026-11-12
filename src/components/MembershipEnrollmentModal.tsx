import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MembershipPackage, PaymentMethod } from '../types';
import {
  X,
  Crown,
  CheckCircle2,
  Building2,
  GraduationCap,
  Briefcase,
  UserCheck,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Wallet,
  FileText,
  Sparkles,
  ArrowRight,
  Printer,
  Download,
  AlertCircle,
  Users,
  Check,
  Globe,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Layers
} from 'lucide-react';

interface MembershipEnrollmentModalProps {
  pkg: MembershipPackage | null;
  isOpen: boolean;
  onClose: () => void;
  initialBillingCycle?: 'monthly' | 'annual';
}

export const MembershipEnrollmentModal: React.FC<MembershipEnrollmentModalProps> = ({
  pkg,
  isOpen,
  onClose,
  initialBillingCycle = 'annual',
}) => {
  const { user, formatPrice, convertPrice, currency, enrollMembership, addToast } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(initialBillingCycle);
  const [activeStep, setActiveStep] = useState<'details' | 'payment' | 'confirmed'>('details');

  // Client Details
  const [fullName, setFullName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '+254 712 345 678');
  const [country, setCountry] = useState(user.country || 'Kenya');
  const [city, setCity] = useState(user.city || 'Nairobi');
  const [clientCategory, setClientCategory] = useState<string>(
    pkg?.category === 'institution'
      ? 'Institutional Representative / Dean'
      : pkg?.category === 'client'
      ? 'Hiring Client / Business Founder'
      : 'Independent Specialist / Freelancer'
  );
  const [skillsOrIndustry, setSkillsOrIndustry] = useState('Full-Stack Software Engineering & Fintech');
  const [portfolioUrl, setPortfolioUrl] = useState(user.portfolioUrl || 'https://github.com/wes80');
  const [taxId, setTaxId] = useState('');

  // Institution Details
  const isInstitutionPlan = pkg?.requiresInstitutionDetails || pkg?.category === 'institution';
  const [showInstitutionForm, setShowInstitutionForm] = useState(isInstitutionPlan);
  const [institutionName, setInstitutionName] = useState(
    user.institutionName || (pkg?.id === 'institution_academic' ? 'Nairobi Institute of Advanced Technology' : 'Starlight Digital Media Ltd')
  );
  const [institutionType, setInstitutionType] = useState(
    pkg?.id === 'institution_academic' ? 'University / Higher Education' : 'Digital Agency / Studio'
  );
  const [institutionWebsite, setInstitutionWebsite] = useState(
    pkg?.id === 'institution_academic' ? 'https://niat.ac.ke' : 'https://starlightmedia.co'
  );
  const [registrationNumber, setRegistrationNumber] = useState('REG-KE-2024-99812');
  const [department, setDepartment] = useState('School of Computing & Engineering');
  const [representativeDesignation, setRepresentativeDesignation] = useState('Director of Academic Placements');
  const [seatsRequested, setSeatsRequested] = useState<number>(
    typeof pkg?.teamSeats === 'number' ? pkg.teamSeats : 10
  );
  const [campusVerificationEnabled, setCampusVerificationEnabled] = useState(true);
  const [billingAddress, setBillingAddress] = useState('Tech Boulevard, 4th Floor, Innovation Hub, Nairobi');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | 'po_invoice'>(
    currency === 'KES' ? 'mpesa' : 'stripe'
  );
  const [mpesaPhone, setMpesaPhone] = useState(phone.replace(/[^0-9]/g, '') || '254712345678');
  const [poNumber, setPoNumber] = useState('PO-2026-GWS-891');
  const [poContactEmail, setPoContactEmail] = useState('procurement@institution.org');
  
  // Processing States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mpesaStage, setMpesaStage] = useState<'idle' | 'push_sent' | 'pin_prompt' | 'success'>('idle');
  const [mpesaCountdown, setMpesaCountdown] = useState(15);
  const [confirmedData, setConfirmedData] = useState<{
    memberId: string;
    enrollmentDate: string;
    expiryDate: string;
    packageName: string;
    badge: string;
  } | null>(null);

  // Sync when pkg opens
  useEffect(() => {
    if (pkg) {
      setBillingCycle(initialBillingCycle);
      setActiveStep('details');
      setShowInstitutionForm(Boolean(pkg.requiresInstitutionDetails || pkg.category === 'institution'));
      if (typeof pkg.teamSeats === 'number') {
        setSeatsRequested(pkg.teamSeats);
      }
    }
  }, [pkg, initialBillingCycle]);

  // Handle M-Pesa simulated STK push countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mpesaStage === 'push_sent' && mpesaCountdown > 0) {
      timer = setTimeout(() => {
        setMpesaCountdown(prev => prev - 1);
        if (mpesaCountdown === 10) {
          setMpesaStage('pin_prompt');
        }
      }, 1000);
    } else if (mpesaStage === 'pin_prompt' && mpesaCountdown > 0) {
      timer = setTimeout(() => {
        setMpesaCountdown(prev => prev - 1);
        if (mpesaCountdown <= 4) {
          finalizeEnrollment('mpesa');
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [mpesaStage, mpesaCountdown]);

  if (!isOpen || !pkg) return null;

  const rawPrice = pkg.monthlyPrice === 0 ? 0 : billingCycle === 'annual' ? pkg.annualPrice : pkg.monthlyPrice;
  const isFree = rawPrice === 0;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim() || !country.trim()) {
      addToast('Missing Details', 'Please complete all required client contact fields.', 'payment');
      return;
    }
    if (isInstitutionPlan && !institutionName.trim()) {
      addToast('Institution Name Required', 'Please provide your institutional or organization legal name.', 'payment');
      return;
    }

    if (isFree) {
      // Free enrolls immediately!
      finalizeEnrollment('wallet');
    } else {
      setActiveStep('payment');
    }
  };

  const finalizeEnrollment = (methodToUse = paymentMethod) => {
    setIsSubmitting(true);

    setTimeout(() => {
      const result = enrollMembership({
        packageId: pkg.id,
        billingCycle,
        client: {
          fullName,
          email,
          phone,
          country,
          city,
          clientCategory,
          skillsOrIndustry,
          portfolioUrl,
          taxId,
        },
        institution: showInstitutionForm
          ? {
              institutionName,
              institutionType,
              website: institutionWebsite,
              registrationNumber,
              department,
              representativeDesignation,
              seatsRequested,
              campusVerificationEnabled,
              billingAddress,
            }
          : undefined,
        paymentMethod: methodToUse,
      });

      setIsSubmitting(false);

      if (result.success) {
        const memberId = `GWS-MEM-${Math.floor(100000 + Math.random() * 900000)}`;
        const now = new Date();
        const expiry = new Date(now.getTime() + (billingCycle === 'annual' ? 365 : 30) * 86400000);

        setConfirmedData({
          memberId,
          enrollmentDate: now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          expiryDate: expiry.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          packageName: pkg.name,
          badge: pkg.badge,
        });
        setActiveStep('confirmed');
      }
    }, 1200);
  };

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'mpesa') {
      setMpesaStage('push_sent');
      setMpesaCountdown(15);
    } else {
      finalizeEnrollment(paymentMethod);
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Crown className="w-3.5 h-3.5" />
              {pkg.category === 'institution'
                ? 'Institutional & Agency Track'
                : pkg.category === 'client'
                ? 'Employer & Client Track'
                : 'Freelancer & Talent Track'}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
              Badge: {pkg.badge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Enroll into {pkg.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {pkg.tagline}
          </p>

          {/* Pricing strip in header */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-teal-400">
                {isFree ? 'Free Forever ($0.00)' : formatPrice(rawPrice)}
              </span>
              {!isFree && (
                <span className="text-slate-300 font-medium">
                  {billingCycle === 'annual' ? 'billed annually (Save 20%)' : 'billed monthly'}
                </span>
              )}
            </div>

            {!isFree && activeStep !== 'confirmed' && (
              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                    billingCycle === 'monthly' ? 'bg-teal-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    billingCycle === 'annual' ? 'bg-teal-500 text-white shadow-xs' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>Annual</span>
                  <span className="text-[9px] bg-emerald-400 text-slate-950 font-black px-1 rounded-sm uppercase">
                    -20%
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: CLIENT & INSTITUTION DETAILS */}
          {activeStep === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-6">
              {/* Progress pill indicator */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center">
                    1
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Client &amp; Professional Verification Details
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Step 1 of {isFree ? '1 (Instant Activation)' : '2 (Payment)'}
                </span>
              </div>

              {/* Supported Client Details Grid */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        placeholder="e.g. Wesley Kiprop / Sarah Jenkins"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Business / Work Email <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. wesley@company.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone / WhatsApp <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+254 712 345 678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Country <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      placeholder="e.g. Kenya, USA, UK"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Nairobi, London"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Applicant Category / Role Title
                    </label>
                    <select
                      value={clientCategory}
                      onChange={e => setClientCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500 cursor-pointer"
                    >
                      <option>Independent Specialist / Freelancer</option>
                      <option>Hiring Client / Business Founder</option>
                      <option>Agency Founder / Studio Lead</option>
                      <option>Institutional Representative / Dean</option>
                      <option>University / TVET Placement Coordinator</option>
                      <option>Corporate Talent Acquisition Executive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Primary Industry / Skills Focus
                    </label>
                    <input
                      type="text"
                      value={skillsOrIndustry}
                      onChange={e => setSkillsOrIndustry(e.target.value)}
                      placeholder="e.g. Fintech, UI/UX, AI, Mobile Apps"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Portfolio / Company / LinkedIn URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={portfolioUrl}
                      onChange={e => setPortfolioUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/... or portfolio"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tax ID / VAT / KRA PIN (Optional for Billing)
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={e => setTaxId(e.target.value)}
                      placeholder="e.g. P051234567X"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: INSTITUTION DETAILS (SUPPORTED / WHERE APPLICABLE) */}
              <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
                isInstitutionPlan
                  ? 'bg-gradient-to-br from-teal-50/50 to-emerald-50/50 border-teal-200 ring-2 ring-teal-500/20'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building2 className={`w-5 h-5 ${isInstitutionPlan ? 'text-teal-600' : 'text-slate-600'}`} />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        Institutional &amp; Organization Credentials
                        {isInstitutionPlan && (
                          <span className="bg-teal-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase">
                            Required for this Tier
                          </span>
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {isInstitutionPlan
                          ? 'Enables campus placement pipelines, bulk student seats, and authorized employer governance.'
                          : 'Supported where applicable for colleges, agencies, companies & institutions.'}
                      </p>
                    </div>
                  </div>

                  {!isInstitutionPlan && (
                    <button
                      type="button"
                      onClick={() => setShowInstitutionForm(!showInstitutionForm)}
                      className="text-xs font-bold text-teal-600 hover:text-teal-700 underline cursor-pointer"
                    >
                      {showInstitutionForm ? 'Hide Details' : '+ Add Institution'}
                    </button>
                  )}
                </div>

                {(showInstitutionForm || isInstitutionPlan) && (
                  <div className="space-y-4 pt-3 border-t border-slate-200/80">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Legal Institution / Company Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={isInstitutionPlan}
                          value={institutionName}
                          onChange={e => setInstitutionName(e.target.value)}
                          placeholder="e.g. University of Nairobi / Moringa School"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Institution Type
                        </label>
                        <select
                          value={institutionType}
                          onChange={e => setInstitutionType(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-teal-500 cursor-pointer"
                        >
                          <option>University / Higher Education</option>
                          <option>Vocational College / Technical Institute (TVET)</option>
                          <option>Coding Bootcamp / Tech Academy</option>
                          <option>Digital Agency / Studio</option>
                          <option>Corporate Enterprise</option>
                          <option>NGO / Non-Profit / Skills Program</option>
                          <option>Government Body</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Official Website / Domain
                        </label>
                        <input
                          type="url"
                          value={institutionWebsite}
                          onChange={e => setInstitutionWebsite(e.target.value)}
                          placeholder="https://uonbi.ac.ke or .org"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Registration / Tax PIN
                        </label>
                        <input
                          type="text"
                          value={registrationNumber}
                          onChange={e => setRegistrationNumber(e.target.value)}
                          placeholder="e.g. REG-2024-8841"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Seats Requested / Allocation
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            value={seatsRequested}
                            onChange={e => setSeatsRequested(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-teal-500"
                          />
                          <span className="text-[11px] font-bold text-slate-500 shrink-0">
                            Seats
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Department / Faculty / Unit
                        </label>
                        <input
                          type="text"
                          value={department}
                          onChange={e => setDepartment(e.target.value)}
                          placeholder="e.g. School of Computing & Informatics"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-teal-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Authorized Representative Designation
                        </label>
                        <input
                          type="text"
                          value={representativeDesignation}
                          onChange={e => setRepresentativeDesignation(e.target.value)}
                          placeholder="e.g. Dean of Students / Managing Director"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-teal-500"
                        />
                      </div>
                    </div>

                    <div className="bg-white/80 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="campusVerif"
                        checked={campusVerificationEnabled}
                        onChange={e => setCampusVerificationEnabled(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-teal-600 rounded cursor-pointer"
                      />
                      <label htmlFor="campusVerif" className="text-xs text-slate-700 cursor-pointer">
                        <span className="font-bold block">Enable Automated Student Portfolio Verification</span>
                        Alumni and students enrolled under this institution will automatically receive the official <strong>&quot;Verified Campus Graduate&quot;</strong> badge and direct matching with hiring employers.
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Verifying details...</span>
                  ) : isFree ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Complete Free Enrollment &amp; Activate</span>
                    </>
                  ) : (
                    <>
                      <span>Continue to Payment &amp; Settlement</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT & SETTLEMENT (FOR PAID TIERS) */}
          {activeStep === 'payment' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center">
                    2
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Payment &amp; Provisioning Settlement
                  </span>
                </div>
                <button
                  onClick={() => setActiveStep('details')}
                  className="text-xs font-bold text-teal-600 hover:underline cursor-pointer"
                >
                  &larr; Back to Details
                </button>
              </div>

              {/* Plan Summary Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-teal-600" />
                    <span className="text-sm font-black text-slate-900">{pkg.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 uppercase">
                      {billingCycle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Enrolling: {fullName} {institutionName ? `(${institutionName})` : ''}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-slate-900">
                    {formatPrice(rawPrice)}
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600">
                    {billingCycle === 'annual' ? 'Saved 20% vs monthly' : 'Flexible monthly renewal'}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Settlement Method:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'mpesa'
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-black">M-Pesa Express</span>
                    <span className="text-[9px] text-slate-400">Kenya / KES STK</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('stripe')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'stripe'
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-black">Credit / Debit</span>
                    <span className="text-[9px] text-slate-400">Stripe Global</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'paypal'
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Wallet className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-black">PayPal</span>
                    <span className="text-[9px] text-slate-400">Instant Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'wallet'
                        ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 text-teal-600" />
                    <span className="text-xs font-black">GWS Wallet</span>
                    <span className="text-[9px] text-emerald-600 font-bold">{formatPrice(user.balance)}</span>
                  </button>
                </div>

                {/* Additional option for Institutions: Purchase Order & Invoice */}
                {isInstitutionPlan && (
                  <div className="mt-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('po_invoice')}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        paymentMethod === 'po_invoice'
                          ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-500/20'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-amber-600" />
                        <div>
                          <div className="text-xs font-black">Institutional Purchase Order (PO) &amp; Net-30 Invoiced Wire</div>
                          <div className="text-[11px] text-slate-500">
                            Generates an official GIGWORK SITE Corporate Proforma Invoice for University/Company procurement.
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        PO Terms
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* METHOD-SPECIFIC FORMS */}
              {paymentMethod === 'mpesa' && (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-emerald-600" />
                      <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                        Lipa na M-Pesa Online (STK Push)
                      </h4>
                    </div>
                    <span className="text-xs font-black text-emerald-700">
                      KES {(convertPrice(rawPrice) * (currency === 'KES' ? 1 : 130)).toLocaleString('en-KE', { maximumFractionDigits: 0 })}
                    </span>
                  </div>

                  {mpesaStage === 'idle' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          M-Pesa Registered Mobile Number:
                        </label>
                        <input
                          type="text"
                          value={mpesaPhone}
                          onChange={e => setMpesaPhone(e.target.value)}
                          placeholder="254712345678"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-emerald-500"
                        />
                        <span className="text-[10px] text-slate-500 mt-1 block">
                          You will receive a prompt on this phone to enter your 4-digit M-Pesa PIN.
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleStartPayment}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>Send M-Pesa STK Push Now</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-5 border border-emerald-200 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <h5 className="text-sm font-black text-slate-900">
                        {mpesaStage === 'push_sent' ? 'STK Prompt Dispatched to Phone' : 'Enter PIN on Phone'}
                      </h5>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto">
                        Please check phone <strong>{mpesaPhone}</strong> and enter your M-Pesa secret PIN to approve {formatPrice(rawPrice)}.
                      </p>
                      <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                        <span>Waiting for Safaricom confirmation... ({mpesaCountdown}s)</span>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => finalizeEnrollment('mpesa')}
                          className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                        >
                          Simulate Instant PIN Approval
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'stripe' && (
                <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                        Stripe Secure Card Checkout
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-indigo-700">AES-256 Encrypted</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        defaultValue={fullName}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Card Number</label>
                        <input
                          type="text"
                          defaultValue="4242 •••• •••• 4242"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Exp / CVC</label>
                        <input
                          type="text"
                          defaultValue="12/28 - 884"
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => finalizeEnrollment('stripe')}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Pay {formatPrice(rawPrice)} with Card</span>
                    </button>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 text-center space-y-3">
                  <Wallet className="w-8 h-8 text-blue-600 mx-auto" />
                  <h4 className="text-xs font-black text-blue-950 uppercase">
                    Connect PayPal Account
                  </h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    One-click recurring or annual billing processed securely via PayPal.
                  </p>
                  <button
                    type="button"
                    onClick={() => finalizeEnrollment('paypal')}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Authorize {formatPrice(rawPrice)} via PayPal</span>
                  </button>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="bg-teal-50/50 border border-teal-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Available Wallet Balance:</span>
                    <span className="text-sm font-black text-teal-700">{formatPrice(user.balance)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-teal-200/60 pt-2">
                    <span className="text-xs font-bold text-slate-700">Membership Fee:</span>
                    <span className="text-sm font-black text-slate-900">{formatPrice(rawPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-teal-200/60 pt-2 text-xs">
                    <span className="text-slate-500">Remaining Balance:</span>
                    <span className="font-bold text-slate-700">
                      {formatPrice(Math.max(0, user.balance - rawPrice))}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => finalizeEnrollment('wallet')}
                    className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Deduct {formatPrice(rawPrice)} &amp; Activate Now</span>
                  </button>
                </div>
              )}

              {paymentMethod === 'po_invoice' && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                      Institutional Purchase Order &amp; Proforma Invoice
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Your institutional membership will be provisioned immediately. An official Net-30 invoice will be dispatched to your accounts payable department.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Institutional PO / Reference #
                      </label>
                      <input
                        type="text"
                        value={poNumber}
                        onChange={e => setPoNumber(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Accounts Payable Email
                      </label>
                      <input
                        type="email"
                        value={poContactEmail}
                        onChange={e => setPoContactEmail(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => finalizeEnrollment('po_invoice')}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Generate Proforma PO &amp; Provision Membership</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: CONFIRMATION & DIGITAL MEMBERSHIP CARD */}
          {activeStep === 'confirmed' && confirmedData && (
            <div className="space-y-6 text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Membership Enrolled &amp; Activated!
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Welcome to <strong>{confirmedData.packageName}</strong>. Your verified credentials, badges, platform fee discounts, and seat allocations are now active.
                </p>
              </div>

              {/* Digital Membership Card Preview */}
              <div className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl p-6 shadow-2xl border-2 border-teal-500/40 relative overflow-hidden text-left">
                {/* Background decorative watermark */}
                <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
                  <Crown className="w-44 h-44 text-teal-400" />
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500 text-slate-950 font-black text-xs flex items-center justify-center shadow-md">
                      GW
                    </div>
                    <div>
                      <div className="text-[11px] font-black tracking-widest text-teal-400 uppercase">
                        GIGWORK SITE
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Official Membership Pass
                      </div>
                    </div>
                  </div>

                  <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                    {confirmedData.badge}
                  </span>
                </div>

                <div className="space-y-3 my-4">
                  <div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Member Name / Delegate
                    </div>
                    <div className="text-base font-black text-white">{fullName}</div>
                  </div>

                  {institutionName && (
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Affiliated Institution / Agency
                      </div>
                      <div className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{institutionName} ({seatsRequested} Seats)</span>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">Member ID:</span>
                      <span className="font-mono font-bold text-slate-200">{confirmedData.memberId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Expiry / Renews:</span>
                      <span className="font-bold text-teal-300">{confirmedData.expiryDate}</span>
                    </div>
                  </div>
                </div>

                {/* Footer validation */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Cryptographically Verified on www.gigworksite.com</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">STATUS: ACTIVE</span>
                </div>
              </div>

              {/* Action buttons on completion */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Membership Certificate</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Done &amp; Continue to Platform</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
