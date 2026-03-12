import { useEffect, useState } from 'react';
import { 
  Plus, Edit2, Trash2, Search, X, Smile, 
  Link as LinkIcon, Download, Smartphone, 
  Globe, Package, Info, CheckCircle, ExternalLink 
} from 'lucide-react';
import type { Software } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface AdminSoftwareProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminSoftware({ onNavigate: _onNavigate }: AdminSoftwareProps) {
  const [software, setSoftware] = useState<Software[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    productSlug: '', // SEO & Unique URL identifier
    description: '',
    price: 0,
    version: '1.0.0',
    category: '',
    imageUrl: '',
    systemRequirements: '',
    downloadUrl: '', // Desktop link
    mobileAppUrl: '', // Mobile link
    extraLink: '',    // Manual/Docs link
    isFree: false,
    isActive: true,
    features: [''],
  });

  useEffect(() => {
    loadSoftware();
  }, []);

  const getApiUrl = (endpoint: string) => {
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${base}${endpoint}`;
  };

  const loadSoftware = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/software'));
      if (!response.ok) throw new Error('Failed to fetch from DB');
      const data = await response.json();
      setSoftware(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load software database',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingSoftware ? 'PUT' : 'POST';
      const url = editingSoftware 
        ? getApiUrl(`/api/software/${editingSoftware.id}`) 
        : getApiUrl('/api/software');

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: formData.isFree ? 0 : formData.price,
          features: formData.features.filter((f) => f.trim() !== '')
        }),
      });

      if (response.ok) {
        toast({ 
          title: 'Deployment Success', 
          description: editingSoftware ? 'Cloud database updated.' : 'New product published successfully.' 
        });
        setIsDialogOpen(false);
        resetForm();
        loadSoftware();
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      toast({
        title: 'Deployment Error',
        description: 'Failed to sync with MySQL database.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will permanently remove the product from the server.')) return;
    try {
      const response = await fetch(getApiUrl(`/api/software/${id}`), { method: 'DELETE' });
      if (response.ok) {
        toast({ title: 'Removed', description: 'Product deleted from registry.' });
        loadSoftware();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Deletion failed.', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      productSlug: '',
      description: '',
      price: 0,
      version: '1.0.0',
      category: '',
      imageUrl: '',
      systemRequirements: '',
      downloadUrl: '',
      mobileAppUrl: '',
      extraLink: '',
      isFree: false,
      isActive: true,
      features: [''],
    });
    setEditingSoftware(null);
  };

  const openEditDialog = (s: any) => {
    setEditingSoftware(s);
    setFormData({
      name: s.name,
      productSlug: s.productSlug || '',
      description: s.description || '',
      price: s.price,
      version: s.version,
      category: s.category,
      imageUrl: s.imageUrl,
      systemRequirements: s.systemRequirements || '',
      downloadUrl: s.downloadUrl || '',
      mobileAppUrl: s.mobileAppUrl || '',
      extraLink: s.extraLink || '',
      isFree: s.isFree === 1 || s.isFree === true,
      isActive: s.isActive === 1 || s.isActive === true,
      features: s.features ? (typeof s.features === 'string' ? JSON.parse(s.features) : s.features) : [''],
    });
    setIsDialogOpen(true);
  };

  const filteredSoftware = software.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.productSlug?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#05060B]">
      <div className="rv-container">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#4F46E5] mb-2">
              <Package className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Inventory Console</span>
            </div>
            <h1 className="text-4xl font-black text-[#F4F6FF]">Software Registry</h1>
            <p className="text-[#A7ACB8] mt-2">Create, Update and Deploy your software assets to the production database.</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="rv-btn-primary h-12 px-8 flex items-center gap-3 shadow-lg shadow-indigo-500/20">
                <Plus className="w-5 h-5" />
                Add New Software
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0B0E16] border-[rgba(244,246,255,0.08)] text-[#F4F6FF] max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  {editingSoftware ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                  {editingSoftware ? 'Modify Package' : 'Publish New Package'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Basic Info Group */}
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#A7ACB8] uppercase tracking-wider">Display Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rv-input h-11"
                      placeholder="e.g. RV PRO POS ULTRA"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#A7ACB8] uppercase tracking-wider">Product Slug (URL Path)</label>
                    <input
                      type="text"
                      value={formData.productSlug}
                      onChange={(e) => setFormData({ ...formData, productSlug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="rv-input h-11 border-indigo-500/30 focus:border-indigo-500"
                      placeholder="e.g. pos-pro-ultra"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#A7ACB8] uppercase tracking-wider">Description & Release Notes</label>
                  <div className="relative">
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="rv-input min-h-[120px] py-4 pr-12"
                      placeholder="Describe the software functionality and updates..."
                      required
                    />
                    <Smile className="absolute right-4 top-4 w-5 h-5 text-indigo-400 opacity-40" />
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#A7ACB8] uppercase tracking-wider">Build Version</label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="rv-input"
                      placeholder="1.0.0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#A7ACB8] uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="rv-input"
                      placeholder="Enterprise / Utility"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#A7ACB8] uppercase tracking-wider">Cover Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="rv-input"
                    />
                  </div>
                </div>

                {/* Package Download Links Hub */}
                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-indigo-200">Package Distribution Links</h3>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#A7ACB8] uppercase"><Globe className="w-3 h-3" /> Desktop Application (.exe / .msi)</div>
                      <input
                        type="url"
                        value={formData.downloadUrl}
                        onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                        className="rv-input bg-[#05060B]"
                        placeholder="https://cdn.rv.lk/setup.exe"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[#A7ACB8] uppercase"><Smartphone className="w-3 h-3" /> Android / Mobile Package (.apk)</div>
                      <input
                        type="url"
                        value={formData.mobileAppUrl}
                        onChange={(e) => setFormData({ ...formData, mobileAppUrl: e.target.value })}
                        className="rv-input bg-[#05060B]"
                        placeholder="https://cdn.rv.lk/app.apk"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#A7ACB8] uppercase"><Info className="w-3 h-3" /> Documentation / Extra Resources</div>
                    <input
                      type="url"
                      value={formData.extraLink}
                      onChange={(e) => setFormData({ ...formData, extraLink: e.target.value })}
                      className="rv-input bg-[#05060B]"
                      placeholder="User Manual or Documentation URL"
                    />
                  </div>
                </div>

                {/* Pricing & Visibility */}
                <div className="flex flex-wrap items-center gap-8 py-4 border-y border-white/5">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                      className="w-5 h-5 rounded border-indigo-500/30 bg-[#05060B] text-indigo-500"
                    />
                    <span className="text-sm font-bold group-hover:text-indigo-400 transition-colors">Mark as Free Software</span>
                  </label>

                  {!formData.isFree && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#A7ACB8] uppercase">Price (LKR)</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        className="rv-input w-40 h-10"
                        min={0}
                      />
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#A7ACB8] uppercase tracking-wider">Key Product Features</label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[index] = e.target.value;
                            setFormData({ ...formData, features: newFeatures });
                          }}
                          className="rv-input h-10 text-sm"
                          placeholder={`Feature #${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (index === formData.features.length - 1) {
                              setFormData({ ...formData, features: [...formData.features, ''] });
                            } else {
                              setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
                            }
                          }}
                          className={`px-3 rounded-lg transition-colors ${index === formData.features.length - 1 ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                        >
                          {index === formData.features.length - 1 ? <Plus className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="submit" className="rv-btn-primary flex-1 h-12 text-lg">
                    {editingSoftware ? 'Sync Changes to Cloud' : 'Deploy to Production'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="rv-btn-secondary h-12 px-6"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8] group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, category or product slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rv-input pl-12 h-14 bg-[#0B0E16] border-white/5 focus:border-indigo-500/50 shadow-2xl"
            />
          </div>
        </div>

        {/* Software Table View */}
        <div className="rv-panel border-white/5 bg-[#0B0E16]/50 backdrop-blur-xl overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="p-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-[#A7ACB8] font-medium tracking-widest uppercase text-xs">Accessing SQL Data Cluster...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="py-5 px-6 text-[10px] font-bold text-[#A7ACB8] uppercase tracking-widest">Product Information</th>
                    <th className="py-5 px-6 text-[10px] font-bold text-[#A7ACB8] uppercase tracking-widest">Status / URL</th>
                    <th className="py-5 px-6 text-[10px] font-bold text-[#A7ACB8] uppercase tracking-widest">Pricing</th>
                    <th className="py-5 px-6 text-[10px] font-bold text-[#A7ACB8] uppercase tracking-widest">Assets</th>
                    <th className="py-5 px-6 text-[10px] font-bold text-[#A7ACB8] uppercase tracking-widest text-right">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredSoftware.map((s: any) => (
                    <tr key={s.id} className="hover:bg-indigo-500/[0.02] transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={s.imageUrl}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all"
                            />
                            {s.isActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0B0E16]"></div>}
                          </div>
                          <div>
                            <div className="text-[#F4F6FF] font-bold group-hover:text-indigo-400 transition-colors">{s.name}</div>
                            <div className="text-[10px] text-[#A7ACB8] font-mono mt-0.5">VER: {s.version} | {s.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-mono text-indigo-400/80">/{s.productSlug}</span>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-[10px] uppercase font-bold text-[#A7ACB8] tracking-tighter">
                              {s.isActive ? 'Live on Portal' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        {s.isFree ? (
                          <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/10 text-green-400 uppercase tracking-widest border border-green-500/20">Open Source</span>
                        ) : (
                          <span className="text-[#F4F6FF] font-mono font-bold">LKR {Number(s.price).toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex gap-2">
                          {s.downloadUrl && <Download className="w-4 h-4 text-blue-400" title="Desktop Link Available" />}
                          {s.mobileAppUrl && <Smartphone className="w-4 h-4 text-purple-400" title="Mobile App Available" />}
                          {s.extraLink && <ExternalLink className="w-4 h-4 text-orange-400" title="Docs Available" />}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditDialog(s)}
                            className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg shadow-indigo-500/10"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSoftware.length === 0 && (
                <div className="p-20 text-center">
                  <Package className="w-12 h-12 text-white/5 mx-auto mb-4" />
                  <p className="text-[#A7ACB8]">No packages found in the database.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
