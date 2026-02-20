import type { User, Software, License, Purchase, Invoice, Category, Testimonial, BlogPost, Project, ActivityLog } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+94 77 123 4567',
    nic: '123456789V',
    address: '123 Main Street, Colombo',
    companyName: 'Tech Solutions Ltd',
    isVerified: true,
    createdAt: '2024-01-15T10:00:00Z',
    lastLoginAt: '2024-03-20T14:30:00Z',
    role: 'client'
  },
  {
    id: '2',
    fullName: 'Admin User',
    email: 'admin@rvdevelopers.com',
    phone: '+94 75 318 3178',
    nic: '987654321V',
    address: 'RV Developers HQ, Colombo',
    isVerified: true,
    createdAt: '2023-01-01T00:00:00Z',
    lastLoginAt: '2024-03-21T09:00:00Z',
    role: 'admin'
  }
];

export const mockCategories: Category[] = [
  { id: '1', name: 'Business Management', description: 'Software for business operations', softwareCount: 3 },
  { id: '2', name: 'Security Tools', description: 'Cybersecurity and protection software', softwareCount: 2 },
  { id: '3', name: 'Development', description: 'Developer tools and utilities', softwareCount: 2 },
  { id: '4', name: 'Productivity', description: 'Productivity enhancement tools', softwareCount: 2 },
  { id: '5', name: 'Analytics', description: 'Data analytics and reporting', softwareCount: 1 }
];

export const mockSoftware: Software[] = [
  {
    id: '1',
    name: 'RV ERP Pro',
    description: 'Enterprise Resource Planning solution designed for Sri Lankan businesses. Streamline operations, manage inventory, and boost productivity.',
    features: [
      'Inventory Management',
      'Financial Accounting',
      'HR & Payroll',
      'Sales & CRM',
      'Multi-branch Support',
      'Sinhala/Tamil Language Support'
    ],
    price: 45000,
    version: '3.2.1',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    category: 'Business Management',
    demoVideoUrl: 'https://youtube.com/demo',
    systemRequirements: 'Windows 10/11, 8GB RAM, 2GB Disk Space',
    isFree: false,
    downloadUrl: '/downloads/rv-erp-pro-v3.2.1.exe',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    isActive: true,
    downloadCount: 1250
  },
  {
    id: '2',
    name: 'RV Security Suite',
    description: 'Comprehensive cybersecurity solution with real-time threat detection, firewall management, and vulnerability scanning.',
    features: [
      'Real-time Threat Detection',
      'Network Firewall',
      'Vulnerability Scanner',
      'Malware Protection',
      'Security Reports',
      '24/7 Monitoring'
    ],
    price: 25000,
    version: '2.5.0',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    category: 'Security Tools',
    demoVideoUrl: 'https://youtube.com/demo',
    systemRequirements: 'Windows 10/11, 4GB RAM, 1GB Disk Space',
    isFree: false,
    downloadUrl: '/downloads/rv-security-suite-v2.5.0.exe',
    createdAt: '2023-08-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    isActive: true,
    downloadCount: 890
  },
  {
    id: '3',
    name: 'RV Code Editor',
    description: 'Lightning-fast code editor with intelligent autocomplete, debugging tools, and built-in Git integration.',
    features: [
      'Intelligent Autocomplete',
      'Built-in Terminal',
      'Git Integration',
      'Multi-language Support',
      'Custom Themes',
      'Plugin System'
    ],
    price: 0,
    version: '1.8.2',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80',
    category: 'Development',
    demoVideoUrl: 'https://youtube.com/demo',
    systemRequirements: 'Windows/Mac/Linux, 4GB RAM, 500MB Disk Space',
    isFree: true,
    downloadUrl: '/downloads/rv-code-editor-v1.8.2.exe',
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
    isActive: true,
    downloadCount: 3200
  },
  {
    id: '4',
    name: 'RV Analytics Pro',
    description: 'Advanced business intelligence and analytics platform with AI-powered insights and custom dashboards.',
    features: [
      'AI-Powered Insights',
      'Custom Dashboards',
      'Data Visualization',
      'Report Builder',
      'Real-time Analytics',
      'API Integration'
    ],
    price: 35000,
    version: '2.1.0',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    category: 'Analytics',
    demoVideoUrl: 'https://youtube.com/demo',
    systemRequirements: 'Windows 10/11, 16GB RAM, 5GB Disk Space',
    isFree: false,
    downloadUrl: '/downloads/rv-analytics-pro-v2.1.0.exe',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    isActive: true,
    downloadCount: 567
  },
  {
    id: '5',
    name: 'RV Task Manager',
    description: 'Intuitive project and task management tool for teams of all sizes.',
    features: [
      'Kanban Boards',
      'Gantt Charts',
      'Team Collaboration',
      'Time Tracking',
      'File Sharing',
      'Mobile App'
    ],
    price: 15000,
    version: '4.0.1',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
    category: 'Productivity',
    demoVideoUrl: 'https://youtube.com/demo',
    systemRequirements: 'Web-based, Any modern browser',
    isFree: false,
    downloadUrl: '/downloads/rv-task-manager-v4.0.1.exe',
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2024-02-28T00:00:00Z',
    isActive: true,
    downloadCount: 2100
  },
  {
    id: '6',
    name: 'RV Password Vault',
    description: 'Secure password manager with military-grade encryption and biometric authentication.',
    features: [
      'AES-256 Encryption',
      'Biometric Auth',
      'Password Generator',
      'Secure Sharing',
      'Breach Monitoring',
 'Cross-platform Sync'
    ],
    price: 8000,
    version: '1.5.0',
    imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&q=80',
    category: 'Security Tools',
    demoVideoUrl: 'https://youtube.com/demo',
    systemRequirements: 'Windows/Mac/iOS/Android',
    isFree: false,
    downloadUrl: '/downloads/rv-password-vault-v1.5.0.exe',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
    isActive: true,
    downloadCount: 1450
  },
  {
    id: '7',
    name: 'RV DevTools',
    description: 'Essential developer toolkit with API tester, code formatter, and database manager.',
    features: [
      'API Tester',
      'Code Formatter',
      'Database Manager',
      'Regex Tester',
      'JSON Validator',
      'Base64 Encoder/Decoder'
    ],
    price: 0,
    version: '2.0.0',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80',
    category: 'Development',
    demoVideoUrl: 'https://youtube.com/demo',
    systemRequirements: 'Windows/Mac/Linux',
    isFree: true,
    downloadUrl: '/downloads/rv-devtools-v2.0.0.exe',
    createdAt: '2023-11-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
    isActive: true,
    downloadCount: 2800
  },
  {
    id: '8',
    name: 'RV Invoice Pro',
    description: 'Professional invoicing and billing software for Sri Lankan businesses with GST support.',
    features: [
      'GST/Tax Support',
      'Custom Templates',
      'Payment Tracking',
      'Client Management',
      'Multi-currency',
      'Auto-reminders'
    ],
    price: 12000,
    version: '3.0.2',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    category: 'Business Management',
    demoVideoUrl: 'https://youtube.com/demo',
    systemRequirements: 'Windows 10/11, 4GB RAM',
    isFree: false,
    downloadUrl: '/downloads/rv-invoice-pro-v3.0.2.exe',
    createdAt: '2023-07-01T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    isActive: true,
    downloadCount: 1890
  }
];

export const mockLicenses: License[] = [
  {
    id: '1',
    softwareId: '1',
    userId: '1',
    licenseKey: 'RVQ-ABCDE-FGHIJ',
    status: 'active',
    createdAt: '2024-01-20T10:00:00Z',
    expiresAt: '2025-01-20T10:00:00Z',
    maxActivations: 3,
    currentActivations: 1,
    lastUsedAt: '2024-03-20T14:30:00Z'
  },
  {
    id: '2',
    softwareId: '2',
    userId: '1',
    licenseKey: 'RVQ-KLMNO-PQRST',
    status: 'active',
    createdAt: '2024-02-15T10:00:00Z',
    expiresAt: '2025-02-15T10:00:00Z',
    maxActivations: 2,
    currentActivations: 1,
    lastUsedAt: '2024-03-19T09:15:00Z'
  }
];

export const mockPurchases: Purchase[] = [
  {
    id: '1',
    userId: '1',
    softwareId: '1',
    licenseId: '1',
    amount: 45000,
    paymentMethod: 'card',
    paymentStatus: 'verified',
    createdAt: '2024-01-20T10:00:00Z',
    verifiedAt: '2024-01-20T10:05:00Z',
    invoiceId: 'INV-001'
  },
  {
    id: '2',
    userId: '1',
    softwareId: '2',
    licenseId: '2',
    amount: 25000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'verified',
    slipUrl: '/uploads/slip-002.jpg',
    createdAt: '2024-02-15T10:00:00Z',
    verifiedAt: '2024-02-16T11:30:00Z',
    verifiedBy: '2',
    invoiceId: 'INV-002'
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-001',
    userId: '1',
    purchaseId: '1',
    softwareId: '1',
    amount: 45000,
    paymentMethod: 'card',
    licenseKey: 'RVQ-ABCDE-FGHIJ',
    createdAt: '2024-01-20T10:05:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-002',
    userId: '1',
    purchaseId: '2',
    softwareId: '2',
    amount: 25000,
    paymentMethod: 'bank_transfer',
    licenseKey: 'RVQ-KLMNO-PQRST',
    createdAt: '2024-02-16T11:30:00Z'
  }
];

export const mockTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    company: 'Global Finance Corp',
    role: 'CTO',
    content: 'RV Developers transformed our legacy system into a modern, secure platform. Their attention to security details is unmatched.',
    rating: 5
  },
  {
    id: '2',
    name: 'Rajesh Perera',
    company: 'Lanka Tech Solutions',
    role: 'CEO',
    content: 'The ERP solution from RV Developers streamlined our operations by 40%. Best investment we made for our business.',
    rating: 5
  },
  {
    id: '3',
    name: 'Emily Chen',
    company: 'HealthFirst Medical',
    role: 'IT Director',
    content: 'Their security suite gives us peace of mind. Compliance-ready and constantly updated against new threats.',
    rating: 5
  },
  {
    id: '4',
    name: 'Mohamed Farook',
    company: 'Ceylon Logistics',
    role: 'Operations Manager',
    content: 'Professional team, excellent support, and top-quality software. RV Developers is our go-to tech partner.',
    rating: 5
  }
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How We Cut API Latency by 60%',
    excerpt: 'Learn the optimization techniques we used to dramatically improve our API response times.',
    content: 'Full article content here...',
    author: 'Kasun Jayawardhana',
    authorRole: 'Lead Developer',
    publishedAt: '2024-03-15T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    tags: ['Performance', 'API', 'Optimization'],
    readTime: 8
  },
  {
    id: '2',
    title: 'A Practical Threat Modeling Checklist',
    excerpt: 'Essential security considerations every developer should know before shipping software.',
    content: 'Full article content here...',
    author: 'Dilshan Perera',
    authorRole: 'Security Engineer',
    publishedAt: '2024-03-10T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    tags: ['Security', 'Best Practices'],
    readTime: 12
  },
  {
    id: '3',
    title: 'Shipping Fast Without Breaking Compliance',
    excerpt: 'How to maintain development velocity while meeting regulatory requirements.',
    content: 'Full article content here...',
    author: 'Tharindu Silva',
    authorRole: 'Product Manager',
    publishedAt: '2024-03-05T00:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    tags: ['Compliance', 'DevOps'],
    readTime: 6
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Merchant Portal Redesign',
    description: 'Complete overhaul of a fintech merchant portal with modern UI and enhanced security.',
    client: 'PayLanka Financial',
    industry: 'Fintech',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    results: ['40% faster checkout flow', '99.99% uptime after hardening', 'WCAG 2.1 AA compliant'],
    completedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '2',
    title: 'Healthcare Management System',
    description: 'HIPAA-compliant patient management system for a chain of hospitals.',
    client: 'MediCare Hospitals',
    industry: 'Healthcare',
    technologies: ['Angular', 'Python', 'MongoDB', 'Azure'],
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    results: ['50% reduction in admin time', 'Zero security incidents', 'Full HIPAA compliance'],
    completedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    title: 'E-commerce Platform',
    description: 'Scalable e-commerce solution with real-time inventory and AI recommendations.',
    client: 'ShopCeylon',
    industry: 'E-commerce',
    technologies: ['Next.js', 'Go', 'Redis', 'Kubernetes'],
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    results: ['3x faster page loads', '25% increase in conversions', 'Handles 10K concurrent users'],
    completedAt: '2023-12-20T00:00:00Z'
  }
];

export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    action: 'LOGIN',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2024-03-20T14:30:00Z'
  },
  {
    id: '2',
    userId: '1',
    action: 'DOWNLOAD',
    details: 'Downloaded RV ERP Pro v3.2.1',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2024-03-20T14:35:00Z'
  },
  {
    id: '3',
    userId: '1',
    action: 'LICENSE_ACTIVATED',
    details: 'Activated license RVQ-ABCDE-FGHIJ',
    ipAddress: '192.168.1.100',
    userAgent: 'RV ERP Pro Client',
    createdAt: '2024-03-20T14:40:00Z'
  }
];
