import { useEffect, useState } from 'react';
import { Search, Check, X, CreditCard, Building2, FileText } from 'lucide-react';
import { paymentService } from '@/services/mockPaymentService';
import { softwareService } from '@/services/mockSoftwareService';
import { mockUsers } from '@/data/mockData';
import type { Purchase, Software } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
// Backend එකේ URL එක (ඔයාගේ Server එක Run වෙන Port එක)
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface AdminPaymentsProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminPayments({ onNavigate: _onNavigate }: AdminPaymentsProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [softwareMap, setSoftwareMap] = useState<Record<string, Software>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [purchasesData, softwareData] = await Promise.all([
        paymentService.getAllPurchases(),
        softwareService.getAllSoftware(),
      ]);

      setPurchases(purchasesData);

      const map: Record<string, Software> = {};
      softwareData.forEach((s) => {
        map[s.id] = s;
      });
      setSoftwareMap(map);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load payments',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (purchaseId: string) => {
    if (!user) return;
    try {
      const result = await paymentService.verifyPayment(purchaseId, user.id);
      if (result.success) {
        toast({ title: 'Success', description: 'Payment verified successfully' });
        loadData();
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify payment',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (purchaseId: string) => {
    if (!user) return;
    try {
      const result = await paymentService.rejectPayment(purchaseId, user.id, 'Invalid bank slip');
      if (result.success) {
        toast({ title: 'Success', description: 'Payment rejected' });
        loadData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject payment',
        variant: 'destructive',
      });
    }
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user?.fullName || 'Unknown';
  };

  const filteredPurchases = purchases.filter(
    (p) =>
      getUserName(p.userId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      softwareMap[p.softwareId]?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = purchases.filter((p) => p.paymentStatus === 'pending').length;
  const verifiedCount = purchases.filter((p) => p.paymentStatus === 'verified').length;
  const totalRevenue = purchases
    .filter((p) => p.paymentStatus === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">Payment Verification</h1>
            <p className="text-[#A7ACB8] mt-1">Manage and verify payments</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-yellow-400">{pendingCount}</div>
            <div className="text-sm text-[#A7ACB8]">Pending</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-green-400">{verifiedCount}</div>
            <div className="text-sm text-[#A7ACB8]">Verified</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-[#F4F6FF]">
              LKR {totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-[#A7ACB8]">Total Revenue</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rv-input pl-12"
            />
          </div>
        </div>

        {/* Payments Table */}
        <div className="rv-panel overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(244,246,255,0.08)]">
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Client</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Software</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Amount</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Method</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Status</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Date</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="border-b border-[rgba(244,246,255,0.05)]">
                  <td className="py-4 px-4 text-[#F4F6FF]">{getUserName(purchase.userId)}</td>
                  <td className="py-4 px-4 text-[#F4F6FF]">
                    {softwareMap[purchase.softwareId]?.name || 'Unknown'}
                  </td>
                  <td className="py-4 px-4 text-[#F4F6FF] font-medium">
                    LKR {purchase.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-[#A7ACB8]">
                      {purchase.paymentMethod === 'card' ? (
                        <CreditCard className="w-4 h-4" />
                      ) : (
                        <Building2 className="w-4 h-4" />
                      )}
                      <span className="capitalize">{purchase.paymentMethod.replace('_', ' ')}</span>
                    </div>
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
                  <td className="py-4 px-4 text-[#A7ACB8]">
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    {purchase.paymentStatus === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerify(purchase.id)}
                          className="p-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25"
                          title="Verify"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(purchase.id)}
                          className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25"
                          title="Reject"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    {purchase.slipUrl && (
      <button
        onClick={() => {
          // Backend URL එකයි Database එකේ තියෙන path එකයි එකතු කරලා අලුත් tab එකක open කරනවා
          window.open(`${BASE}/${purchase.slipUrl}`, '_blank');
        }}
        className="p-2 rounded-lg bg-[rgba(79,70,229,0.15)] text-[#4F46E5] hover:bg-[rgba(79,70,229,0.25)] flex items-center gap-2"
        title="View Bank Slip"
      >
        <FileText className="w-4 h-4" />
        <span className="text-xs font-medium italic">Slip</span>
      </button>
    )}
  </div>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
