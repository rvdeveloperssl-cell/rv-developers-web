import { useEffect, useState } from 'react';
import { ArrowLeft, Download, ShoppingCart, Check, Star, Play, Monitor } from 'lucide-react';
import { softwareService } from '@/services/mockSoftwareService';
import type { Software } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google'; // මෙහෙම වෙනස් කරන්න
import { Shield, Loader2 } from 'lucide-react';


interface SoftwareDetailProps {
  softwareId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function SoftwareDetail({ softwareId, onNavigate }: SoftwareDetailProps) {
  const [software, setSoftware] = useState<Software | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (softwareId) {
      loadSoftware();
    }
  }, [softwareId]);

  const loadSoftware = async () => {
    setIsLoading(true);
    try {
      const data = await softwareService.getSoftwareById(softwareId);
      if (data) {
        setSoftware(data);
      } else {
        toast({
          title: 'Error',
          description: 'Software not found',
          variant: 'destructive',
        });
        onNavigate('software');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load software details',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please sign in to download software.',
      });
      onNavigate('login');
      return;
    }
    toast({
      title: 'Download Started',
      description: `${software?.name} is being downloaded.`,
    });
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login Required',
        description: 'Please sign in to purchase software.',
      });
      onNavigate('login');
      return;
    }
    onNavigate('checkout', { id: softwareId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 rv-container">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-[rgba(244,246,255,0.05)] rounded w-1/4" />
          <div className="aspect-video bg-[rgba(244,246,255,0.05)] rounded-xl" />
          <div className="space-y-4">
            <div className="h-6 bg-[rgba(244,246,255,0.05)] rounded w-3/4" />
            <div className="h-4 bg-[rgba(244,246,255,0.05)] rounded" />
            <div className="h-4 bg-[rgba(244,246,255,0.05)] rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!software) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        {/* Back Button */}
        <button
          onClick={() => onNavigate('software')}
          className="flex items-center gap-2 text-[#A7ACB8] hover:text-[#F4F6FF] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <img
                src={software.imageUrl}
                alt={software.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-transparent to-transparent" />
              
              {/* Demo Video Button */}
              {software.demoVideoUrl && (
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#4F46E5] flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
              )}
            </div>

            {/* Title Section */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="rv-badge">{software.category}</span>
                <span className="text-sm text-[#A7ACB8]">v{software.version}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF] mb-4">
                {software.name}
              </h1>
              <p className="text-lg text-[#A7ACB8]">{software.description}</p>
            </div>

            {/* Features */}
            <div className="rv-panel p-6">
              <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {software.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[rgba(79,70,229,0.2)] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#4F46E5]" />
                    </div>
                    <span className="text-[#A7ACB8]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Requirements */}
            <div className="rv-panel p-6">
              <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">System Requirements</h2>
              <div className="flex items-start gap-3">
                <Monitor className="w-5 h-5 text-[#4F46E5] mt-0.5" />
                <p className="text-[#A7ACB8]">{software.systemRequirements}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="rv-panel p-6 sticky top-24">
              <div className="text-center mb-6">
                {software.isFree ? (
                  <>
                    <span className="text-4xl font-bold text-green-400">Free</span>
                    <p className="text-sm text-[#A7ACB8] mt-2">No license required</p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-[#F4F6FF]">
                      LKR {software.price.toLocaleString()}
                    </span>
                    <p className="text-sm text-[#A7ACB8] mt-2">One-time purchase</p>
                  </>
                )}
              </div>

              {software.isFree ? (
                <button
                  onClick={handleDownload}
                  className="rv-btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Now
                </button>
              ) : (
                <button
                  onClick={handlePurchase}
                  className="rv-btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Buy Now
                </button>
              )}

              /* --- Sidebar එකේ Price Card එක ඇතුළත Setup Firebase කොටස --- */
{isAuthenticated && software.requiresFirebase && (
  <div className="mt-4 pt-4 border-t border-[rgba(244,246,255,0.08)]">
    <p className="text-[10px] text-[#A7ACB8] uppercase tracking-wider mb-3 text-center font-bold">
      Required Database Setup
    </p>
    
    <button
      onClick={() => login()} // මෙන්න මෙතනින් තමයි අර popup එක එන්නේ
      disabled={isSettingUp}
      className="rv-btn-secondary w-full flex items-center justify-center gap-2 border-[#4F46E5] text-[#F4F6FF] hover:bg-[#4F46E5]/10 py-2.5 rounded-lg transition-all"
    >
      {isSettingUp ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Shield className="w-4 h-4 text-[#4F46E5]" />
      )}
      {isSettingUp ? 'Connecting...' : 'Setup Private Firebase'}
    </button>

    <p className="text-[11px] text-[#A7ACB8] mt-3 text-center leading-relaxed px-2">
      Link your Google account to create a secure, private database for this software.
    </p>
  </div>
)}
    {/* ------------------------------------------ */}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-[rgba(244,246,255,0.08)] space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A7ACB8]">Downloads</span>
                  <span className="text-[#F4F6FF]">{software.downloadCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A7ACB8]">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-[#F4F6FF]">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#A7ACB8]">Version</span>
                  <span className="text-[#F4F6FF]">{software.version}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
