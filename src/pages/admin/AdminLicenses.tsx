import { useEffect, useState } from 'react';
import { Search, Copy, Ban, CheckCircle, Calendar, RefreshCw, Clock } from 'lucide-react';
import { licenseService } from '@/services/licenseService';
import { softwareService } from '@/services/mockSoftwareService';
import type { License, Software } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AdminLicensesProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminLicenses({ onNavigate: _onNavigate }: AdminLicensesProps) {
  const [licenses, setLicenses] = useState<(License & { fullName?: string })[]>([]);
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
      // මෙතනදී අපි getAllLicenses API එකෙන් එන දත්ත කෙලින්ම ගන්නවා
      const [licensesData, softwareData] = await Promise.all([
        licenseService.getAllLicenses(), // මෙහිදී backend එකෙන්ම fullName එක ලැබෙන ලෙස සකස් කළ යුතුයි
        softwareService.getAllSoftware(),
      ]);

      setLicenses(licensesData);

      const map: Record<string, Software> = {};
      softwareData.forEach((s: Software) => {
        map[s.id] = s;
      });
      setSoftwareMap(map);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sync with database',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Expiry Date එක වෙනස් කිරීම (Admin ට කැමති දිනයක් දීමට)
  const handleUpdateExpiry = async (id: string) => {
    const newDate = prompt("Enter new Expiry Date (YYYY-MM-DD) or type 'lifetime':");
    if (!newDate) return;

    let finalExpiry = '';
    if (newDate.toLowerCase() === 'lifetime') {
      finalExpiry = '2099-12-31 23:59:59';
    } else {
      finalExpiry = `${newDate} 23:59:59`;
    }

    try {
      await licenseService.updateExpiry(id, finalExpiry);
      toast({ title: 'Updated!', description: 'License expiry date changed.' });
      loadData(); // දත්ත Reload කිරීම
    } catch (error) {
      toast({ title: 'Error', description: 'Invalid date format', variant: 'destructive' });
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

  const copyLicenseKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Copied!', description: 'Key copied to clipboard' });
  };

  const filteredLicenses = licenses.filter(
    (l) =>
      l.licenseKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.fullName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Licenses</h2>
        <button 
          onClick={loadData} 
          disabled={isLoading}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 text-[#A7ACB8]"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
        <input
          type="text"
          placeholder="Search by key or user name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#1A1F2E] border border-white/10 rounded-lg text-white"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b border-white/5 text-[#A7ACB8]">
              <th className="p-4">Software & User</th>
              <th className="p-4">License Key</th>
              <th className="p-4">Status</th>
              <th className="p-4">Expiry Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLicenses.map((license) => (
              <tr key={license.id} className="border-b border-white/5 text-white hover:bg-white/5">
                <td className="p-4">
                  <div className="font-medium text-blue-400">
                    {softwareMap[license.softwareId]?.name || 'Loading...'}
                  </div>
                  <div className="text-sm text-[#A7ACB8]">{license.fullName || 'User ID: ' + license.userId}</div>
                </td>
                <td className="p-4 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    {license.licenseKey}
                    <button onClick={() => copyLicenseKey(license.licenseKey)}>
                      <Copy className="w-4 h-4 text-[#A7ACB8]" />
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    license.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {license.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-orange-400" />
                    {format(new Date(license.expiresAt), 'PPP')}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpdateExpiry(license.id)}
                      className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"
                      title="Update Expiry"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                    {license.status === 'active' ? (
                      <button 
                        onClick={() => handleBlock(license.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleUnblock(license.id)}
                        className="p-2 bg-green-500/10 text-green-400 rounded-lg"
                      >
                        <CheckCircle className="w-4 h-4" />
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
  );
}
