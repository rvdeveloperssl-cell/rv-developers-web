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
  Zap,
  X 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

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

      setLicenses(getData(results[0].status === 'fulfilled' ? results[0].value : []));
      setPurchases(getData(results[1].status === 'fulfilled' ? results[1].value : []));
      setInvoices(getData(results[2].status === 'fulfilled' ? results[2].value : []));

      const softwares = getData(results[3].status === 'fulfilled' ? results[3].value : []);
      const softwareMapData: Record<string, Software> = {};
      softwares.forEach((s: Software) => {
        softwareMapData[s.id] = s;
      });
      setSoftwareMap(softwareMapData);
      
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Copied!', description: 'License key copied to clipboard' });
  };

  const stats = [
    { icon: Package, label: 'Purchased Software', value: purchases?.length || 0, color: 'bg-[#4F46E5]/10 text-[#4F46E5]' },
    { icon: Key, label: 'Active Licenses', value: licenses?.filter((l) => l.status === 'active').length || 0, color: 'bg-emerald-500/10 text-emerald-400' },
    { 
      icon: CreditCard, 
      label: 'Total Spent', 
      value: `LKR ${(purchases || []).filter(p => p.paymentStatus === 'verified').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 
      color: 'bg-purple-500/10 text-purple-400' 
    },
    { icon: FileText, label: 'Invoices', value: invoices?.length || 0, color: 'bg-slate-500/10 text-slate-400' },
  ];

  // --- RENDERING FUNCTIONS ---

  const renderOverview = () => (
    <div className="space-y-10">
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

      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-[#4F46E5] rounded-full"></div>
            <h3 className="text-xl font-bold text-[#F4F6FF]">My Software Inventory</h3>
          </div>
          <button onClick={() => setActiveTab('licenses')} className="text-sm font-medium text-[#4F46E5] flex items-center gap-1">
            Manage All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {licenses.length === 0 ? (
          <div className="rv-panel p-12 text-center border-dashed border-white/10">
            <Zap className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <h4 className="text-[#F4F6FF] font-semibold text-lg">No active software found</h4>
            <button onClick={() => onNavigate('software')} className="rv-btn-primary mt-6">Browse Software</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {licenses.slice(0, 6).map((license) => {
              const software = softwareMap[license.softwareId];
              return (
                <div key={license.id} className="rv-panel group overflow-hidden p-0 border border-white/5 hover:border-[#4F46E5]/30 transition-all duration-300">
                  <div className="relative aspect-[16/9]">
                    <img src={software?.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-[#0B0E16]/20" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="rv-badge bg-[#4F46E5] text-white text-[10px] font-bold uppercase">{software?.category}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#F4F6FF]">{software?.name}</h3>
                    <div className="mt-4 bg-black/40 rounded-lg p-3 border border-white/5 flex items-center justify-between">
                      <code className="text-[#4F46E5] font-mono text-sm">{license.licenseKey}</code>
                      <button onClick={() => copyLicenseKey(license.licenseKey)} className="text-[#A7ACB8] hover:text-white"><Copy className="w-4 h-4" /></button>
                    </div>
                    <div className="flex gap-2 mt-4">
                      {software?.downloadUrl && (
                        <button className="flex-1 rv-btn-primary py-2 text-xs flex items-center justify-center gap-2">
                          <Download className="w-4 h-4" /> Download
                        </button>
                      )}
                      <button onClick={() => onNavigate('software-detail', { id: software?.id })} className="p-2.5 rounded-lg bg-white/5 text-[#A7ACB8] border border-white/10"><ExternalLink className="w-4 h-4" /></button>
                    </div>
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
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10"><img src={software?.imageUrl} className="w-full h-full object-cover" /></div>
                    <div>
                      <h4 className="text-lg font-bold text-[#F4F6FF]">{software?.name}</h4>
                      <p className="text-xs text-[#A7ACB8]">Version {software?.version || '1.0.0'}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${license.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>{license.status}</span>
                </div>
                <div className="bg-[#05060B] rounded-xl p-4 border border-white/5 mb-6 flex items-center justify-between">
                  <code className="text-lg text-[#F4F6FF] font-mono">{license.licenseKey}</code>
                  <button onClick={() => copyLicenseKey(license.licenseKey)} className="rv-btn-secondary p-2"><Copy className="w-4 h-4" /></button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                   <div className="bg-white/[0.02] p-2 rounded-lg text-center font-bold">
                      <div className="text-[9px] text-[#A7ACB8] uppercase">Activations</div>
                      <div className="text-[#F4F6FF] text-sm">{license.currentActivations}/{license.maxActivations}</div>
                   </div>
                   <div className="bg-white/[0.02] p-2 rounded-lg text-center font-bold">
                      <div className="text-[9px] text-[#A7ACB8] uppercase">Issued</div>
                      <div className="text-[#F4F6FF] text-sm">{new Date(license.createdAt).toLocaleDateString()}</div>
                   </div>
                   <div className="bg-white/[0.02] p-2 rounded-lg text-center font-bold">
                      <div className="text-[9px] text-[#A7ACB8] uppercase">Expiry</div>
                      <div className="text-[#F4F6FF] text-sm">{license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'Lifetime'}</div>
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
              <th className="text-left py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase">Software</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase">Date</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase">Amount</th>
              <th className="text-left py-4 px-4 text-xs font-bold text-[#A7ACB8] uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {purchases.map((purchase) => {
              const software = softwareMap[purchase.softwareId];
              return (
                <tr key={purchase.id} className="hover:bg-white/[0.02]">
                  <td className="py-5 px-4 flex items-center gap-3">
                    <img src={software?.imageUrl} className="w-8 h-8 rounded object-cover" />
                    <span className="text-[#F4F6FF] font-medium">{software?.name}</span>
                  </td>
                  <td className="py-5 px-4 text-[#A7ACB8] text-sm">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                  <td className="py-5 px-4 text-[#F4F6FF] font-bold text-sm">LKR {purchase.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="py-5 px-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${purchase.paymentStatus === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>{purchase.paymentStatus}</span>
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
          <div key={invoice.id} className="rv-panel p-5 flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4F46E5]/10 flex items-center justify-center"><FileText className="w-6 h-6 text-[#4F46E5]" /></div>
              <div>
                <div className="text-[#F4F6FF] font-bold">{invoice.invoiceNumber}</div>
                <div className="text-[11px] text-[#A7ACB8] font-bold uppercase">{software?.name} • {new Date(invoice.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
            <button onClick={() => { setSelectedInvoice(invoice); setIsInvoiceOpen(true); }} className="p-3 rounded-xl bg-white/5 text-[#A7ACB8] hover:text-[#4F46E5] transition-all"><Download className="w-5 h-5" /></button>
          </div>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 rv-container flex flex-col items-center justify-center">
         <div className="w-12 h-12 border-4 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin mb-4" />
         <p className="text-[#A7ACB8]">Syncing Dashboard Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#05060B]">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 0; }
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { 
            position: fixed; left: 0; top: 0; width: 100%; height: 100%;
            padding: 15mm !important; background: white !important; 
            z-index: 9999; color: #1e293b !important;
          }
          .no-print { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}} />

      <div className="rv-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-[#F4F6FF]">Dashboard</h1>
            <p className="text-[#A7ACB8] mt-2 font-medium">Welcome back, <span className="text-white">{user?.fullName}</span></p>
          </div>
          <button onClick={() => onNavigate('software')} className="rv-btn-primary px-8 py-4 rounded-2xl flex items-center gap-3">
            Explore Library <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/[0.02] border border-white/5 rounded-2xl w-fit">
          {[{ id: 'overview', label: 'Overview', icon: Activity }, { id: 'licenses', label: 'Licenses', icon: Key }, { id: 'purchases', label: 'History', icon: CreditCard }, { id: 'invoices', label: 'Invoices', icon: FileText }].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-[#4F46E5] text-white shadow-lg' : 'text-[#A7ACB8] hover:text-white hover:bg-white/5'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'licenses' && renderLicenses()}
          {activeTab === 'purchases' && renderPurchases()}
          {activeTab === 'invoices' && renderInvoices()}
        </div>
      </div>

      {/* --- INVOICE PREVIEW MODAL --- */}
      {isInvoiceOpen && selectedInvoice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm no-print">
          <div className="bg-[#1A1D24] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
              <h3 className="text-[#F4F6FF] font-semibold">Invoice Preview</h3>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="rv-btn-primary py-1.5 px-3 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" /> Print / Save PDF
                </button>
                <button onClick={() => setIsInvoiceOpen(false)} className="p-2 hover:bg-white/10 rounded-full text-[#A7ACB8]"><X className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="p-4 md:p-8 max-h-[80vh] overflow-y-auto bg-slate-100">
              <div className="print-section bg-white p-8 text-slate-800 shadow-xl rounded-sm mx-auto w-full">
                <div className="flex justify-between items-start border-b-2 border-slate-100 pb-6 mb-6">
                  <div>
                    <img src="https://i.postimg.cc/4d76Jq41/RV-DEVELOPERS-LOGO.jpg" alt="RV Logo" className="w-16 h-16 object-contain mb-2" />
                    <h2 className="text-xl font-black text-[#4F46E5] uppercase">RV Developers</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Premium Software Solutions</p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-3xl font-light text-slate-300 tracking-widest">INVOICE</h1>
                    <p className="text-sm font-bold text-slate-700">#{selectedInvoice.invoiceNumber || 'INV-' + selectedInvoice.id.slice(0,6)}</p>
                    <p className="text-xs text-slate-500 mt-1">Date: {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-2">Billed To:</p>
                    <p className="font-bold text-slate-700">{user?.fullName}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">Email: {user?.email}<br />Status: <span className="text-green-600 font-bold uppercase">Paid</span></p>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p className="text-[10px] uppercase text-slate-400 font-bold mb-2">Payment Method:</p>
                    <p className="font-bold text-slate-700 capitalize">{selectedInvoice.paymentMethod?.replace('_', ' ') || 'Online Payment'}</p>
                  </div>
                </div>

                <table className="w-full mb-8">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-100">
                      <th className="py-3 px-2 text-left text-[10px] uppercase text-slate-400 font-bold">Product Description</th>
                      <th className="py-3 px-2 text-center text-[10px] uppercase text-slate-400 font-bold">Qty</th>
                      <th className="py-3 px-2 text-right text-[10px] uppercase text-slate-400 font-bold">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-4 px-2">
                        <p className="font-bold text-slate-700">{softwareMap[selectedInvoice.softwareId]?.name || 'Software License'}</p>
                        <p className="text-[10px] text-slate-400">Full Access Perpetual License</p>
                      </td>
                      <td className="py-4 px-2 text-center text-sm">01</td>
                      <td className="py-4 px-2 text-right font-bold">LKR {selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end mb-10">
                  <div className="w-full max-w-[200px] space-y-2 border-t border-slate-100 pt-4">
                    <div className="flex justify-between text-sm font-bold text-slate-800">
                      <span>Total Paid:</span>
                      <span className="text-[#4F46E5]">LKR {selectedInvoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6 text-center">
                  <p className="text-[10px] text-slate-400 italic">Thank you for choosing RV Developers. This is a computer-generated receipt.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
