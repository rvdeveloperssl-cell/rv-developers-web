import { useState } from 'react';
import { Search, Mail, Phone, Building, Calendar } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

interface AdminClientsProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminClients({ onNavigate: _onNavigate }: AdminClientsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const clients = mockUsers.filter((u) => u.role === 'client');

  const filteredClients = clients.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">Client Management</h1>
            <p className="text-[#A7ACB8] mt-1">Manage your clients and their accounts</p>
          </div>
        </div>

        {/* Search */}
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

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-[#F4F6FF]">{clients.length}</div>
            <div className="text-sm text-[#A7ACB8]">Total Clients</div>
          </div>
          <div className="rv-panel p-6">
            <div className="text-3xl font-bold text-[#F4F6FF]">
              {clients.filter((c) => c.isVerified).length}
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

        {/* Clients Table */}
        <div className="rv-panel overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(244,246,255,0.08)]">
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Client</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Contact</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Company</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Joined</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-[rgba(244,246,255,0.05)]">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center text-white font-medium">
                        {client.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-[#F4F6FF] font-medium">{client.fullName}</div>
                        <div className="text-sm text-[#A7ACB8]">{client.nic}</div>
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
                        {client.phone}
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
                      className={`px-3 py-1 rounded-full text-xs ${
                        client.isVerified
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {client.isVerified ? 'Verified' : 'Pending'}
                    </span>
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
