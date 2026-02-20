export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nic: string;
  address: string;
  companyName?: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  role: 'client' | 'admin' | 'superadmin';
}

export interface Software {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: number;
  version: string;
  imageUrl: string;
  category: string;
  demoVideoUrl?: string;
  systemRequirements: string;
  isFree: boolean;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  downloadCount: number;
}

export interface License {
  id: string;
  softwareId: string;
  userId: string;
  licenseKey: string;
  status: 'active' | 'blocked' | 'expired';
  createdAt: string;
  expiresAt?: string;
  maxActivations: number;
  currentActivations: number;
  lastUsedAt?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  softwareId: string;
  licenseId?: string;
  amount: number;
  paymentMethod: 'card' | 'bank_transfer';
  paymentStatus: 'pending' | 'verified' | 'rejected';
  slipUrl?: string;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  userId: string;
  purchaseId: string;
  softwareId: string;
  amount: number;
  paymentMethod: string;
  licenseKey?: string;
  createdAt: string;
  pdfUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  softwareCount: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  content: string;
  avatarUrl?: string;
  rating: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  imageUrl: string;
  tags: string[];
  readTime: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  client: string;
  industry: string;
  technologies: string[];
  imageUrl: string;
  results: string[];
  completedAt: string;
}

export interface CartItem {
  softwareId: string;
  quantity: number;
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalUsers: number;
  totalSoftware: number;
  recentPurchases: Purchase[];
  salesByMonth: { month: string; amount: number }[];
}

export interface AdminStats {
  totalClients: number;
  totalSoftware: number;
  totalLicenses: number;
  totalRevenue: number;
  pendingPayments: number;
  activeLicenses: number;
  blockedLicenses: number;
  recentActivity: ActivityLog[];
}
