import { useEffect, useState } from 'react';
import {
  Package,
  Key,
  CreditCard,
  FileText,
  Download,
  Activity,
  ArrowRight,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { softwareService } from '@/services/mockSoftwareService';
import { licenseService } from '@/services/licenseService';
import { paymentService } from '@/services/mockPaymentService';
import type { Software, License, Purchase, Invoice } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [licenses, setLicenses] = useState<License[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [softwareMap, setSoftwareMap] = useState<Record<string, Software>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'licenses' | 'purchases' | 'invoices'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, [user]); // user වෙනස් වන විට දත්ත ලෝඩ් කරන්න

  const loadDashboardData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    // ඔයාගේ Backend URL එක
    const API_URL = "http://c4ckkocookws8kg4wc8ckow8.65.108.212.204.sslip.io";

    try {
      // MySQL Backend එකෙන් එකවර දත්ත වර්ග කිහිපයක් ලබා ගැනීම
      // සටහන: ඔයාගේ Backend එකේ මේ Endpoints (API Paths) ටික තියෙන්න ඕනේ.
      const results = await Promise.allSettled([
        fetch(`${API_URL}/api/licenses/user/${user.id}`).then(res => res.json()),
        fetch(`${API_URL}/api/purchases/user/${user.id}`).then(res => res.json()),
        fetch(`${API_URL}/api/invoices/user/${user.id}`).then(res => res.json()),
        fetch(`${API_URL}/api/software/all`).then(res => res.json()),
      ]);

      // 1. Licenses ලබා ගැනීම
      const licensesRes = results[0].status === 'fulfilled' ? results[0].value : { success: false, data: [] };
      setLicenses(Array.isArray(licensesRes.data) ? licensesRes.data : []);

      // 2. Purchases ලබා ගැනීම
      const purchasesRes = results[1].status === 'fulfilled' ? results[1].value : { success: false, data: [] };
      setPurchases(Array.isArray(purchasesRes.data) ? purchasesRes.data : []);

      // 3. Invoices ලබා ගැනීම
      const invoicesRes = results[2].status === 'fulfilled' ? results[2].value : { success: false, data: [] };
      setInvoices(Array.isArray(invoicesRes.data) ? invoicesRes.data : []);

      // 4. Software Map එක සකස් කිරීම (Software ID එකෙන් නම බලාගන්න මේක ඕනේ)
      const softwareRes = results[3].status === 'fulfilled' ? results[3].value : { success: false, data: [] };
      const softwareMapData: Record<string, Software> = {};
      
      if (Array.isArray(softwareRes.data)) {
        softwareRes.data.forEach((s: Software) => {
          softwareMapData[s.id] = s;
        });
      }
      setSoftwareMap(softwareMapData);
      
    } catch (error) {
      console.error("MySQL Dashboard Load Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Copied!',
      description: 'License key copied to clipboard',
    });
  };

  // Stats ගණනය කිරීමේදී ආරක්ෂිත ක්‍රම පාවිච්චි කිරීම
  const stats = [
    {
      icon: Package,
      label: 'Purchased Software',
      value: purchases?.length || 0,
      color: 'bg-[rgba(79,70,229,0.15)] text-[#4F46E5]',
    },
    {
      icon: Key,
      label: 'Active Licenses',
      value: licenses?.filter((l) => l.status === 'active').length || 0,
      color: 'bg-green-500/15 text-green-400',
    },
    {
      icon: CreditCard,
      label: 'Total Spent',
      value: `LKR ${(purchases || [])
        .filter((p) => p.paymentStatus === 'verified')
        .reduce((sum, p) => sum + (p.amount || 0), 0)
        .toLocaleString()}`,
      color: 'bg-[rgba(124,58,237,0.15)] text-[#7C3AED]',
    },
    {
      icon: FileText,
      label: 'Invoices',
      value: invoices?.length || 0,
      color: 'bg-[rgba(244,246,255,0.08)] text-[#A7ACB8]',
    },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rv-panel p-6">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">{stat.value}</div>
            <div className="text-sm text-[#A7ACB8]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Purchases */}
      <div className="rv-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#F4F6FF]">Recent Purchases</h3>
          <button
            onClick={() => setActiveTab('purchases')}
            className="text-sm text-[#4F46E5] hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {purchases.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-[#A7ACB8] mx-auto mb-4" />
            <p className="text-[#A7ACB8]">No purchases yet</p>
            <button
              onClick={() => onNavigate('software')}
              className="rv-btn-primary mt-4"
            >
              Browse Software
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.slice(0, 3).map((purchase) => {
              const software = softwareMap[purchase.softwareId];
              return (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[rgba(244,246,255,0.03)]"
                >
                  <div className="flex items-center gap-4">
                    {software && (
                      <img
                        src={software.imageUrl}
                        alt={software.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <div className="text-[#F4F6FF] font-medium">
                        {software?.name || 'Unknown Software'}
                      </div>
                      <div className="text-sm text-[#A7ACB8]">
                        {new Date(purchase.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#F4F6FF] font-medium">
                      LKR {purchase.amount.toLocaleString()}
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        purchase.paymentStatus === 'verified'
                          ? 'bg-green-500/20 text-green-400'
                          : purchase.paymentStatus === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {purchase.paymentStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Licenses */}
      <div className="rv-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#F4F6FF]">Active Licenses</h3>
          <button
            onClick={() => setActiveTab('licenses')}
            className="text-sm text-[#4F46E5] hover:underline flex items-center gap-1"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {licenses.length === 0 ? (
          <div className="text-center py-8">
            <Key className="w-12 h-12 text-[#A7ACB8] mx-auto mb-4" />
            <p className="text-[#A7ACB8]">No licenses yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {licenses.slice(0, 3).map((license) => {
              const software = softwareMap[license.softwareId];
              return (
                <div
                  key={license.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-[rgba(244,246,255,0.03)]"
                >
                  <div>
                    <div className="text-[#F4F6FF] font-medium">
                      {software?.name || 'Unknown Software'}
                    </div>
                    <div className="text-sm text-[#A7ACB8] mono mt-1">
                      {license.licenseKey}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyLicenseKey(license.licenseKey)}
                      className="p-2 rounded-lg bg-[rgba(244,246,255,0.05)] text-[#A7ACB8] hover:text-[#F4F6FF] transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        license.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {license.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderLicenses = () => (
    <div className="rv-panel p-6">
      <h3 className="text-lg font-semibold text-[#F4F6FF] mb-6">My Licenses</h3>
      {licenses.length === 0 ? (
        <div className="text-center py-12">
          <Key className="w-16 h-16 text-[#A7ACB8] mx-auto mb-4" />
          <p className="text-[#A7ACB8]">No Licenses Found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {licenses.map((license) => {
            const software = softwareMap[license.softwareId];
            return (
              <div key={license.id} className="p-6 rounded-lg bg-[rgba(244,246,255,0.03)] border border-[rgba(244,246,255,0.05)]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-xl font-semibold text-[#F4F6FF]">
                      {software?.name || 'Unknown Software'}
                    </div>
                    <div className="text-sm text-[#A7ACB8] mt-1">
                      Version: {software?.version}
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      license.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : license.status === 'blocked'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {license.status}
                  </span>
                </div>

                <div className="bg-[#05060B] rounded-lg p-4 mb-4">
                  <div className="text-xs text-[#A7ACB8] mb-2">License Key</div>
                  <div className="flex items-center gap-3">
                    <code className="text-lg text-[#4F46E5] mono tracking-wider">
                      {license.licenseKey}
                    </code>
                    <button
                      onClick={() => copyLicenseKey(license.licenseKey)}
                      className="p-2 rounded-lg bg-[rgba(79,70,229,0.15)] text-[#4F46E5] hover:bg-[rgba(79,70,229,0.25)] transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-[#A7ACB8]">Activations</div>
                    <div className="text-[#F4F6FF]">
                      {license.currentActivations} / {license.maxActivations}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#A7ACB8]">Issued</div>
                    <div className="text-[#F4F6FF]">
                      {new Date(license.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#A7ACB8]">Expires</div>
                    <div className="text-[#F4F6FF]">
                      {license.expiresAt
                        ? new Date(license.expiresAt).toLocaleDateString()
                        : 'Never'}
                    </div>
                  </div>
                </div>

                {software?.downloadUrl && (
                  <button
                    onClick={() => {
                      toast({
                        title: 'Download Started',
                        description: `${software.name} is being downloaded`,
                      });
                    }}
                    className="mt-4 rv-btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Software
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPurchases = () => (
    <div className="rv-panel p-6">
      <h3 className="text-lg font-semibold text-[#F4F6FF] mb-6">Purchase History</h3>
      {purchases.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-[#A7ACB8] mx-auto mb-4" />
          <p className="text-[#A7ACB8]">No purchases found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(244,246,255,0.08)]">
                <th className="text-left py-3 px-4 text-[#A7ACB8] font-medium">Software</th>
                <th className="text-left py-3 px-4 text-[#A7ACB8] font-medium">Date</th>
                <th className="text-left py-3 px-4 text-[#A7ACB8] font-medium">Amount</th>
                <th className="text-left py-3 px-4 text-[#A7ACB8] font-medium">Status</th>
                <th className="text-left py-3 px-4 text-[#A7ACB8] font-medium">Method</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => {
                const software = softwareMap[purchase.softwareId];
                return (
                  <tr key={purchase.id} className="border-b border-[rgba(244,246,255,0.05)]">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {software && (
                          <img
                            src={software.imageUrl}
                            alt={software.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        )}
                        <span className="text-[#F4F6FF]">{software?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#A7ACB8]">
                      {new Date(purchase.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-[#F4F6FF]">
                      LKR {purchase.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          purchase.paymentStatus === 'verified'
                            ? 'bg-green-500/20 text-green-400'
                            : purchase.paymentStatus === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {purchase.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#A7ACB8] capitalize">
                      {purchase.paymentMethod.replace('_', ' ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderInvoices = () => (
    <div className="rv-panel p-6">
      <h3 className="text-lg font-semibold text-[#F4F6FF] mb-6">Invoices</h3>
      {invoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-[#A7ACB8] mx-auto mb-4" />
          <p className="text-[#A7ACB8]">No invoices found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => {
            const software = softwareMap[invoice.softwareId];
            return (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 rounded-lg bg-[rgba(244,246,255,0.03)]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#4F46E5]" />
                  </div>
                  <div>
                    <div className="text-[#F4F6FF] font-medium">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-[#A7ACB8]">
                      {software?.name} • {new Date(invoice.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-[#F4F6FF] font-medium">
                      LKR {invoice.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-[#A7ACB8]">{invoice.paymentMethod}</div>
                  </div>
                  <button
                    onClick={() => {
                      toast({
                        title: 'Download Started',
                        description: `Invoice ${invoice.invoiceNumber} is being downloaded`,
                      });
                    }}
                    className="p-2 rounded-lg bg-[rgba(244,246,255,0.05)] text-[#A7ACB8] hover:text-[#F4F6FF] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 rv-container">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[rgba(244,246,255,0.05)] rounded w-1/4" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-[rgba(244,246,255,0.05)] rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">Dashboard</h1>
            <p className="text-[#A7ACB8] mt-1">
              Welcome back, {user?.fullName.split(' ')[0]}
            </p>
          </div>
          <button
            onClick={() => onNavigate('software')}
            className="rv-btn-primary flex items-center gap-2"
          >
            Browse Software
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[rgba(244,246,255,0.08)]">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'licenses', label: 'Licenses', icon: Key },
            { id: 'purchases', label: 'Purchases', icon: CreditCard },
            { id: 'invoices', label: 'Invoices', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#4F46E5] text-[#4F46E5]'
                  : 'border-transparent text-[#A7ACB8] hover:text-[#F4F6FF]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'licenses' && renderLicenses()}
        {activeTab === 'purchases' && renderPurchases()}
        {activeTab === 'invoices' && renderInvoices()}
      </div>
    </div>
  );
}
