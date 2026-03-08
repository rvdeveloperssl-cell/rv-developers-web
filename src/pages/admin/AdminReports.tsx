import { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, Users, CreditCard, Calendar, Printer, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// mockSoftware import කරගන්න ඕනේ "Paid Products" count එක ගන්න
import { mockSoftware } from '@/data/mockData'; 

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

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/purchases/all`);
      const data = await res.json();
      // මුලින්ම පේජ් එකට එනකොට verified ඒවා විතරක් පෙන්වන්න
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
        description: `Found ${filtered.length} transactions.`,
      });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  // CSV Export Logic
  const handleExportCSV = () => {
    if (reportData.length === 0) {
      toast({ title: 'Notice', description: 'No data to export' });
      return;
    }
    const headers = ['Date', 'Client', 'Software', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(p => `${new Date(p.createdAt).toLocaleDateString()},"${p.fullName}","${p.softwareName || 'N/A'}",${p.amount}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Revenue_Report.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    if (reportData.length === 0) {
      toast({ title: 'Notice', description: 'Generate a report first' });
      return;
    }
    window.print();
  };

  // --- මෙන්න මේ ටික තමයි Error එක නිවැරදි කරන තැන ---
  // UI එකේ පාවිච්චි කරන Variables ටික පවතින data (reportData) එකෙන් ගණනය කරනවා
  const totalRevenue = reportData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalSalesCount = reportData.length;
  const uniqueCustomersCount = new Set(reportData.map((p) => p.userId)).size;

  // Software අනුව Sales වෙන් කරන Logic එක
  const salesBySoftware: Record<string, number> = {};
  reportData.forEach((p) => {
    const name = p.softwareName || 'Unknown Software';
    salesBySoftware[name] = (salesBySoftware[name] || 0) + Number(p.amount);
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Print කරන විට පමණක් පෙනෙන කොටස */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 10mm; }
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { 
            position: absolute; left: 0; top: 0; width: 100%; 
            color: #000 !important; background: white !important;
          }
          .no-print { display: none !important; }
          .rv-panel { border: 1px solid #eee !important; background: white !important; box-shadow: none !important; }
          .text-[#F4F6FF] { color: #000 !important; }
          .text-[#A7ACB8] { color: #666 !important; }
          .bg-\\[rgba\\(79\\,70\\,229\\,0\\.15\\)\\] { background: #f0f0f0 !important; }
          .border-white\\/5 { border-color: #eee !important; }
        }
      `}} />

      <div className="rv-container print-section">
        
        {/* PDF EXCLUSIVE HEADER - Only visible during print */}
        <div className="hidden print:block mb-8 border-b-2 border-black pb-6">
          <div className="flex justify-between items-center">
             <div>
                <img 
                  src="https://i.postimg.cc/4d76Jq41/RV-DEVELOPERS-LOGO.jpg" 
                  alt="RV Logo" 
                  className="w-24 h-24 object-contain mb-2"
                />
                <h1 className="text-2xl font-bold tracking-tight">RV DEVELOPERS LANKA</h1>
                <p className="text-sm">Official Sales & Revenue Analytics Report</p>
             </div>
             <div className="text-right text-sm">
                <p className="font-bold text-lg">REVENUE REPORT</p>
                <p>Generated: {new Date().toLocaleDateString()} | {new Date().toLocaleTimeString()}</p>
                <p>Report Period: {startDate || 'All Time'} - {endDate || 'Today'}</p>
                <p className="mt-2 text-xs text-gray-500">System ID: RVD-GEN-{Math.floor(Math.random() * 10000)}</p>
             </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 no-print">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">Reports & Analytics</h1>
            <p className="text-[#A7ACB8] mt-1">Generate business reports and insights</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="rv-btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button onClick={handleExportPDF} className="rv-btn-primary flex items-center gap-2">
              <FileText className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rv-panel p-6">
            <div className="w-12 h-12 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-[#4F46E5]" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">LKR {totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-[#A7ACB8]">Total Revenue</div>
          </div>
          <div className="rv-panel p-6">
            <div className="w-12 h-12 rounded-lg bg-green-500/15 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">{totalSalesCount}</div>
            <div className="text-sm text-[#A7ACB8]">Total Sales</div>
          </div>
          <div className="rv-panel p-6">
            <div className="w-12 h-12 rounded-lg bg-[rgba(124,58,237,0.15)] flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#7C3AED]" />
            </div>
            <div className="text-2xl font-bold text-[#F4F6FF]">{uniqueCustomersCount}</div>
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

        {/* Date Selector */}
        <div className="rv-panel p-6 mb-8 no-print">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-4">Generate Custom Report</h2>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A7ACB8] mb-2">Start Date</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rv-input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A7ACB8] mb-2">End Date</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rv-input" />
            </div>
            <button onClick={handleGenerateReport} disabled={isGenerating} className="rv-btn-primary flex items-center gap-2">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              Generate Report
            </button>
          </div>
        </div>

        {/* Full Transaction Table (Invisible on screen, Visible on PDF for complete logging) */}
        <div className="hidden print:block mt-4 mb-8">
           <h2 className="text-lg font-bold mb-4 border-b pb-2 text-black">Detailed Transaction Log</h2>
           <table className="w-full text-sm border-collapse border border-gray-200">
             <thead>
               <tr className="bg-gray-100">
                 <th className="border p-2 text-left">Date</th>
                 <th className="border p-2 text-left">User ID / Name</th>
                 <th className="border p-2 text-left">Software</th>
                 <th className="border p-2 text-left">Payment</th>
                 <th className="border p-2 text-right">Amount (LKR)</th>
               </tr>
             </thead>
             <tbody>
               {reportData.map((p, i) => (
                 <tr key={i} className="border-b">
                   <td className="border p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                   <td className="border p-2">
                      <div className="font-bold">{p.fullName}</div>
                      <div className="text-[10px] text-gray-500">ID: {p.userId}</div>
                   </td>
                   <td className="border p-2">{p.softwareName}</td>
                   <td className="border p-2 text-xs uppercase">{p.paymentMethod || 'Manual'}</td>
                   <td className="border p-2 text-right font-bold">{p.amount.toLocaleString()}.00</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        {/* Sales by Software Table/List */}
        <div className="rv-panel p-6">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-6 border-b border-white/5 pb-2">Sales by Software (Summary)</h2>
          <div className="space-y-4">
            {Object.entries(salesBySoftware).length > 0 ? (
              Object.entries(salesBySoftware)
                .sort(([, a], [, b]) => b - a)
                .map(([software, amount]) => (
                  <div key={software} className="flex items-center justify-between p-4 rounded-lg bg-[rgba(244,246,255,0.03)] border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-[#4F46E5]" />
                      </div>
                      <span className="text-[#F4F6FF] font-medium">{software}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[#F4F6FF] font-medium">LKR {amount.toLocaleString()}</div>
                      <div className="text-xs text-[#A7ACB8]">
                        {totalRevenue > 0 ? ((amount / totalRevenue) * 100).toFixed(1) : 0}% of total
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-[#A7ACB8] text-center py-4">No data available for the selected period.</div>
            )}
          </div>
        </div>

        {/* PDF Footer - Only Print */}
        <div className="hidden print:block mt-12 pt-8 border-t border-gray-200 text-center text-[10px] text-gray-500">
           <p>© {new Date().getFullYear()} RV DEVELOPERS - CONFIDENTIAL BUSINESS DOCUMENT</p>
           <p>This report is automatically generated by the RV Management System. Any unauthorized reproduction is prohibited.</p>
        </div>

      </div>
    </div>
  );
}
