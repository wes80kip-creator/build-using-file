import React, { createContext, useContext, useState } from 'react';
import {
  User,
  Role,
  Currency,
  Service,
  Job,
  Course,
  MembershipPackage,
  AffiliateStats,
  Order,
  PaymentMethod,
  Dispute,
  GatewaySettings,
  PlatformFeeSettings,
  AdminAuditLog,
  RevenueRecord,
  AdminWithdrawalRecord,
  AdminWithdrawalMethod,
  AdminTreasuryStats,
  ClientDetails,
  InstitutionDetails,
  MembershipEnrollmentData,
  CreatorSubscriptionTier,
  PostCourseData,
} from '../types';
import {
  INITIAL_USER,
  CURRENCY_RATES,
  INITIAL_SERVICES,
  INITIAL_JOBS,
  INITIAL_COURSES,
  MEMBERSHIP_PACKAGES,
  CREATOR_SUBSCRIPTION_TIERS,
  INITIAL_ORDERS,
  INITIAL_AFFILIATE_STATS,
  MOCK_USERS,
  INITIAL_DISPUTES,
  INITIAL_GATEWAY_SETTINGS,
  INITIAL_PLATFORM_FEE_SETTINGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_REVENUE_RECORDS,
  INITIAL_ADMIN_WITHDRAWALS,
  INITIAL_TREASURY_STATS,
} from '../data/mockData';

export interface CheckoutItem {
  id: string;
  type: 'service' | 'job' | 'course' | 'membership';
  title: string;
  subtitle: string;
  amount: number; // in USD
  sellerName?: string;
  packageName?: string;
  deliveryDays?: number;
  features?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'payment' | 'order' | 'proposal' | 'affiliate';
}

interface AppContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  switchRole: (role: Role) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUSD: number, showSymbolOnly?: boolean) => string;
  convertPrice: (amountInUSD: number) => number;
  
  services: Service[];
  addService: (newService: Omit<Service, 'id' | 'rating' | 'reviewsCount' | 'salesCount'>) => void;
  
  jobs: Job[];
  addJob: (newJob: Omit<Job, 'id' | 'createdAt' | 'proposalsCount' | 'status'>) => void;
  submitProposal: (jobId: string, bidAmount: number, deliveryDays: number, coverLetter: string) => void;
  
  courses: Course[];
  enrolledCourseIds: string[];
  creatorSubscriptionTiers: CreatorSubscriptionTier[];
  addCourse: (courseData: PostCourseData) => { course: Course; order?: Order; success: boolean; message: string };
  
  membershipPackages: MembershipPackage[];
  enrollMembership: (data: MembershipEnrollmentData) => { order?: Order; success: boolean; message: string };
  
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  createOrderFromCheckout: (paymentMethod: PaymentMethod, txRef?: string) => Order;
  releaseEscrow: (orderId: string) => void;
  submitDelivery: (orderId: string, notes: string) => void;
  submitReview: (orderId: string, rating: number, comment: string) => void;
  
  affiliateStats: AffiliateStats;
  requestAffiliatePayout: (amount: number, method: 'M-Pesa' | 'PayPal' | 'Bank Transfer', account: string) => boolean;
  approveAffiliatePayout: (payoutId: string) => void;
  
  // Checkout Modal State
  checkoutItem: CheckoutItem | null;
  isCheckoutOpen: boolean;
  openCheckout: (item: CheckoutItem) => void;
  closeCheckout: () => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationsAsRead: () => void;
  addToast: (title: string, message: string, type?: NotificationItem['type']) => void;

  // Admin Portal App Controls
  allUsers: User[];
  updateUserBadge: (userId: string, badge: string) => void;
  toggleUserSuspension: (userId: string) => void;
  adjustUserBalance: (userId: string, amount: number) => void;
  disputes: Dispute[];
  resolveDispute: (disputeId: string, outcome: 'release_to_seller' | 'refund_buyer' | 'split') => void;
  gatewaySettings: GatewaySettings;
  updateGatewaySettings: (settings: Partial<GatewaySettings>) => void;
  platformFeeSettings: PlatformFeeSettings;
  updatePlatformFeeSettings: (settings: Partial<PlatformFeeSettings>) => void;
  auditLogs: AdminAuditLog[];
  addAuditLog: (action: string, target: string, details: string) => void;
  toggleServiceFeature: (serviceId: string) => void;
  removeService: (serviceId: string) => void;
  removeJob: (jobId: string) => void;

  // Revenue Generation & Treasury Controls
  revenueRecords: RevenueRecord[];
  adminWithdrawals: AdminWithdrawalRecord[];
  treasuryStats: AdminTreasuryStats;
  requestAdminWithdrawal: (
    amount: number,
    method: AdminWithdrawalMethod,
    accountDetails: string,
    notes?: string
  ) => boolean;
  approveAdminWithdrawal: (withdrawalId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [creatorSubscriptionTiers] = useState<CreatorSubscriptionTier[]>(CREATOR_SUBSCRIPTION_TIERS);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(['crs_2']);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats>(INITIAL_AFFILIATE_STATS);
  
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Admin Portal States
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [disputes, setDisputes] = useState<Dispute[]>(INITIAL_DISPUTES);
  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>(INITIAL_GATEWAY_SETTINGS);
  const [platformFeeSettings, setPlatformFeeSettings] = useState<PlatformFeeSettings>(INITIAL_PLATFORM_FEE_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_AUDIT_LOGS);

  // Revenue & Treasury States
  const [revenueRecords, setRevenueRecords] = useState<RevenueRecord[]>(INITIAL_REVENUE_RECORDS);
  const [adminWithdrawals, setAdminWithdrawals] = useState<AdminWithdrawalRecord[]>(INITIAL_ADMIN_WITHDRAWALS);
  const [treasuryStats, setTreasuryStats] = useState<AdminTreasuryStats>(INITIAL_TREASURY_STATS);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n_1',
      title: 'Escrow Milestone Funded',
      message: 'Kiprono deposited $100.00 in escrow for Milestone 1.',
      timestamp: '10 mins ago',
      read: false,
      type: 'payment',
    },
    {
      id: 'n_2',
      title: 'Affiliate Commission Earned',
      message: 'You earned $27.00 from a Pro Membership referral!',
      timestamp: '2 hours ago',
      read: false,
      type: 'affiliate',
    },
    {
      id: 'n_3',
      title: 'New Job Invite',
      message: 'Nairobi Tech Ventures invited you to bid on "Multi-Vendor E-Commerce Platform".',
      timestamp: '5 hours ago',
      read: true,
      type: 'proposal',
    },
  ]);

  const switchRole = (newRole: Role) => {
    setUser(prev => ({
      ...prev,
      role: newRole,
    }));
    addToast('Role Switched', `You are now viewing GigWork as ${newRole.toUpperCase()}.`, 'order');
  };

  const convertPrice = (amountInUSD: number): number => {
    const rateInfo = CURRENCY_RATES[currency];
    return Math.round(amountInUSD * rateInfo.rate * 100) / 100;
  };

  const formatPrice = (amountInUSD: number, showSymbolOnly = false): string => {
    const rateInfo = CURRENCY_RATES[currency];
    const converted = amountInUSD * rateInfo.rate;

    if (currency === 'KES') {
      const formatted = converted.toLocaleString('en-KE', { maximumFractionDigits: 0 });
      return showSymbolOnly ? `${rateInfo.symbol} ${formatted}` : `${rateInfo.symbol} ${formatted}`;
    }

    const formatted = converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${rateInfo.symbol}${formatted}`;
  };

  const openCheckout = (item: CheckoutItem) => {
    setCheckoutItem(item);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutItem(null);
  };

  const addToast = (title: string, message: string, type: NotificationItem['type'] = 'order') => {
    const newNotif: NotificationItem = {
      id: 'notif_' + Date.now(),
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const createOrderFromCheckout = (paymentMethod: PaymentMethod, txRef?: string): Order => {
    if (!checkoutItem) throw new Error('No checkout item');

    const orderNum = `GW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      title: checkoutItem.title,
      itemType: checkoutItem.type,
      amount: checkoutItem.amount,
      currency,
      paidAmount: checkoutItem.amount,
      paymentMethod,
      escrowStatus: checkoutItem.type === 'service' || checkoutItem.type === 'job' ? 'held_in_escrow' : 'released_to_seller',
      orderStatus: checkoutItem.type === 'course' || checkoutItem.type === 'membership' ? 'completed' : 'in_progress',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + (checkoutItem.deliveryDays || 3) * 86400000).toISOString(),
      buyer: {
        name: user.name,
        email: user.email,
      },
      seller: {
        name: checkoutItem.sellerName || 'GIGWORK SITE Provider',
        email: 'info@gigworksite.com',
      },
      milestones: [
        {
          id: `m_${Date.now()}`,
          title: checkoutItem.packageName ? `${checkoutItem.packageName} Package Scope` : 'Order Fulfillment',
          amount: checkoutItem.amount,
          status: checkoutItem.type === 'course' ? 'completed' : 'in_progress',
          dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        },
      ],
    };

    setOrders(prev => [newOrder, ...prev]);

    if (checkoutItem.type === 'course') {
      setEnrolledCourseIds(prev => [...prev, checkoutItem.id]);
    } else if (checkoutItem.type === 'membership') {
      setUser(prev => ({
        ...prev,
        membershipTier: (checkoutItem.id as 'starter' | 'pro' | 'agency') || 'pro',
        badge: checkoutItem.id === 'agency' ? 'Agency Partner' : 'Pro Verified',
      }));
    }

    // Automatically record revenue transaction for Admin Tracking System
    let netPlatformFee = 0;
    if (checkoutItem.type === 'service' || checkoutItem.type === 'job') {
      netPlatformFee = checkoutItem.amount * (platformFeeSettings.standardFee / 100) + 2.50;
    } else {
      netPlatformFee = checkoutItem.amount; // 100% of memberships and academy courses go to platform revenue
    }

    const revRecord: RevenueRecord = {
      id: `rev_${Date.now()}`,
      date: 'Just now',
      source: `Order #${orderNum} (${checkoutItem.title.substring(0, 30)})`,
      stream:
        checkoutItem.type === 'membership'
          ? 'membership_subscription'
          : checkoutItem.type === 'course'
          ? 'academy_sales'
          : 'marketplace_fee',
      grossAmount: checkoutItem.amount,
      netFee: netPlatformFee,
      gateway: paymentMethod,
      status: 'settled',
      referenceNumber: txRef || `TXN-${orderNum}`,
    };

    setRevenueRecords(prev => [revRecord, ...prev]);
    setTreasuryStats(prev => ({
      ...prev,
      grossRevenue: prev.grossRevenue + netPlatformFee,
      availableProfits: prev.availableProfits + netPlatformFee,
    }));

    addToast(
      'Order Placed Successfully!',
      `Order ${orderNum} confirmed via ${paymentMethod.toUpperCase()}${txRef ? ` (Ref: ${txRef})` : ''}.`,
      'payment'
    );

    return newOrder;
  };

  const enrollMembership = (data: MembershipEnrollmentData): { order?: Order; success: boolean; message: string } => {
    const pkg = MEMBERSHIP_PACKAGES.find(p => p.id === data.packageId);
    if (!pkg) {
      return { success: false, message: 'Membership package not found.' };
    }

    const price = pkg.monthlyPrice === 0
      ? 0
      : data.billingCycle === 'annual'
      ? pkg.annualPrice
      : pkg.monthlyPrice;

    // Check wallet balance if payment is wallet
    if (price > 0 && data.paymentMethod === 'wallet') {
      if (user.balance < price) {
        addToast(
          'Insufficient Balance',
          `Your wallet balance is ${formatPrice(user.balance)}, but ${formatPrice(price)} is required.`,
          'payment'
        );
        return { success: false, message: 'Insufficient wallet balance.' };
      }
      setUser(prev => ({
        ...prev,
        balance: Math.max(0, prev.balance - price),
      }));
    }

    // Update user profile with supported & required client & institution details
    setUser(prev => ({
      ...prev,
      name: data.client.fullName || prev.name,
      email: data.client.email || prev.email,
      phone: data.client.phone || prev.phone,
      country: data.client.country || prev.country,
      city: data.client.city || prev.city,
      portfolioUrl: data.client.portfolioUrl || prev.portfolioUrl,
      membershipTier: pkg.id,
      badge: pkg.badge,
      institutionName: data.institution?.institutionName || prev.institutionName,
      institutionType: data.institution?.institutionType || prev.institutionType,
      institutionWebsite: data.institution?.website || prev.institutionWebsite,
      institutionRegNumber: data.institution?.registrationNumber || prev.institutionRegNumber,
      institutionDepartment: data.institution?.department || prev.institutionDepartment,
      representativeDesignation: data.institution?.representativeDesignation || prev.representativeDesignation,
      teamSeats: data.institution?.seatsRequested || (typeof pkg.teamSeats === 'number' ? pkg.teamSeats : 1),
      billingAddress: data.institution?.billingAddress || data.client.taxId || prev.billingAddress,
    }));

    let createdOrder: Order | undefined;
    const orderNum = `GW-MEM-${Math.floor(10000 + Math.random() * 90000)}`;
    const txRef = data.paymentMethod === 'po_invoice'
      ? `PO-${Date.now().toString().slice(-6)}`
      : `TXN-${orderNum}`;

    if (price > 0 || data.paymentMethod === 'po_invoice') {
      createdOrder = {
        id: `ord_${Date.now()}`,
        orderNumber: orderNum,
        title: `${pkg.name} (${data.billingCycle.toUpperCase()})`,
        itemType: 'membership',
        amount: price,
        currency,
        paidAmount: data.paymentMethod === 'po_invoice' ? 0 : price,
        paymentMethod: data.paymentMethod === 'po_invoice' ? 'wallet' : data.paymentMethod,
        escrowStatus: 'released_to_seller',
        orderStatus: 'completed',
        createdAt: new Date().toISOString(),
        deliveryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
        buyer: {
          name: data.client.fullName,
          email: data.client.email,
        },
        seller: {
          name: 'GIGWORK SITE Platform',
          email: 'info@gigworksite.com',
        },
        milestones: [
          {
            id: `m_${Date.now()}`,
            title: `${pkg.name} Tier Enrollment & Privileges Provisioning`,
            amount: price,
            status: 'completed',
            dueDate: new Date().toISOString().split('T')[0],
          },
        ],
      };

      setOrders(prev => [createdOrder!, ...prev]);

      // Record platform revenue transaction
      const revRecord: RevenueRecord = {
        id: `rev_${Date.now()}`,
        date: 'Just now',
        source: `Membership: ${pkg.name} (${data.client.fullName}${data.institution?.institutionName ? ` - ${data.institution.institutionName}` : ''})`,
        stream: 'membership_subscription',
        grossAmount: price,
        netFee: price,
        gateway: (data.paymentMethod === 'po_invoice' ? 'wallet' : data.paymentMethod) as PaymentMethod,
        status: data.paymentMethod === 'po_invoice' ? 'pending' : 'settled',
        referenceNumber: txRef,
      };

      setRevenueRecords(prev => [revRecord, ...prev]);

      if (data.paymentMethod !== 'po_invoice') {
        setTreasuryStats(prev => ({
          ...prev,
          grossRevenue: prev.grossRevenue + price,
          availableProfits: prev.availableProfits + price,
        }));
      }
    }

    // Record audit log in Admin Portal
    const logItem: AdminAuditLog = {
      id: `log_${Date.now()}`,
      action: 'MEMBERSHIP_ENROLLMENT',
      adminName: 'SYSTEM_AUTOMATION',
      target: `${data.client.fullName} (${pkg.name})`,
      timestamp: 'Just now',
      details: `Enrolled into ${pkg.name} [${pkg.category.toUpperCase()}]. Billing: ${data.billingCycle.toUpperCase()}.${
        data.institution?.institutionName
          ? ` Institution: ${data.institution.institutionName} (${data.institution.seatsRequested} seats, Dept: ${data.institution.department || 'N/A'})`
          : ''
      }`,
    };
    setAuditLogs(prev => [logItem, ...prev]);

    addToast(
      'Membership Activated!',
      `You are now successfully enrolled in ${pkg.name}. Badge: ${pkg.badge}`,
      'order'
    );

    return {
      order: createdOrder,
      success: true,
      message: `Successfully enrolled in ${pkg.name}!`,
    };
  };

  const releaseEscrow = (orderId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            escrowStatus: 'released_to_seller',
            orderStatus: 'completed',
          };
        }
        return ord;
      })
    );
    addToast('Escrow Released', 'Funds have been securely released to the seller.', 'payment');
  };

  const submitDelivery = (orderId: string, notes: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            orderStatus: 'delivered',
            deliveryNotes: notes,
          };
        }
        return ord;
      })
    );
    addToast('Delivery Submitted', 'The buyer has been notified to review and release funds.', 'order');
  };

  const submitReview = (orderId: string, rating: number, comment: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            rating,
            reviewComment: comment,
          };
        }
        return ord;
      })
    );
    addToast('Review Submitted', `Thank you for rating this service ${rating} stars!`, 'order');
  };

  const addService = (newServiceData: Omit<Service, 'id' | 'rating' | 'reviewsCount' | 'salesCount'>) => {
    const service: Service = {
      ...newServiceData,
      id: `srv_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
    };
    setServices(prev => [service, ...prev]);
    addToast('Gig Published', `Your gig "${service.title.substring(0, 30)}..." is now live!`, 'order');
  };

  const addJob = (newJobData: Omit<Job, 'id' | 'createdAt' | 'proposalsCount' | 'status'>) => {
    const job: Job = {
      ...newJobData,
      id: `job_${Date.now()}`,
      createdAt: 'Just now',
      proposalsCount: 0,
      status: 'open',
    };
    setJobs(prev => [job, ...prev]);
    addToast('Job Posted', `Your job requirement is now open for bids.`, 'proposal');
  };

  const addCourse = (courseData: PostCourseData): { course: Course; order?: Order; success: boolean; message: string } => {
    const tier = creatorSubscriptionTiers.find(t => t.id === courseData.subscriptionTierId) || creatorSubscriptionTiers[0];
    const price = courseData.billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;

    const newCourse: Course = {
      id: `crs_${Date.now()}`,
      title: courseData.title,
      instructor: {
        name: user.name || 'Certified Instructor',
        title: user.title || `${tier.badge} & Masterclass Creator`,
        avatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        rating: 5.0,
      },
      thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=600',
      price: courseData.price,
      originalPrice: courseData.originalPrice || Math.round(courseData.price * 2.5),
      category: courseData.category,
      durationHours: courseData.durationHours,
      lessonsCount: courseData.lessonsCount,
      level: courseData.level,
      rating: 5.0,
      studentsCount: 0,
      description: courseData.description,
      curriculum: courseData.curriculum && courseData.curriculum.length > 0 ? courseData.curriculum : [
        {
          title: 'Module 1: Foundations & Core Concepts',
          lessons: ['Introduction and course roadmap', 'Core principles & framework breakdown', 'Hands-on practical walkthrough'],
        },
      ],
      certificateIncluded: courseData.certificateIncluded,
    };

    setCourses(prev => [newCourse, ...prev]);

    // Create subscription order for the paid creator tier
    const orderNum = `GW-CREATOR-${Math.floor(1000 + Math.random() * 9000)}`;
    const txRef = courseData.paymentMethod === 'mpesa'
      ? `MPESA-STK-${Date.now().toString().slice(-6)}`
      : `TX-${orderNum}`;

    const createdOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: orderNum,
      title: `${tier.name} (${courseData.billingCycle === 'annual' ? 'Annual Plan -20%' : 'Monthly Plan'}) & Course Publication`,
      itemType: 'membership',
      amount: price,
      currency,
      paidAmount: price,
      paymentMethod: courseData.paymentMethod,
      escrowStatus: 'released_to_seller',
      orderStatus: 'completed',
      createdAt: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 30 * 86400000).toISOString(),
      buyer: {
        name: user.name,
        email: user.email,
      },
      seller: {
        name: 'GIGWORK SITE Digital Academy',
        email: 'academy@gigworksite.com',
      },
      milestones: [
        {
          id: `m_crt_${Date.now()}`,
          title: `${tier.name} Access & Course "${newCourse.title.substring(0, 30)}..." Published to All Categories`,
          amount: price,
          status: 'completed',
          dueDate: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setOrders(prev => [createdOrder, ...prev]);

    // Update user creator status and badge
    setUser(prev => ({
      ...prev,
      creatorTier: tier.id,
      publishedCoursesCount: (prev.publishedCoursesCount || 0) + 1,
      badge: prev.badge || tier.badge,
    }));

    // Record platform revenue from Creator Tier subscription
    const revRecord: RevenueRecord = {
      id: `rev_${Date.now()}`,
      date: 'Just now',
      source: `Creator Subscription: ${tier.name} (${user.name}) - Published "${newCourse.title.substring(0, 25)}"`,
      stream: 'membership_subscription',
      grossAmount: price,
      netFee: price,
      gateway: courseData.paymentMethod,
      status: 'settled',
      referenceNumber: txRef,
    };

    setRevenueRecords(prev => [revRecord, ...prev]);
    setTreasuryStats(prev => ({
      ...prev,
      grossRevenue: prev.grossRevenue + price,
      availableProfits: prev.availableProfits + price,
    }));

    // Admin audit log
    const logItem: AdminAuditLog = {
      id: `log_${Date.now()}`,
      action: 'CREATOR_TIER_SUBSCRIBED',
      adminName: 'SYSTEM_AUTOMATION',
      target: `${user.name} (${tier.name})`,
      timestamp: 'Just now',
      details: `Client subscribed to ${tier.name} ($${price}/${courseData.billingCycle}) via ${courseData.paymentMethod.toUpperCase()}. Published course "${newCourse.title}" under category "${newCourse.category}". Revenue share: ${tier.revenueSharePercent}%.`,
    };
    setAuditLogs(prev => [logItem, ...prev]);

    addToast(
      'Course Published & Creator Tier Active!',
      `"${newCourse.title}" is now live on the Academy under ${newCourse.category}! Your ${tier.name} (${tier.revenueSharePercent}% revenue share) is activated.`,
      'order'
    );

    return {
      course: newCourse,
      order: createdOrder,
      success: true,
      message: `Your course was successfully published under ${newCourse.category} on the ${tier.name} subscription!`,
    };
  };

  const submitProposal = (jobId: string, bidAmount: number, deliveryDays: number, coverLetter: string) => {
    setJobs(prev =>
      prev.map(j => {
        if (j.id === jobId) {
          return {
            ...j,
            proposalsCount: j.proposalsCount + 1,
          };
        }
        return j;
      })
    );
    addToast('Proposal Sent', `Your bid of $${bidAmount} was submitted to the client!`, 'proposal');
  };

  const requestAffiliatePayout = (amount: number, method: 'M-Pesa' | 'PayPal' | 'Bank Transfer', account: string): boolean => {
    if (amount > affiliateStats.availableBalance || amount <= 0) {
      addToast('Payout Failed', 'Amount exceeds available affiliate balance.', 'payment');
      return false;
    }

    setAffiliateStats(prev => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
      payoutHistory: [
        {
          id: `pay_${Date.now()}`,
          amount,
          method,
          account,
          date: 'Just now',
          status: 'processing',
        },
        ...prev.payoutHistory,
      ],
    }));

    addToast('Payout Requested', `Payout of $${amount} to ${method} (${account}) is processing.`, 'payment');
    return true;
  };

  const addAuditLog = (action: string, target: string, details: string) => {
    const newLog: AdminAuditLog = {
      id: `log_${Date.now()}`,
      action,
      adminName: user.name || 'System Admin',
      target,
      timestamp: 'Just now',
      details,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateUserBadge = (userId: string, badge: string) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, badge: badge || undefined } : u))
    );
    if (user.id === userId) {
      setUser(prev => ({ ...prev, badge: badge || undefined }));
    }
    addAuditLog('USER_BADGE_UPDATE', `User ID: ${userId}`, `Badge set to "${badge || 'None'}"`);
    addToast('Admin Update', `User badge updated to ${badge || 'None'}.`, 'order');
  };

  const toggleUserSuspension = (userId: string) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const isSuspended = u.badge === 'Suspended';
          return { ...u, badge: isSuspended ? 'Pro Verified' : 'Suspended' };
        }
        return u;
      })
    );
    addAuditLog('USER_SUSPENSION_TOGGLE', `User ID: ${userId}`, 'Toggled suspension status');
    addToast('Admin Security', `User account status updated.`, 'order');
  };

  const adjustUserBalance = (userId: string, amount: number) => {
    setAllUsers(prev =>
      prev.map(u => (u.id === userId ? { ...u, balance: Math.max(0, u.balance + amount) } : u))
    );
    if (user.id === userId) {
      setUser(prev => ({ ...prev, balance: Math.max(0, prev.balance + amount) }));
    }
    addAuditLog('BALANCE_ADJUSTED', `User ID: ${userId}`, `Adjusted by $${amount}`);
    addToast('Admin Wallet Adjustment', `Adjusted balance by $${amount}.`, 'payment');
  };

  const resolveDispute = (disputeId: string, outcome: 'release_to_seller' | 'refund_buyer' | 'split') => {
    const disp = disputes.find(d => d.id === disputeId);
    if (!disp) return;

    let resMsg = '';
    if (outcome === 'release_to_seller') {
      releaseEscrow(disp.orderId);
      resMsg = `Admin resolved: Released $${disp.amount} to seller ${disp.sellerName}.`;
    } else if (outcome === 'refund_buyer') {
      setOrders(prev =>
        prev.map(o => (o.id === disp.orderId ? { ...o, escrowStatus: 'refunded', orderStatus: 'completed' } : o))
      );
      resMsg = `Admin resolved: Refunded $${disp.amount} back to buyer ${disp.buyerName}.`;
    } else {
      resMsg = `Admin resolved: 50/50 split settlement ($${disp.amount / 2} to seller, $${disp.amount / 2} refund).`;
    }

    setDisputes(prev =>
      prev.map(d => (d.id === disputeId ? { ...d, status: 'resolved', resolution: resMsg } : d))
    );
    addAuditLog('DISPUTE_RESOLVED', `Dispute ${disp.orderNumber}`, resMsg);
    addToast('Dispute Resolved', resMsg, 'payment');
  };

  const updateGatewaySettings = (newSettings: Partial<GatewaySettings>) => {
    setGatewaySettings(prev => ({
      ...prev,
      ...newSettings,
      mpesa: { ...prev.mpesa, ...(newSettings.mpesa || {}) },
      stripe: { ...prev.stripe, ...(newSettings.stripe || {}) },
      paypal: { ...prev.paypal, ...(newSettings.paypal || {}) },
    }));
    addAuditLog('GATEWAY_CONFIG_UPDATED', 'Payment Gateways', 'Updated Daraja/Stripe/PayPal parameters');
    addToast('Gateway Updated', 'Payment settings applied successfully.', 'payment');
  };

  const updatePlatformFeeSettings = (newFees: Partial<PlatformFeeSettings>) => {
    setPlatformFeeSettings(prev => ({ ...prev, ...newFees }));
    addAuditLog('PLATFORM_FEES_UPDATED', 'Fee Controller', 'Updated fee percentages or announcement banner');
    addToast('Platform Settings', 'Commission rates and platform settings saved.', 'order');
  };

  const approveAffiliatePayout = (payoutId: string) => {
    setAffiliateStats(prev => ({
      ...prev,
      payoutHistory: prev.payoutHistory.map(p =>
        p.id === payoutId ? { ...p, status: 'completed' } : p
      ),
    }));
    addAuditLog('AFFILIATE_PAYOUT_APPROVED', `Payout ID: ${payoutId}`, 'Marked as completed and disbursed');
    addToast('Affiliate Payout Dispatched', 'Payout processed and notified to affiliate partner.', 'affiliate');
  };

  const toggleServiceFeature = (serviceId: string) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === serviceId) {
          const isFeatured = s.tags.includes('Staff Pick');
          return {
            ...s,
            tags: isFeatured ? s.tags.filter(t => t !== 'Staff Pick') : ['Staff Pick', ...s.tags],
          };
        }
        return s;
      })
    );
    addAuditLog('GIG_MODERATION', `Service ID: ${serviceId}`, 'Toggled Staff Pick feature flag');
    addToast('Gig Updated', 'Gig feature status changed.', 'order');
  };

  const removeService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
    addAuditLog('GIG_REMOVED', `Service ID: ${serviceId}`, 'Removed from active marketplace catalog');
    addToast('Gig Removed', 'The gig was removed from the public marketplace.', 'order');
  };

  const removeJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    addAuditLog('JOB_REMOVED', `Job ID: ${jobId}`, 'Removed job from job board');
    addToast('Job Removed', 'The job was removed from the job board.', 'proposal');
  };

  const requestAdminWithdrawal = (
    amount: number,
    method: AdminWithdrawalMethod,
    accountDetails: string,
    notes?: string
  ): boolean => {
    if (amount > treasuryStats.availableProfits || amount <= 0) {
      addToast('Withdrawal Denied', 'Requested amount exceeds available treasury profits.', 'payment');
      return false;
    }

    const ref = `ADM-WD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fee = method === 'Corporate Bank Wire (USD/KES)' ? 25 : method === 'PayPal Corporate' ? 15 : 0;
    const net = Math.max(0, amount - fee);

    const newWithdrawal: AdminWithdrawalRecord = {
      id: `wd_${Date.now()}`,
      reference: ref,
      amount,
      method,
      accountDetails,
      status: 'completed',
      requestedAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
      approvedBy: user.name || 'Alexandre Mercer (Chief Admin)',
      fee,
      netAmount: net,
      notes: notes || 'Admin profit withdrawal disbursement',
    };

    setAdminWithdrawals(prev => [newWithdrawal, ...prev]);
    setTreasuryStats(prev => ({
      ...prev,
      availableProfits: Math.max(0, prev.availableProfits - amount),
      lifetimeWithdrawn: prev.lifetimeWithdrawn + amount,
    }));

    addAuditLog('TREASURY_PROFIT_WITHDRAWAL', `Ref: ${ref} ($${amount})`, `Disbursed via ${method} to ${accountDetails}`);
    addToast('Disbursement Executed', `Withdrew ${formatPrice(amount)} from Treasury via ${method}.`, 'payment');
    return true;
  };

  const approveAdminWithdrawal = (withdrawalId: string) => {
    setAdminWithdrawals(prev =>
      prev.map(w => (w.id === withdrawalId ? { ...w, status: 'completed', processedAt: new Date().toISOString() } : w))
    );
    addAuditLog('WITHDRAWAL_APPROVED', `ID: ${withdrawalId}`, 'Admin confirmed treasury disbursement completion');
    addToast('Disbursement Completed', 'Treasury withdrawal marked as completed.', 'payment');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        services,
        addService,
        jobs,
        addJob,
        submitProposal,
        courses,
        enrolledCourseIds,
        creatorSubscriptionTiers,
        addCourse,
        membershipPackages: MEMBERSHIP_PACKAGES,
        enrollMembership,
        orders,
        activeOrder,
        setActiveOrder,
        createOrderFromCheckout,
        releaseEscrow,
        submitDelivery,
        submitReview,
        affiliateStats,
        requestAffiliatePayout,
        approveAffiliatePayout,
        checkoutItem,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        notifications,
        unreadCount,
        markNotificationsAsRead,
        addToast,
        allUsers,
        updateUserBadge,
        toggleUserSuspension,
        adjustUserBalance,
        disputes,
        resolveDispute,
        gatewaySettings,
        updateGatewaySettings,
        platformFeeSettings,
        updatePlatformFeeSettings,
        auditLogs,
        addAuditLog,
        toggleServiceFeature,
        removeService,
        removeJob,
        revenueRecords,
        adminWithdrawals,
        treasuryStats,
        requestAdminWithdrawal,
        approveAdminWithdrawal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
