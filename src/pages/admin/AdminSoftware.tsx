import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { softwareService } from '@/services/mockSoftwareService';
import type { Software } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface AdminSoftwareProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function AdminSoftware({ onNavigate: _onNavigate }: AdminSoftwareProps) {
  const [software, setSoftware] = useState<Software[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [, setIsLoading] = useState(true);
  const [editingSoftware, setEditingSoftware] = useState<Software | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    version: '1.0.0',
    category: '',
    imageUrl: '',
    systemRequirements: '',
    isFree: false,
    features: [''],
  });

  useEffect(() => {
    loadSoftware();
  }, []);

  const loadSoftware = async () => {
    setIsLoading(true);
    try {
      const data = await softwareService.getAllSoftware();
      setSoftware(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load software',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        features: formData.features.filter((f) => f.trim() !== ''),
      };

      if (editingSoftware) {
        await softwareService.updateSoftware(editingSoftware.id, data);
        toast({ title: 'Success', description: 'Software updated successfully' });
      } else {
        await softwareService.createSoftware(data);
        toast({ title: 'Success', description: 'Software created successfully' });
      }

      setIsDialogOpen(false);
      resetForm();
      loadSoftware();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save software',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this software?')) return;

    try {
      await softwareService.deleteSoftware(id);
      toast({ title: 'Success', description: 'Software deleted successfully' });
      loadSoftware();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete software',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      version: '1.0.0',
      category: '',
      imageUrl: '',
      systemRequirements: '',
      isFree: false,
      features: [''],
    });
    setEditingSoftware(null);
  };

  const openEditDialog = (s: Software) => {
    setEditingSoftware(s);
    setFormData({
      name: s.name,
      description: s.description,
      price: s.price,
      version: s.version,
      category: s.category,
      imageUrl: s.imageUrl,
      systemRequirements: s.systemRequirements,
      isFree: s.isFree,
      features: s.features.length > 0 ? s.features : [''],
    });
    setIsDialogOpen(true);
  };

  const filteredSoftware = software.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#F4F6FF]">Software Management</h1>
            <p className="text-[#A7ACB8] mt-1">Manage your software products</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button onClick={resetForm} className="rv-btn-primary flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Software
              </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0B0E16] border-[rgba(244,246,255,0.08)] text-[#F4F6FF] max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingSoftware ? 'Edit Software' : 'Add New Software'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rv-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Version</label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="rv-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rv-input resize-none"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="rv-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="rv-input"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFree}
                      onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                      className="rounded border-[rgba(244,246,255,0.2)]"
                    />
                    <span className="text-sm">Free Software</span>
                  </label>
                  {!formData.isFree && (
                    <div className="flex-grow">
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        placeholder="Price (LKR)"
                        className="rv-input"
                        min={0}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">System Requirements</label>
                  <input
                    type="text"
                    value={formData.systemRequirements}
                    onChange={(e) => setFormData({ ...formData, systemRequirements: e.target.value })}
                    className="rv-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData({ ...formData, features: newFeatures });
                        }}
                        className="rv-input"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {index === formData.features.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                          className="px-3 py-2 rounded-lg bg-[rgba(79,70,229,0.15)] text-[#4F46E5]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = formData.features.filter((_, i) => i !== index);
                            setFormData({ ...formData, features: newFeatures });
                          }}
                          className="px-3 py-2 rounded-lg bg-red-500/15 text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="submit" className="rv-btn-primary flex-1">
                    {editingSoftware ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDialogOpen(false)}
                    className="rv-btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="text"
              placeholder="Search software..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rv-input pl-12"
            />
          </div>
        </div>

        {/* Software Table */}
        <div className="rv-panel overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(244,246,255,0.08)]">
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Software</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Category</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Price</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Version</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Downloads</th>
                <th className="text-left py-4 px-4 text-[#A7ACB8] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSoftware.map((s) => (
                <tr key={s.id} className="border-b border-[rgba(244,246,255,0.05)]">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={s.imageUrl}
                        alt={s.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="text-[#F4F6FF] font-medium">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-[#A7ACB8]">{s.category}</td>
                  <td className="py-4 px-4">
                    {s.isFree ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      <span className="text-[#F4F6FF]">LKR {s.price.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-[#A7ACB8]">{s.version}</td>
                  <td className="py-4 px-4 text-[#A7ACB8]">{s.downloadCount.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditDialog(s)}
                        className="p-2 rounded-lg bg-[rgba(79,70,229,0.15)] text-[#4F46E5] hover:bg-[rgba(79,70,229,0.25)] transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
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
