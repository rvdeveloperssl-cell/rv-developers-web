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
  ShieldCheck,
  Zap
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
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    const rawApiUrl = import.meta.env.VITE_API_URL || "";
    const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

    try {
      const results = await Promise.allSettled([
        fetch(`${API_URL}/api/licenses/user/${user.id}`).then(res => res.json()),
        fetch(`${API_URL}/api/purchases/user/${user.id}`).then(res => res.json()),
        fetch(`${API_URL}/api/invoices/user/${user.id}`).then(res => res.json()),
        fetch(`${API_URL}/api/software/all`).then(res => res.json()),
      ]);

      const getData = (res: any) => {
        if (Array.isArray(res)) return res;
        if (res && Array.isArray(res.data)) return res.data;
        return [];
      };

      const licData = results[0].status === 'fulfilled' ? results[0].value : [];
      setLicenses(getData(licData));

      const purData = results[1].status === 'fulfilled' ? results[1].value : [];
      setPurchases(getData(purData));

      const invData = results[2].status === 'fulfilled' ? results[2].value : [];
      setInvoices(getData(invData));

      const softData = results[3].status === 'fulfilled' ? results[3].value : [];
      const softwares = getData(softData);
      
      const softwareMapData: Record<string, Software> = {};
      softwares.forEach((s: Software) => {
        softwareMapData[s.id] = s;
      });
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

  const stats = [
    {
      icon: Package,
      label: 'Purchased Software',
      value: purchases?.length || 0,
      color: 'bg-[#4F46E5]/10 text-[#4F46E5]',
    },
    {
      icon: Key,
      label: 'Active Licenses',
      value: licenses?.filter((l) => l.status === 'active').length || 0,
      color: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      icon: CreditCard,
      label: 'Total Spent',
      value: `LKR ${(purchases || [])
        .filter((p) => p.paymentStatus === 'verified')
        .reduce((sum, p) => sum + (p.amount || 0), 0)
        .toLocaleString()}`,
      color: 'bg-purple-500/10 text-purple-400',
    },
    {
      icon: FileText,
      label: 'Invoices',
      value: invoices?.length || 0,
      color: 'bg-slate-500/10 text-slate-400',
    },
  ];

  const renderOverview = () => (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rv-panel p-6 border border-white/5 hover:border-white/10 transition-all">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">{stat.value}</div>
            <div className="text-sm text-[#A7ACB8] font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Modern Active Software Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#4F46E5] rounded-full"></div>
            <h3 className="text-xl font-bold text-[#F4F6FF]">My Software Inventory</h3>
          </div>
          <button
            onClick={() => setActiveTab('licenses')}
            className="text-sm font-medium text-[#4F46E5] hover:text-[#3f38c2] flex items-center gap-1 transition-colors"
          >
            Manage All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {licenses.length === 0 ? (
          <div className="rv-panel p-12 text-center border-dashed border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-10 h-10 text-white/20" />
            </div>
            <h4 className="text-[#F4F6FF] font-semibold text-lg">No active software found</h4>
            <p className="text-[#A7ACB8] mt-2 mb-6">Start your journey by exploring our premium software collection.</p>
            <button onClick={() => onNavigate('software')} className="rv-btn-primary">
              Browse Software
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {licenses.slice(0, 6).map((license) => {
              const software = softwareMap[license.softwareId];
              return (
                <div key={license.id} className="rv-panel group overflow-hidden p-0 border border-white/5 hover:border-[#4F46E5]/30 transition-all duration-300">
                  <div className="relative aspect-[16/9]">
                    <img 
                      src={software?.imageUrl} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={software?.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-[#0B0E16]/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="rv-badge bg-[#4F46E5] text-white border-none text-[10px] uppercase tracking-wider font-bold">
                        {software?.category || 'Software'}
                      </span>
                      <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium capitalize">{license.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#F4F6FF] group-hover:text-[#4F46E5] transition-colors line-clamp-1">
                      {software?.name || 'Loading...'}
                    </h3>
                    
                    <div className="mt-4 space-y-3">
                      <div className="bg-black/40 rounded-lg p-3 border border-white/5">
                        <div className="text-[10px] text-[#A7ACB8] uppercase tracking-widest mb-1 font-bold">License Key</div>
                        <div className="flex items-center justify-between">
                          <code className="text-[#4F46E5] font-mono text-sm tracking-tight">{license.licenseKey}</code>
                          <button 
                            onClick={() => copyLicenseKey(license.licenseKey)}
                            className="text-[#A7ACB8] hover:text-white p-1 transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {software?.downloadUrl && (
                          <button className="flex-1 rv-btn-primary py-2.5 text-xs flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Download
                          </button>
                        )}
                        <button 
                          onClick={() => onNavigate('software-detail', { id: software?.id })}
                          className="px-3 py-2.5 rounded-lg bg-white/5 text-[#A7ACB8] hover:bg-white/10 hover:text-white transition-all border border-white/10"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mini Purchase History */}
      <div className="rv-panel p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#F4F6FF]">Recent Transactions</h3>
          <button onClick={() => setActiveTab('purchases')} className="text-xs text-[#A7ACB8] hover:text-white underline decoration-[#4F46E5] underline-offset-4">
            View Statement
          </button>
        </div>

        <div className="space-y-3">
          {purchases.slice(0, 3).map((purchase) => {
            const software = softwareMap[purchase.softwareId];
            return (
              <div key={purchase.id} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                    <img src={software?.imageUrl} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[#F4F6FF] font-semibold text-sm">{software?.name}</div>
                    <div className="text-[11px] text-[#A7ACB8]">{new Date(purchase.createdAt).toDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#F4F6FF] font-bold text-sm">LKR {purchase.amount.toLocaleString()}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-tighter ${purchase.paymentStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {purchase.paymentStatus}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderLicenses = () => (
    <div className="space-y-6">
       <div className="flex items-center gap-3 mb-2">
          <Key className="w-6 h-6 text-[#4F46E5]" />
          <h3 className="text-2xl font-bold text-[#F4F6FF]">Managed Licenses</h3>
       </div>
       <div className="grid md:grid-cols-2 gap-4">
          {licenses.map((license) => {
            const software = softwareMap[license.softwareId];
            return (
              <div key={license.id} className="rv-panel p-6 border border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                       <img src={software?.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-[#F4F6FF]">{software?.name}</h4>
                      <p className="text-xs text-[#A7ACB8]">Version {software?.version || '1.0.0'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${license.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {license.status}
                  </span>
                </div>

                <div className="bg-[#05060B] rounded-xl p-4 border border-white/5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-[#A7ACB8] font-bold uppercase tracking-widest">Master License Key</span>
                    <ShieldCheck className="w-3 h-3 text-[#4F46E5]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <code className="text-lg text-[#F4F6FF] font-mono tracking-wider">{license.licenseKey}</code>
                    <button onClick={() => copyLicenseKey(license.licenseKey)} className="rv-btn-secondary p-2 rounded-lg">
                       <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 text-center">
                    <div className="text-[9px] text-[#A7ACB8] uppercase font-bold mb-1">Activations</div>
                    <div className="text-[#F4F6FF] text-sm font-bold">{license.currentActivations}/{license.maxActivations}</div>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 text-center">
                    <div className="text-[9px] text-[#A7ACB8] uppercase font-bold mb-1">Issued</div>
                    <div className="text-[#F4F6FF] text-sm font-bold">{new Date(license.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="bg-white/[0.02] p-3 rounded-lg border border-white/5 text-center">
                    <div className="text-[9px] text-[#A7ACB8] uppercase font-bold mb-1">Expiry</div>
                    <div className="text-[#F4F6FF] text-sm font-bold">{license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'Lifetime'}</div>
                  </div>
                </div>
              </div>
            );
          })}
       </div>
    </div>
  );

  const renderPurchases = () => (
    <div className="rv-panel p-6 border border-white/5">
      <h3 className="text-xl font-bold text-[#F4F6FF] mb-8">Billing History</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase tracking-widest">Software Asset</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase tracking-widest">Date</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase tracking-widest">Amount</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase tracking-widest">Status</th>
              <th className="text-right py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase tracking-widest">Gateway</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {purchases.map((purchase) => {
              const software = softwareMap[purchase.softwareId];
              return (
                <tr key={purchase.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 group-hover:border-[#4F46E5]/50 transition-colors">
                        <img src={software?.imageUrl} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[#F4F6FF] font-medium">{software?.name || 'Legacy Asset'}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-[#A7ACB8] text-sm">
                    {new Date(purchase.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-5 px-4 text-[#F4F6FF] font-bold">LKR {purchase.amount.toLocaleString()}</td>
                  <td className="py-5 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${purchase.paymentStatus === 'verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {purchase.paymentStatus}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-[#A7ACB8] text-right text-xs capitalize font-medium">
                    {purchase.paymentMethod.replace('_', ' ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="grid md:grid-cols-2 gap-4">
      {invoices.map((invoice) => {
        const software = softwareMap[invoice.softwareId];
        return (
          <div key={invoice.id} className="rv-panel p-5 flex items-center justify-between border border-white/5 hover:border-white/20 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center border border-[#4F46E5]/20">
                <FileText className="w-6 h-6 text-[#4F46E5]" />
              </div>
              <div>
                <div className="text-[#F4F6FF] font-bold">{invoice.invoiceNumber}</div>
                <div className="text-[11px] text-[#A7ACB8] font-medium uppercase tracking-tighter">
                  {software?.name} • {new Date(invoice.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button className="p-3 rounded-xl bg-white/5 text-[#A7ACB8] hover:text-[#4F46E5] hover:bg-[#4F46E5]/10 transition-all">
              <Download className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 rv-container flex flex-col items-center justify-center">
         <div className="w-12 h-12 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin mb-4" />
         <p className="text-[#A7ACB8] font-medium animate-pulse">Syncing Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#05060B]">
      <div className="rv-container">
        {/* Modern Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                <span className="text-[10px] font-bold text-[#4F46E5] uppercase tracking-[0.2em]">User Command Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#F4F6FF] tracking-tight">Dashboard</h1>
            <p className="text-[#A7ACB8] mt-2 font-medium">
              Welcome back, <span className="text-white">{user?.fullName}</span>
            </p>
          </div>
          <button
            onClick={() => onNavigate('software')}
            className="rv-btn-primary px-8 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] flex items-center gap-3 group"
          >
            Explore Library
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Custom Tab System */}
        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'licenses', label: 'Licenses', icon: Key },
            { id: 'purchases', label: 'History', icon: CreditCard },
            { id: 'invoices', label: 'Invoices', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-[#4F46E5] text-white shadow-lg shadow-[#4F46E5]/20'
                  : 'text-[#A7ACB8] hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content with Animation */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'licenses' && renderLicenses()}
          {activeTab === 'purchases' && renderPurchases()}
          {activeTab === 'invoices' && renderInvoices()}
        </div>
      </div>
    </div>
  );
}
