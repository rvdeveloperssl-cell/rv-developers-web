import { useEffect, useState } from 'react';
import { Search, Mail, Phone, Building, Calendar, Loader2, UserCheck, UserMinus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Client {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  nic?: string;
  createdAt: string;
  role: string;
  isVerified: boolean | number;
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const rawApiUrl = import.meta.env.VITE_API_URL || "";
  const API_URL = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/clients`);
      const data = await response.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading clients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [API_URL]);

  // Client කෙනෙක්ව Verify හෝ Unverify කරන Function එක
  const handleToggleVerify = async (id: string, currentStatus: any) => {
    // 0 හෝ 1 ලෙස එන එක boolean කරගන්න
    const numericStatus = (currentStatus == 1 || currentStatus === true) ? 1 : 0;
    const newStatus = numericStatus === 1 ? false : true; // Toggle කරනවා
    
    try {
      const response = await fetch(`${API_URL}/api/admin/clients/${id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        // 1. UI එකේ දත්ත වහාම අලුත් කරන්න (State update)
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id ? { ...client, isVerified: newStatus ? 1 : 0 } : client
          )
        );

        toast({
          title: "Success",
          description: `Client status updated to ${newStatus ? 'Verified' : 'Pending'}`,
        });
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      toast({
        title: "Error",
        description: "Connection error. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredClients = clients.filter((c) => {
    const query = searchQuery.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(query) ||
      c.email?.toLowerCase().includes(query) ||
      c.companyName?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin mb-2" />
        <p className="text-[#A7ACB8]">Loading client database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">Client Management</h1>
            <p className="text-[#A7ACB8] mt-1">Manage your clients and their accounts</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rv-input pl-12"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-[#F4F6FF]">{clients.length}</div>
            <div className="text-sm text-[#A7ACB8]">Total Clients</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-[#F4F6FF]">
              {clients.filter((c) => c.isVerified == 1 || c.isVerified === true).length}
            </div>
            <div className="text-sm text-[#A7ACB8]">Verified Clients</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-[#F4F6FF]">
              {clients.filter((c) => c.companyName).length}
            </div>
            <div className="text-sm text-[#A7ACB8]">Business Clients</div>
          </div>
        </div>

        <div className="rv-panel overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(244,246,255,0.08)]">
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Client</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Contact</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Company</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Joined</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Status</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-[rgba(244,246,255,0.05)] hover:bg-white/[0.02]">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-medium">
                        {client.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[#F4F6FF] font-medium">{client.fullName}</div>
                        <div className="text-sm text-[#A7ACB8]">{client.nic || 'No NIC'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-[#A7ACB8]">
                        <Mail className="w-4 h-4" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#A7ACB8]">
                        <Phone className="w-4 h-4" />
                        {client.phone || 'No Phone'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {client.companyName ? (
                      <div className="flex items-center gap-2 text-[#F4F6FF]">
                        <Building className="w-4 h-4 text-[#A7ACB8]" />
                        {client.companyName}
                      </div>
                    ) : (
                      <span className="text-[#A7ACB8]">-</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-[#A7ACB8]">
                      <Calendar className="w-4 h-4" />
                      {new Date(client.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (client.isVerified == 1 || client.isVerified === true)
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {(client.isVerified == 1 || client.isVerified === true) ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleVerify(client.id, client.isVerified)}
                      className={`p-2 rounded-lg transition-all ${
                        (client.isVerified == 1 || client.isVerified === true)
                          ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                          : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      }`}
                      title={(client.isVerified == 1 || client.isVerified === true) ? "Unverify Client" : "Verify Client"}
                    >
                      {(client.isVerified == 1 || client.isVerified === true) 
                        ? <UserMinus className="w-4 h-4" /> 
                        : <UserCheck className="w-4 h-4" />
                      }
                    </button>
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
