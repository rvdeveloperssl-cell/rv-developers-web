import { useEffect, useState } from 'react';
import {
  Users,
  Package,
  Key,
  CreditCard,
  TrendingUp,
  Activity,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { softwareService } from '@/services/mockSoftwareService';
import { licenseService } from '@/services/licenseService';
import { paymentService } from '@/services/mockPaymentService';
import { mockUsers, mockActivityLogs } from '@/data/mockData';
import type { Purchase } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSoftware: 0,
    totalLicenses: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    activeLicenses: 0,
  });
  const [recentActivity] = useState(mockActivityLogs.slice(0, 5));
  const [pendingPayments, setPendingPayments] = useState<Purchase[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page.',
        variant: 'destructive',
      });
      onNavigate('home');
      return;
    }
    loadDashboardData();
  }, [isAdmin]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [software, licenses, purchases, pending] = await Promise.all([
        softwareService.getAllSoftware(),
        licenseService.getAllLicenses(),
        paymentService.getAllPurchases(),
        paymentService.getPendingPayments(),
      ]);

      const verifiedPurchases = purchases.filter((p) => p.paymentStatus === 'verified');
      const totalRevenue = verifiedPurchases.reduce((sum, p) => sum + p.amount, 0);

      setStats({
        totalClients: mockUsers.filter((u) => u.role === 'client').length,
        totalSoftware: software.length,
        totalLicenses: licenses.length,
        totalRevenue,
        pendingPayments: pending.length,
        activeLicenses: licenses.filter((l) => l.status === 'active').length,
      });

      setPendingPayments(pending.slice(0, 5));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      icon: Users,
      label: 'Total Clients',
      value: stats.totalClients,
      color: 'bg-[rgba(79,70,229,0.15)] text-[#4F46E5]',
      link: 'admin-clients',
    },
    {
      icon: Package,
      label: 'Software Products',
      value: stats.totalSoftware,
      color: 'bg-[rgba(124,58,237,0.15)] text-[#7C3AED]',
      link: 'admin-software',
    },
    {
      icon: Key,
      label: 'Active Licenses',
      value: stats.activeLicenses,
      color: 'bg-green-500/15 text-green-400',
      link: 'admin-licenses',
    },
    {
      icon: CreditCard,
      label: 'Total Revenue',
      value: `LKR ${stats.totalRevenue.toLocaleString()}`,
      color: 'bg-[rgba(244,246,255,0.08)] text-[#F4F6FF]',
      link: 'admin-reports',
    },
  ];

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">Admin Dashboard</h1>
            <p className="text-[#A7ACB8] mt-1">Manage your software business</p>
          </div>
          {stats.pendingPayments > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                {stats.pendingPayments} pending payments
              </span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <button
              key={stat.label}
              onClick={() => onNavigate(stat.link)}
              className="rv-panel p-6 text-left hover:border-[#4F46E5]/30 transition-colors"
            >
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-[#F4F6FF]">{stat.value}</div>
              <div className="text-sm text-[#A7ACB8]">{stat.label}</div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pending Payments */}
          <div className="rv-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#F4F6FF]">Pending Payments</h2>
              <button
                onClick={() => onNavigate('admin-payments')}
                className="text-sm text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {pendingPayments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-[#A7ACB8] mx-auto mb-4" />
                <p className="text-[#A7ACB8]">No pending payments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-[rgba(244,246,255,0.03)]"
                  >
                    <div>
                      <div className="text-[#F4F6FF] font-medium">
                        LKR {payment.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-[#A7ACB8]">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                      Pending
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="rv-panel p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[#F4F6FF]">Recent Activity</h2>
              <Activity className="w-5 h-5 text-[#A7ACB8]" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-[rgba(244,246,255,0.03)]"
                >
                  <div className="w-8 h-8 rounded-full bg-[rgba(79,70,229,0.15)] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
                  </div>
                  <div>
                    <div className="text-[#F4F6FF] font-medium">{activity.action}</div>
                    <div className="text-sm text-[#A7ACB8]">{activity.details}</div>
                    <div className="text-xs text-[#A7ACB8] mt-1">
                      {new Date(activity.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rv-panel p-6">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Add Software', page: 'admin-software', color: 'bg-[#4F46E5]' },
              { label: 'Manage Clients', page: 'admin-clients', color: 'bg-[#7C3AED]' },
              { label: 'View Licenses', page: 'admin-licenses', color: 'bg-green-500' },
              { label: 'Generate Reports', page: 'admin-reports', color: 'bg-[#A7ACB8]' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => onNavigate(action.page)}
                className="p-4 rounded-lg bg-[rgba(244,246,255,0.03)] border border-[rgba(244,246,255,0.08)] hover:border-[#4F46E5]/30 transition-colors text-left"
              >
                <div className={`w-3 h-3 rounded-full ${action.color} mb-3`} />
                <span className="text-[#F4F6FF] font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
