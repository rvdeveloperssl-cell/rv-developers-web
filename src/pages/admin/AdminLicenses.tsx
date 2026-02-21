import { useEffect, useState } from 'react';
import { Search, Copy, Ban, CheckCircle, RefreshCw } from 'lucide-react';
import { licenseService } from '@/services/licenseService';
import { softwareService } from '@/services/mockSoftwareService';
import { mockUsers } from '@/data/mockData';
import type { License, Software } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AdminLicensesProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminLicenses({ onNavigate: _onNavigate }: AdminLicensesProps) {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [softwareMap, setSoftwareMap] = useState<Record<string, Software>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsLoading] = useState(true);
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
        description: 'Failed to load licenses',
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
      toast({
        title: 'Error',
        description: 'Failed to block license',
        variant: 'destructive',
      });
    }
  };

  const handleUnblock = async (id: string) => {
    try {
      await licenseService.unblockLicense(id);
      toast({ title: 'Success', description: 'License unblocked' });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to unblock license',
        variant: 'destructive',
      });
    }
  };

  const handleExtend = async (id: string) => {
    try {
      await licenseService.extendLicense(id, 365);
      toast({ title: 'Success', description: 'License extended by 1 year' });
      loadData();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to extend license',
        variant: 'destructive',
      });
    }
  };

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Copied!', description: 'License key copied to clipboard' });
  };

  const getUserName = (userId: string) => {
    const user = mockUsers.find((u) => u.id === userId);
    return user?.fullName || 'Unknown';
  };

  const filteredLicenses = licenses.filter(
    (l) =>
      l.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getUserName(l.userId).toLowerCase().includes(searchQuery.toLowerCase())
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">License Management</h1>
            <p className="text-[#A7ACB8] mt-1">Manage software licenses</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-[#F4F6FF]">{stats.total}</div>
            <div className="text-sm text-[#A7ACB8]">Total Licenses</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-green-400">{stats.active}</div>
            <div className="text-sm text-[#A7ACB8]">Active</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-red-400">{stats.blocked}</div>
            <div className="text-sm text-[#A7ACB8]">Blocked</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-yellow-400">{stats.expired}</div>
            <div className="text-sm text-[#A7ACB8]">Expired</div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="text"
              placeholder="Search licenses..."
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
                <tr key={license.id} className="border-b border-[rgba(244,246,255,0.05)]">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <code className="text-[#4F46E5] mono">{license.licenseKey}</code>
                      <button
                        onClick={() => copyLicenseKey(license.licenseKey)}
                        className="p-1 rounded text-[#A7ACB8] hover:text-[#F4F6FF]"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#F4F6FF]">
                    {softwareMap[license.softwareId]?.name || 'Unknown'}
                  </td>
                  <td className="py-4 px-4 text-[#A7ACB8]">{getUserName(license.userId)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        license.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : license.status === 'blocked'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {license.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#A7ACB8]">
                    {license.currentActivations} / {license.maxActivations}
                  </td>
                  <td className="py-4 px-4 text-[#A7ACB8]">
                    {license.expiresAt
                      ? new Date(license.expiresAt).toLocaleDateString()
                      : 'Never'}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      {license.status === 'active' ? (
                        <button
                          onClick={() => handleBlock(license.id)}
                          className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25"
                          title="Block"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblock(license.id)}
                          className="p-2 rounded-lg bg-green-500/15 text-green-400 hover:bg-green-500/25"
                          title="Unblock"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleExtend(license.id)}
                        className="p-2 rounded-lg bg-[rgba(79,70,229,0.15)] text-[#4F46E5] hover:bg-[rgba(79,70,229,0.25)]"
                        title="Extend 1 Year"
                      >
                        <RefreshCw className="w-4 h-4" />
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
