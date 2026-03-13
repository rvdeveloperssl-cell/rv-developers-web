import { useEffect, useState, useRef } from 'react';
import { 
  ArrowLeft, Download, ShoppingCart, Check, Star, 
  Play, Monitor, Shield, Loader2, Send, MessageSquare,
  Package, ChevronRight
} from 'lucide-react';
import { softwareService } from '@/services/mockSoftwareService';
import type { Software } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface SoftwareDetailProps {
  softwareId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

// --- Reviews Component ---
function SoftwareReviews({ softwareId }: { softwareId: string }) {
  const { user, isAdmin } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [softwareId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const focusId = params.get('focusComment');
    if (focusId) {
      setTimeout(() => {
        const el = document.getElementById(`review-${focusId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-[#4F46E5]', 'ring-offset-2', 'ring-offset-[#0B0E16]');
        }
      }, 1000);
    }
  }, [reviews]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`https://api.rvdevelopers.lk/api/reviews/${softwareId}`);
      const data = await res.json();
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const response = await fetch('https://api.rvdevelopers.lk/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        softwareId,
        userId: user.id,
        fullName: user.fullName,
        rating,
        comment: newComment
      }),
    });

    if (response.ok) {
      setNewComment('');
      fetchReviews();
    }
  };

  const handleReplySubmit = async (reviewId: number) => {
    if (!replyText.trim()) return;

    try {
      const response = await fetch(`https://api.rvdevelopers.lk/api/reviews/reply/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyText: replyText,
        }),
      });

      if (response.ok) {
        setReplyText('');
        setReplyingTo(null);
        fetchReviews();
      }
    } catch (error) {
      console.error("Reply error:", error);
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <h3 className="text-2xl font-bold text-[#F4F6FF]">Customer Reviews</h3>

      {user ? (
        <form onSubmit={handleSubmitReview} className="rv-panel p-6 space-y-4">
          <p className="text-sm text-[#A7ACB8]">Posting as <span className="text-[#4F46E5]">{user.fullName}</span></p>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((starValue) => (
              <Star
                key={starValue}
                className={`w-6 h-6 cursor-pointer ${rating >= starValue ? 'text-yellow-400 fill-yellow-400' : 'text-[#A7ACB8]'}`}
                onClick={() => setRating(starValue)}
              />
            ))}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="rv-input w-full min-h-[100px]"
            placeholder="Write your feedback..."
            required
          />

          <button type="submit" className="rv-btn-primary flex items-center gap-2">
            Submit Review <Send className="w-4 h-4" />
          </button>
        </form>
      ) : (
        <div className="p-6 border border-dashed border-[#A7ACB8]/20 rounded-xl text-center">
          <p className="text-[#A7ACB8]">Please <span className="text-[#4F46E5] cursor-pointer underline">sign in</span> to leave a review.</p>
        </div>
      )}

      <div className="space-y-4">
        {reviews.map((rev: any) => (
          <div key={rev.id} id={`review-${rev.id}`} className="transition-all duration-500 rounded-lg overflow-hidden">
            <div className="p-4 bg-[#0B0E16]/50 rounded-lg border border-[rgba(244,246,255,0.05)]">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-[#F4F6FF]">{rev.fullName}</span>
                <div className="flex gap-1 text-yellow-400">
                  {Array(Number(rev.rating) || 0).fill(0).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                </div>
              </div>
              <p className="text-[#A7ACB8] text-sm">{rev.comment}</p>
              
              {rev.reply_text && (
                <div className="mt-4 ml-4 sm:ml-8 p-4 bg-[#4F46E5]/5 border-l-2 border-[#4F46E5] rounded-r-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                     <MessageSquare className="w-12 h-12 text-[#4F46E5]" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#4F46E5] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-[11px] font-bold text-[#4F46E5] uppercase tracking-[0.1em]">
                      Developer Response
                    </span>
                    {rev.reply_date && (
                      <span className="text-[10px] text-[#A7ACB8]">
                        • {new Date(rev.reply_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[#F4F6FF] text-sm leading-relaxed opacity-90">
                    {rev.reply_text}
                  </p>
                </div>
              )}

              {isAdmin && !rev.reply_text && (
                <button 
                  onClick={() => setReplyingTo(replyingTo === rev.id ? null : rev.id)}
                  className="mt-3 flex items-center gap-1 text-xs text-[#4F46E5] hover:text-[#F4F6FF] transition-colors"
                >
                  <MessageSquare className="w-3 h-3" /> {replyingTo === rev.id ? 'Cancel Reply' : 'Reply to Client'}
                </button>
              )}

              {replyingTo === rev.id && (
                <div className="mt-3 flex gap-2">
                  <input 
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="rv-input py-1.5 text-sm flex-1"
                    placeholder="Type your reply..."
                    autoFocus
                  />
                  <button 
                    onClick={() => handleReplySubmit(rev.id)}
                    className="rv-btn-primary px-3 py-1.5 text-xs"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Main Component ---
export default function SoftwareDetail({ softwareId, onNavigate }: SoftwareDetailProps) {
  const [software, setSoftware] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false); // නව කොටස: මිලදී ගෙන ඇත්දැයි බැලීමට
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (softwareId) {
      loadSoftware();
    }
  }, [softwareId]);

  // පරිශීලකයා මිලදී ගෙන ඇත්දැයි පරීක්ෂා කිරීම
  useEffect(() => {
    if (isAuthenticated && user && softwareId) {
      checkPurchaseStatus();
    }
  }, [isAuthenticated, user, softwareId]);

  const checkPurchaseStatus = async () => {
  if (!user?.id || !softwareId) return;
  
  try {
    const res = await fetch(`https://api.rvdevelopers.lk/api/licenses/user/${user.id}`);
    if (res.ok) {
      const licenses = await res.json();
      // String() පාවිච්චි කරලා ID දෙකම String විදිහට සසඳන්න
      const isOwned = licenses.some((lic: any) => 
        String(lic.softwareId) === String(softwareId) && lic.status === 'active'
      );
      setHasPurchased(isOwned);
      console.log("Ownership Status:", isOwned); // Debug කිරීමට මේක දාන්න
    }
  } catch (error) {
    console.error("License Check Error:", error);
  }
};

  const loadSoftware = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.rvdevelopers.lk/api/software/${softwareId}`);
      
      if (res.ok) {
        const data = await res.json();

        if (data && data.features) {
          try {
            if (typeof data.features === 'string' && data.features.startsWith('[')) {
              data.features = JSON.parse(data.features);
            } 
            else if (typeof data.features === 'string') {
              data.features = data.features.split(',').map((f: string) => f.trim());
            }
          } catch (e) {
            console.error("Features parsing error:", e);
            data.features = [];
          }
        } else {
          data.features = [];
        }

        setSoftware(data); 
      } else {
        toast({ title: 'Error', description: 'Software not found', variant: 'destructive' });
        onNavigate('software');
      }
    } catch (error) {
      console.error("Load Error:", error);
      toast({ title: 'Error', description: 'Failed to load software details', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!isAuthenticated) {
      toast({ title: 'Login Required', description: 'Please sign in to download software.' });
      onNavigate('login');
      return;
    }
    toast({ title: 'Download Started', description: `${software?.name} is being downloaded.` });
  };

  const handlePurchase = () => {
    if (!isAuthenticated) {
      toast({ title: 'Login Required', description: 'Please sign in to purchase software.' });
      onNavigate('login');
      return;
    }
    onNavigate('checkout', { id: softwareId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 rv-container text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#4F46E5]" />
      </div>
    );
  }

  if (!software) return null;

  // --- නව කොටස: මිලදී ගත් අයට පෙන්වන Download Links (Asset Hub) ---
  const renderAssetHub = () => {
    let links = [];
    try {
      links = typeof software.productLinks === 'string' 
        ? JSON.parse(software.productLinks) 
        : (software.productLinks || []);
    } catch (e) {
      links = [];
    }

    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-emerald-400" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Asset Downloads</span>
        </div>
        {links.length > 0 ? (
          links.map((link: any, index: number) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Download className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-xs font-bold text-[#F4F6FF] group-hover:text-emerald-400">
                  {link.label || 'Download File'}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A7ACB8]" />
            </a>
          ))
        ) : (
          <p className="text-[10px] text-[#A7ACB8] italic">No digital assets linked to this product.</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        <button
          onClick={() => onNavigate('software')}
          className="flex items-center gap-2 text-[#A7ACB8] hover:text-[#F4F6FF] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <img src={software.imageUrl} alt={software.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-transparent to-transparent" />
              
              {/* මිලදී ගෙන ඇත්නම් පෙන්වන badge එකක් */}
              {hasPurchased && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 shadow-lg">
                  <Check className="w-3 h-3" /> Licensed Product
                </div>
              )}

              {software.demoVideoUrl && (
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#4F46E5] flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-1" />
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="rv-badge">{software.category}</span>
                <span className="text-sm text-[#A7ACB8]">v{software.version}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#F4F6FF] mb-4">{software.name}</h1>
              <p className="text-lg text-[#A7ACB8]">{software.description}</p>
            </div>

            <div className="rv-panel p-6">
              <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">Key Features</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {software.features.map((feature: string) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[rgba(79,70,229,0.2)] flex items-center justify-center">
                      <Check className="w-3 h-3 text-[#4F46E5]" />
                    </div>
                    <span className="text-[#A7ACB8]">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rv-panel p-6">
              <h2 className="text-xl font-semibold text-[#F4F6FF] mb-4">System Requirements</h2>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4F46E5]/10 flex items-center justify-center flex-shrink-0">
                  <Monitor className="w-4 h-4 text-[#4F46E5]" />
                </div>
                <p className="text-[#A7ACB8] text-sm leading-relaxed">{software.systemRequirements || 'No specific requirements mentioned.'}</p>
              </div>
            </div>

            <SoftwareReviews softwareId={softwareId} />
          </div>

          <div className="space-y-6">
            <div className="rv-panel p-6 sticky top-24">
              <div className="text-center mb-6">
                {software.isFree ? (
                  <>
                    <span className="text-4xl font-bold text-green-400">Free</span>
                    <p className="text-sm text-[#A7ACB8] mt-2">No license required</p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-[#F4F6FF]">LKR {(Number(software.price) || 0).toLocaleString()}</span>
                    <p className="text-sm text-[#A7ACB8] mt-2">One-time purchase</p>
                  </>
                )}
              </div>

              {/* මෙතන තමයි Buy button එක හෝ Download links මාරු වෙන්නේ */}
              {hasPurchased ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                    <p className="text-emerald-400 text-xs font-bold">You own this software</p>
                  </div>
                  {renderAssetHub()}
                </div>
              ) : (
                <>
                  {software.isFree ? (
                    <button onClick={handleDownload} className="rv-btn-primary w-full flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" /> Download Now
                    </button>
                  ) : (
                    <button onClick={handlePurchase} className="rv-btn-primary w-full flex items-center justify-center gap-2">
                      <ShoppingCart className="w-4 h-4" /> Buy Now
                    </button>
                  )}
                </>
              )}

              <div className="mt-6 pt-6 border-t border-[rgba(244,246,255,0.08)] space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-green-500 uppercase tracking-tight">Verified Secure</p>
                    <p className="text-[10px] text-[#A7ACB8]">100% Virus Free & Tested</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A7ACB8]">Downloads</span>
                    <span className="text-[#F4F6FF]">{(Number(software.downloadCount) || 0).toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A7ACB8]">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-[#F4F6FF]">
                        {Number(software.averageRating) > 0 ? Number(software.averageRating).toFixed(1) : 'New'}
                      </span>
                      {Number(software.reviewCount) > 0 && (
                        <span className="text-[10px] text-[#A7ACB8]">({software.reviewCount})</span>
                      )}
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
    </div>
  );
}
