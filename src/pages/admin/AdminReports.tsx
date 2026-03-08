import { useState, useEffect } from 'react';
import { Download, FileText, TrendingUp, Users, CreditCard, Calendar, Printer, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
      setReportData(data.filter((p: any) => p.paymentStatus === 'verified'));
    } catch (error) {
      console.error("Initial load failed", error);
    }
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({ title: 'Error', description: 'Please select both start and end dates', variant: 'destructive' });
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
      toast({ title: 'Report Generated', description: `Found ${filtered.length} transactions.` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch data', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

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

  const totalRevenue = reportData.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  const totalSalesCount = reportData.length;
  const uniqueCustomersCount = new Set(reportData.map((p) => p.userId)).size;

  const salesBySoftware: Record<string, number> = {};
  reportData.forEach((p) => {
    const name = p.softwareName || 'Unknown Software';
    salesBySoftware[name] = (salesBySoftware[name] || 0) + Number(p.amount);
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { size: A4; margin: 5mm; }
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { 
            position: absolute; left: 0; top: 0; width: 100%; 
            color: #000 !important; background: white !important;
            display: block !important; padding: 0 !important;
          }
          .no-print { display: none !important; }
          .rv-panel { border: 1px solid #eee !important; background: white !important; box-shadow: none !important; margin: 0 !important; padding: 10px !important; }
          /* මැනුවල් ඉඩ පාලනය */
          .grid { display: none !important; } /* PDF එකේදී කාඩ්ස් හංගන්න පුළුවන් ඉඩ ඉතුරු කරගන්න */
          .mb-8 { margin-bottom: 10px !important; }
        }
      `}} />

      <div className="rv-container print-section">
        
        {/* PDF HEADER */}
        <div className="hidden print:block mb-4 border-b-2 border-black pb-4">
          <div className="flex justify-between items-center">
             <div>
                <img src="https://i.postimg.cc/4d76Jq41/RV-DEVELOPERS-LOGO.jpg" alt="RV Logo" className="w-20 h-20 object-contain mb-1" />
                <h1 className="text-xl font-bold tracking-tight">RV DEVELOPERS</h1>
                <p className="text-xs">Official Sales & Revenue Analytics Report</p>
             </div>
             <div className="text-right text-xs">
                <p className="font-bold text-sm">REVENUE REPORT</p>
                <p>Generated: {new Date().toLocaleDateString()}</p>
                <p>Period: {startDate || 'All Time'} - {endDate || 'Today'}</p>
             </div>
          </div>
        </div>

        {/* Screen Header - No Print */}
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

        {/* Stats Grid - No Print during generation to save space if needed, or keep compact */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 no-print">
          <div className="rv-panel p-6">
            <div className="text-2xl font-bold text-[#F4F6FF]">LKR {totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-[#A7ACB8]">Total Revenue</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-2xl font-bold text-[#F4F6FF]">{totalSalesCount}</div>
            <div className="text-sm text-[#A7ACB8]">Total Sales</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-2xl font-bold text-[#F4F6FF]">{uniqueCustomersCount}</div>
            <div className="text-sm text-[#A7ACB8]">Unique Customers</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-2xl font-bold text-[#F4F6FF]">
              {mockSoftware.filter((s) => !s.isFree).length}
            </div>
            <div className="text-sm text-[#A7ACB8]">Paid Products</div>
          </div>
        </div>

        {/* Date Selector - No Print */}
        <div className="rv-panel p-6 mb-8 no-print">
          <div className="flex flex-wrap items-end gap-4">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="rv-input" />
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="rv-input" />
            <button onClick={handleGenerateReport} disabled={isGenerating} className="rv-btn-primary flex items-center gap-2">
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
              Generate Report
            </button>
          </div>
        </div>

        {/* Detailed Transaction Log - දැන් මෙය කෙළින්ම Header එකට යටින් එයි */}
        <div className="mt-2 mb-6">
           <h2 className="text-md font-bold mb-2 border-b pb-1 text-black print:block hidden">Detailed Transaction Log</h2>
           <table className="w-full text-[10px] border-collapse border border-gray-200">
             <thead>
               <tr className="bg-gray-100">
                 <th className="border p-1 text-left">Date</th>
                 <th className="border p-1 text-left">Client Details</th>
                 <th className="border p-1 text-left">Software</th>
                 <th className="border p-1 text-right">Amount (LKR)</th>
               </tr>
             </thead>
             <tbody>
               {reportData.map((p, i) => (
                 <tr key={i} className="border-b">
                   <td className="border p-1">{new Date(p.createdAt).toLocaleDateString()}</td>
                   <td className="border p-1">{p.fullName} (ID: {p.userId})</td>
                   <td className="border p-1">{p.softwareName}</td>
                   <td className="border p-1 text-right font-bold">{p.amount.toLocaleString()}.00</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>

        {/* Screen Only Summary */}
        <div className="rv-panel p-6 no-print">
          <h2 className="text-lg font-semibold text-[#F4F6FF] mb-6 border-b border-white/5 pb-2">Sales Summary</h2>
          <div className="space-y-4">
            {Object.entries(salesBySoftware).map(([software, amount]) => (
              <div key={software} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                <span className="text-[#F4F6FF]">{software}</span>
                <span className="text-[#F4F6FF] font-medium">LKR {amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PDF Footer - එකම පේජ් එකේ තබා ගැනීමට margin අඩු කළා */}
        <div className="hidden print:block mt-6 pt-4 border-t border-gray-300 text-center text-[9px] text-gray-600">
           <p>© {new Date().getFullYear()} RV DEVELOPERS - CONFIDENTIAL BUSINESS DOCUMENT</p>
           <p>This report is automatically generated. Any unauthorized reproduction is prohibited.</p>
        </div>

      </div>
    </div>
  );
}
