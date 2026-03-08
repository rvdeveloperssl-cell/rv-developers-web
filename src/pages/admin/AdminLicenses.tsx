import { useEffect, useState } from 'react';
import { Search, Copy, Ban, CheckCircle, RefreshCw, Calendar } from 'lucide-react';
import { licenseService } from '@/services/licenseService';
import { softwareService } from '@/services/mockSoftwareService';
// mockUsers ඉවත් කරන ලදී - දැන් දත්ත එන්නේ backend එකෙන්
import type { License, Software } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AdminLicensesProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

// License interface එකට fullName එක් කරමු (Backend එකෙන් එන නිසා)
type AdminLicense = License & { fullName?: string };

export default function AdminLicenses({ onNavigate: _onNavigate }: AdminLicensesProps) {
  const [licenses, setLicenses] = useState<AdminLicense[]>([]);
  const [softwareMap, setSoftwareMap] = useState<Record<string, Software>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [licensesData, softwareData] = await Promise.all([
        licenseService.getAllLicenses(),
        softwareService.getAllSoftware(),
      ]);

      setLicenses(licensesData);

      const map: Record<string, Software> = {};
      softwareData.forEach((s) => {
        map[s.id] = s;
      });
      setSoftwareMap(map);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync with server',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async (id: string) => {
    try {
      await licenseService.blockLicense(id);
      toast({ title: 'Success', description: 'License blocked' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to block', variant: 'destructive' });
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await licenseService.unblockLicense(id);
      toast({ title: 'Success', description: 'License unblocked' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to unblock', variant: 'destructive' });
    }
  };

  // මෙය Admin ට කැමති දිනයක් හෝ Lifetime දීමට සකස් කළා
  const handleExtend = async (id: string) => {
    const input = prompt("Enter new Expiry Date (YYYY-MM-DD) or type 'lifetime' for 2099:");
    if (!input) return;

    let finalExpiry = "";
    if (input.toLowerCase() === 'lifetime') {
      finalExpiry = "2099-12-31 23:59:59";
    } else {
      finalExpiry = `${input} 23:59:59`;
    }

    try {
      // මෙතනදී backend එකේ පුළුවන් updateExpiry කියන function එකක් හදන්න
      await licenseService.updateExpiry(id, finalExpiry);
      toast({ title: 'Success', description: 'License expiry updated' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update expiry', variant: 'destructive' });
    }
  };

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Copied!', description: 'License key copied' });
  };

  const filteredLicenses = licenses.filter(
    (l) =>
      l.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.fullName || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: licenses.length,
    active: licenses.filter((l) => l.status === 'active').length,
    blocked: licenses.filter((l) => l.status === 'blocked').length,
    expired: licenses.filter((l) => l.status === 'expired').length,
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        {/* Header with Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">License Management</h1>
            <p className="text-[#A7ACB8] mt-1">Real-time database sync active</p>
          </div>
          <button 
            onClick={loadData}
            className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-[#F4F6FF]">{stats.total}</div>
            <div className="text-sm text-[#A7ACB8]">Total Licenses</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text- green-400 text-3xl font-bold">{stats.active}</div>
            <div className="text-sm text-[#A7ACB8]">Active</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-red-400 text-3xl font-bold">{stats.blocked}</div>
            <div className="text-sm text-[#A7ACB8]">Blocked</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-yellow-400 text-3xl font-bold">{stats.expired}</div>
            <div className="text-sm text-[#A7ACB8]">Expired</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="text"
              placeholder="Search keys or client names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rv-input pl-12"
            />
          </div>
        </div>

        {/* Licenses Table */}
        <div className="rv-panel overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(244,246,255,0.08)]">
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">License Key</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Software</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Client</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Status</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Activations</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Expires</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLicenses.map((license) => (
                <tr key={license.id} className="border-b border-[rgba(244,246,255,0.05)] hover:bg-white/[0.02]">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <code className="text-[#4F46E5] mono font-bold">{license.licenseKey}</code>
                      <button onClick={() => copyLicenseKey(license.licenseKey)} className="p-1 text-[#A7ACB8] hover:text-white">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#F4F6FF]">
                    {softwareMap[license.softwareId]?.name || 'Loading...'}
                  </td>
                  <td className="py-4 px-4 text-[#A7ACB8]">
                    {license.fullName || 'User: ' + license.userId.slice(0, 8)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      license.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {license.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#A7ACB8]">
                    {license.currentActivations} / {license.maxActivations}
                  </td>
                  <td className="py-4 px-4 text-[#A7ACB8]">
                    {new Date(license.expiresAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {license.status === 'active' ? (
                        <button onClick={() => handleBlock(license.id)} className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25">
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleUnblock(license.id)} className="p-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleExtend(license.id)}
                        className="p-2 rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25"
                        title="Change Expiry Date"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
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
