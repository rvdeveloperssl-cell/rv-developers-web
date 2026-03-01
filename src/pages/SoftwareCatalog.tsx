import { useEffect, useState } from 'react';
import { Search, Filter, Download, ArrowRight, Star } from 'lucide-react';
import { softwareService } from '@/services/mockSoftwareService';
import type { Software, Category } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface SoftwareCatalogProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function SoftwareCatalog({ onNavigate }: SoftwareCatalogProps) {
  const [software, setSoftware] = useState<Software[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  setIsLoading(true);
  try {
    // softwareService එක ඇතුළේ දැන් cleanUrl තියෙන නිසා ප්‍රශ්නයක් වෙන්නේ නැහැ
    const [softwareData, categoriesData] = await Promise.all([
      softwareService.getAllSoftware(),
      softwareService.getCategories(),
    ]);
    
    setSoftware(softwareData);
    setCategories(categoriesData);
  } catch (error) {
    toast({
      title: 'Connection Error',
      description: 'MySQL Clients cannot connect.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

  const filteredSoftware = software.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const freeSoftware = filteredSoftware.filter((s) => s.isFree);
  const paidSoftware = filteredSoftware.filter((s) => !s.isFree);

  const SoftwareCard = ({ s }: { s: Software }) => (
    <div
      className="rv-card group cursor-pointer overflow-hidden"
      onClick={() => onNavigate('software-detail', { id: s.id })}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={s.imageUrl}
          alt={s.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {s.isFree ? (
            <span className="px-2 py-1 text-xs font-medium rounded bg-green-500/20 text-green-400">
              Free
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium rounded bg-[rgba(79,70,229,0.3)] text-[#4F46E5]">
              LKR {s.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Version Badge */}
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-medium rounded bg-[rgba(244,246,255,0.1)] text-[#A7ACB8]">
            v{s.version}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-[#F4F6FF] group-hover:text-[#4F46E5] transition-colors">
            {s.name}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-[#A7ACB8]">4.8</span>
          </div>
        </div>

        <p className="text-sm text-[#A7ACB8] mb-4 line-clamp-2">{s.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {s.features.slice(0, 3).map((feature) => (
            <span
              key={feature}
              className="text-xs px-2 py-1 rounded bg-[rgba(244,246,255,0.05)] text-[#A7ACB8]"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[rgba(244,246,255,0.05)]">
          <div className="flex items-center gap-2 text-sm text-[#A7ACB8]">
            <Download className="w-4 h-4" />
            <span>{s.downloadCount.toLocaleString()}</span>
          </div>
          <button className="text-sm text-[#4F46E5] flex items-center gap-1 group-hover:gap-2 transition-all">
            View Details
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="rv-container mb-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="rv-badge mb-4">Software Catalog</span>
          <h1 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4 mb-4">
            Premium Software{' '}
            <span className="rv-text-gradient">Solutions</span>
          </h1>
          <p className="text-lg text-[#A7ACB8]">
            Discover our collection of enterprise-grade software products designed for modern businesses.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="text"
              placeholder="Search software..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rv-input pl-12"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rv-input pl-12 pr-8 appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rv-container">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rv-card animate-pulse">
                <div className="aspect-video bg-[rgba(244,246,255,0.05)]" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-[rgba(244,246,255,0.05)] rounded w-3/4" />
                  <div className="h-4 bg-[rgba(244,246,255,0.05)] rounded" />
                  <div className="h-4 bg-[rgba(244,246,255,0.05)] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Free Software Section */}
            {freeSoftware.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#F4F6FF] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 text-sm">Free</span>
                  </span>
                  Free Software
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {freeSoftware.map((s) => (
                    <SoftwareCard key={s.id} s={s} />
                  ))}
                </div>
              </div>
            )}

            {/* Paid Software Section */}
            {paidSoftware.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-[#F4F6FF] mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[rgba(79,70,229,0.2)] flex items-center justify-center">
                    <span className="text-[#4F46E5] text-sm">Pro</span>
                  </span>
                  Premium Software
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paidSoftware.map((s) => (
                    <SoftwareCard key={s.id} s={s} />
                  ))}
                </div>
              </div>
            )}

            {filteredSoftware.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[rgba(244,246,255,0.05)] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-[#A7ACB8]" />
                </div>
                <h3 className="text-xl font-semibold text-[#F4F6FF] mb-2">
                  No software found
                </h3>
                <p className="text-[#A7ACB8]">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
