export type Role = 'freelancer' | 'client' | 'affiliate' | 'admin';

export type Currency = 'USD' | 'KES' | 'EUR' | 'GBP';

export type PaymentMethod = 'mpesa' | 'paypal' | 'stripe' | 'wallet';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  title: string;
  country: string;
  rating: number;
  reviewsCount: number;
  balance: number;
  badge?: 'Top Rated' | 'Pro Verified' | 'Rising Talent' | 'Super Affiliate' | 'Agency Partner' | string;
  membershipTier: string;
  joinedDate: string;
  affiliateCode: string;
  phone?: string;
  city?: string;
  portfolioUrl?: string;
  institutionName?: string;
  institutionType?: string;
  institutionWebsite?: string;
  institutionRegNumber?: string;
  institutionDepartment?: string;
  representativeDesignation?: string;
  teamSeats?: number;
  billingAddress?: string;
  creatorTier?: 'starter_creator' | 'pro_creator' | 'enterprise_creator';
  publishedCoursesCount?: number;
}

export interface ServicePackage {
  name: string;
  price: number; // in USD
  description: string;
  deliveryDays: number;
  revisions: string;
  features: string[];
}

export interface Service {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  rating: number;
  reviewsCount: number;
  seller: {
    id: string;
    name: string;
    avatar: string;
    level: string;
    badge?: string;
    country: string;
    responseHours: number;
  };
  thumbnail: string;
  description: string;
  startingPrice: number; // in USD
  packages: {
    basic: ServicePackage;
    standard: ServicePackage;
    premium: ServicePackage;
  };
  tags: string[];
  salesCount: number;
}

export interface JobProposal {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerAvatar: string;
  freelancerBadge?: string;
  freelancerRating: number;
  bidAmount: number;
  deliveryDays: number;
  coverLetter: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budgetType: 'fixed' | 'hourly';
  budget: number; // USD
  experienceLevel: 'Entry' | 'Intermediate' | 'Expert';
  deadlineDays: number;
  skills: string[];
  client: {
    name: string;
    avatar: string;
    country: string;
    paymentVerified: boolean;
    totalSpent: number;
    rating: number;
  };
  proposalsCount: number;
  createdAt: string;
  status: 'open' | 'in_progress' | 'completed';
  proposals?: JobProposal[];
}

export interface Course {
  id: string;
  title: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
    rating: number;
  };
  thumbnail: string;
  price: number; // USD
  originalPrice: number;
  category: string;
  durationHours: number;
  lessonsCount: number;
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  studentsCount: number;
  description: string;
  curriculum: {
    title: string;
    lessons: string[];
  }[];
  certificateIncluded: boolean;
}

export interface CreatorSubscriptionTier {
  id: 'starter_creator' | 'pro_creator' | 'enterprise_creator';
  name: string;
  tagline: string;
  monthlyPrice: number; // in USD
  annualPrice: number; // in USD
  revenueSharePercent: number; // 85, 92, 95
  maxCourses: number | 'Unlimited';
  badge: string;
  popular?: boolean;
  features: string[];
}

export interface PostCourseData {
  title: string;
  category: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  durationHours: number;
  lessonsCount: number;
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  curriculum: {
    title: string;
    lessons: string[];
  }[];
  certificateIncluded: boolean;
  subscriptionTierId: 'starter_creator' | 'pro_creator' | 'enterprise_creator';
  billingCycle: 'monthly' | 'annual';
  paymentMethod: PaymentMethod;
  phoneNumber?: string;
}

export type MembershipCategory = 'freelancer' | 'client' | 'institution';

export interface MembershipPackage {
  id: string;
  category: MembershipCategory;
  name: string;
  tagline: string;
  monthlyPrice: number; // in USD
  annualPrice: number; // in USD
  badge: string;
  popular?: boolean;
  platformFeePercent?: number;
  bidsPerMonth?: number | 'Unlimited' | 'N/A';
  teamSeats?: number | 'Unlimited' | string;
  targetAudience: string;
  requiresInstitutionDetails?: boolean;
  features: string[];
}

export interface ClientDetails {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  clientCategory: string;
  skillsOrIndustry?: string;
  portfolioUrl?: string;
  taxId?: string;
}

export interface InstitutionDetails {
  institutionName: string;
  institutionType: string;
  website?: string;
  registrationNumber?: string;
  department?: string;
  representativeDesignation?: string;
  seatsRequested: number;
  campusVerificationEnabled?: boolean;
  billingAddress?: string;
}

export interface MembershipEnrollmentData {
  packageId: string;
  billingCycle: 'monthly' | 'annual';
  client: ClientDetails;
  institution?: InstitutionDetails;
  paymentMethod: PaymentMethod | 'po_invoice';
}

export interface OrderMilestone {
  id: string;
  title: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  title: string;
  itemType: 'service' | 'job' | 'course' | 'membership';
  amount: number; // in USD
  currency: Currency;
  paidAmount: number;
  paymentMethod: PaymentMethod;
  escrowStatus: 'held_in_escrow' | 'released_to_seller' | 'refunded';
  orderStatus: 'requirements_pending' | 'in_progress' | 'delivered' | 'completed' | 'revision';
  createdAt: string;
  deliveryDate: string;
  buyer: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
    email: string;
  };
  milestones: OrderMilestone[];
  deliveryNotes?: string;
  deliveryFiles?: string[];
  rating?: number;
  reviewComment?: string;
}

export interface AffiliateStats {
  referralCode: string;
  referralLink: string;
  tier: 'Bronze (5%)' | 'Silver (10%)' | 'Gold (15%)';
  commissionRate: number; // 0.05, 0.10, 0.15
  totalClicks: number;
  registeredUsers: number;
  conversionRate: number;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
  recentReferrals: {
    id: string;
    user: string;
    action: string;
    amount: number;
    commission: number;
    date: string;
    status: 'paid' | 'pending';
  }[];
  payoutHistory: {
    id: string;
    amount: number;
    method: 'M-Pesa' | 'PayPal' | 'Bank Transfer';
    account: string;
    date: string;
    status: 'completed' | 'processing';
  }[];
}

export interface Dispute {
  id: string;
  orderId: string;
  orderNumber: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  reason: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
  resolution?: string;
}

export interface GatewaySettings {
  mpesa: {
    shortcode: string;
    env: 'sandbox' | 'production';
    passkey: string;
    timeout: number;
    autoStk: boolean;
  };
  stripe: {
    publishableKey: string;
    liveMode: boolean;
    webhookActive: boolean;
  };
  paypal: {
    clientId: string;
    sandbox: boolean;
    autoCapture: boolean;
  };
}

export interface PlatformFeeSettings {
  standardFee: number; // e.g. 10
  proFee: number; // e.g. 5
  agencyFee: number; // e.g. 2.5
  affiliateCommissionRate: number; // e.g. 15
  maintenanceMode: boolean;
  announcementBanner: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  adminName: string;
  target: string;
  timestamp: string;
  details: string;
}

export type RevenueStreamType =
  | 'marketplace_fee'
  | 'membership_subscription'
  | 'academy_sales'
  | 'escrow_protection_fee'
  | 'listing_promotion';

export interface RevenueRecord {
  id: string;
  date: string;
  source: string;
  stream: RevenueStreamType;
  grossAmount: number;
  netFee: number;
  gateway: PaymentMethod;
  status: 'settled' | 'pending';
  referenceNumber: string;
}

export type AdminWithdrawalMethod =
  | 'M-Pesa Business (B2C)'
  | 'Corporate Bank Wire (USD/KES)'
  | 'PayPal Corporate'
  | 'Stripe Treasury Connect';

export interface AdminWithdrawalRecord {
  id: string;
  reference: string;
  amount: number;
  method: AdminWithdrawalMethod;
  accountDetails: string;
  status: 'completed' | 'processing' | 'scheduled';
  requestedAt: string;
  processedAt?: string;
  approvedBy: string;
  fee: number;
  netAmount: number;
  notes?: string;
}

export interface AdminTreasuryStats {
  grossRevenue: number;
  availableProfits: number;
  pendingWithdrawals: number;
  lifetimeWithdrawn: number;
  lockedUserEscrow: number;
  monthlyRunRate: number;
}


