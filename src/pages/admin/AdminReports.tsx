import { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, Users, CreditCard, Calendar, Printer, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminReportsProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminReports({ onNavigate: _onNavigate }: AdminReportsProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<any[]>([]);
  const { toast } = useToast();

  const rawApiUrl = import.meta.env.VITE_API_URL || "";
  const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

  // මුලින්ම page එක load වෙනකොට data ටික fetch කරගමු stats පෙන්වන්න
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/purchases/all`);
      const data = await res.json();
      setReportData(data.filter((p: any) => p.paymentStatus === 'verified'));
    } catch (error) {
      console.error("Initial load failed", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: 'Error',
        description: 'Please select both start and end dates',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/purchases/all`);
      const data = await res.json();
      
      const filtered = data.filter((p: any) => {
        const pDate = p.createdAt.split('T')[0];
        return pDate >= startDate && pDate <= endDate && p.paymentStatus === 'verified';
      });

      setReportData(filtered);
      toast({
        title: 'Report Generated',
        description: `Found ${filtered.length} transactions for the selected period.`,
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  // CSV Export කිරීම (NPM packages අවශ්‍ය නැත)
  const handleExportCSV = () => {
    if (reportData.length === 0) {
      toast({ title: 'Notice', description: 'No data to export' });
      return;
    }

    const headers = ['Date', 'Client Name', 'Software', 'Amount (LKR)', 'Status'];
    const csvRows = [
      headers.join(','),
      ...reportData.map(p => [
        new Date(p.createdAt).toLocaleDateString(),
        `"${p.fullName}"`,
        `"${p.softwareName || 'N/A'}"`,
        p.amount,
        p.paymentStatus
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `RV_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({ title: 'Success', description: 'CSV Downloaded Successfully' });
  };

  const handleExportPDF = () => {
    if (reportData.length === 0) {
      toast({ title: 'Notice', description: 'Generate a report first' });
      return;
    }
    window.print();
  };

  const totalRevenue = reportData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const uniqueCustomers = new Set(reportData.map((p) => p.userId)).size;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">Reports & Analytics</h1>
            <p className="text-[#A7ACB8] mt-1">Generate business reports and insights</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="rv-btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button onClick={handleExportPDF} className="rv-btn-primary flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rv-panel p-6">
            <div className="w-12 h-12 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-[#4F46E5]" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">
              LKR {totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-[#A7ACB8]">Total Revenue</div>
          </div>
          <div className="rv-panel p-6">
            <div className="w-12 h-12 rounded-lg bg-green-500/15 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">{verifiedPurchases.length}</div>
            <div className="text-sm text-[#A7ACB8]">Total Sales</div>
          </div>
          <div className="rv-panel p-6">
            <div className="w-12 h-12 rounded-lg bg-[rgba(124,58,237,0.15)] flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#7C3AED]" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">
              {new Set(verifiedPurchases.map((p) => p.userId)).size}
            </div>
            <div className="text-sm text-[#A7ACB8]">Unique Customers</div>
          </div>
          <div className="rv-panel p-6">
            <div className="w-12 h-12 rounded-lg bg-[rgba(244,246,255,0.08)] flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-[#A7ACB8]" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">
              {mockSoftware.filter((s) => !s.isFree).length}
            </div>
            <div className="text-sm text-[#A7ACB8]">Paid Products</div>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="rv-panel p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-4">Generate Custom Report</h2>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A7ACB8] mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rv-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A7ACB8] mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rv-input"
              />
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className="rv-btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              Generate Report
            </button>
          </div>
        </div>

        {/* Sales by Software */}
        <div className="rv-panel p-6">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-6">Sales by Software</h2>
          <div className="space-y-4">
            {Object.entries(salesBySoftware)
              .sort(([, a], [, b]) => b - a)
              .map(([software, amount]) => (
                <div key={software} className="flex items-center justify-between p-4 rounded-lg bg-[rgba(244,246,255,0.03)]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
                    </div>
                    <span className="text-[#F4F6FF] font-medium">{software}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[#F4F6FF] font-medium">LKR {amount.toLocaleString()}</div>
                    <div className="text-sm text-[#A7ACB8]">
                      {((amount / totalRevenue) * 100).toFixed(1)}% of total
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
