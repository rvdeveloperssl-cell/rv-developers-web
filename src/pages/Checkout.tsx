import { useEffect, useState } from 'react';
import { ArrowLeft, CreditCard, Building2, Upload, Check, Shield } from 'lucide-react';
import { softwareService } from '@/services/mockSoftwareService';
import { paymentService } from '@/services/mockPaymentService';
import type { Software } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface CheckoutProps {
  softwareId: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Checkout({ softwareId, onNavigate }: CheckoutProps) {
  const [software, setSoftware] = useState<Software | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });
  const { toast } = useToast();
  const { user } = useAuth();

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
        description: 'Failed to load software',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !software) return;

    setIsProcessing(true);
    try {
      const result = await paymentService.processCardPayment(user.id, software.id, cardData);
      if (result.success) {
        toast({
          title: 'Payment Successful!',
          description: 'Your software license has been generated.',
        });
        onNavigate('dashboard');
      } else {
        toast({
          title: 'Payment Failed',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Payment processing failed',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBankTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !software || !slipFile) return;

    setIsProcessing(true);
    try {
      const result = await paymentService.submitBankTransfer(user.id, software.id, slipFile);
      if (result.success) {
        toast({
          title: 'Slip Submitted',
          description: 'Your payment is pending verification. You will receive an email once approved.',
        });
        onNavigate('dashboard');
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit bank slip',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 rv-container">
        <div className="animate-pulse max-w-4xl mx-auto">
          <div className="h-8 bg-[rgba(244,246,255,0.05)] rounded w-1/4 mb-8" />
          <div className="h-64 bg-[rgba(244,246,255,0.05)] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!software) return null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="rv-container">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => onNavigate('software-detail', { id: softwareId })}
            className="flex items-center gap-2 text-[#A7ACB8] hover:text-[#F4F6FF] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Software
          </button>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left Column - Order Summary */}
            <div className="lg:col-span-2">
              <div className="rv-panel p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-[#F4F6FF] mb-6">Order Summary</h2>

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={software.imageUrl}
                    alt={software.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-[#F4F6FF] font-medium">{software.name}</h3>
                    <p className="text-sm text-[#A7ACB8]">v{software.version}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A7ACB8]">Subtotal</span>
                    <span className="text-[#F4F6FF]">LKR {software.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#A7ACB8]">Tax (0%)</span>
                    <span className="text-[#F4F6FF]">LKR 0</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[rgba(244,246,255,0.08)]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#F4F6FF] font-medium">Total</span>
                    <span className="text-2xl font-bold text-[#4F46E5]">
                      LKR {software.price.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-4 rounded-lg bg-[rgba(79,70,229,0.1)] flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#4F46E5]" />
                  <div className="text-sm">
                    <div className="text-[#F4F6FF] font-medium">Secure Payment</div>
                    <div className="text-[#A7ACB8]">256-bit SSL encryption</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Payment */}
            <div className="lg:col-span-3">
              <div className="rv-panel p-6">
                <h2 className="text-lg font-semibold text-[#F4F6FF] mb-6">Payment Method</h2>

                {/* Payment Method Tabs */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 p-4 rounded-lg border transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#4F46E5] bg-[rgba(79,70,229,0.1)]'
                        : 'border-[rgba(244,246,255,0.08)] hover:border-[rgba(244,246,255,0.15)]'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'card' ? 'text-[#4F46E5]' : 'text-[#A7ACB8]'}`} />
                    <div className={`text-sm font-medium ${paymentMethod === 'card' ? 'text-[#F4F6FF]' : 'text-[#A7ACB8]'}`}>
                      Card Payment
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex-1 p-4 rounded-lg border transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-[#4F46E5] bg-[rgba(79,70,229,0.1)]'
                        : 'border-[rgba(244,246,255,0.08)] hover:border-[rgba(244,246,255,0.15)]'
                    }`}
                  >
                    <Building2 className={`w-6 h-6 mb-2 ${paymentMethod === 'bank' ? 'text-[#4F46E5]' : 'text-[#A7ACB8]'}`} />
                    <div className={`text-sm font-medium ${paymentMethod === 'bank' ? 'text-[#F4F6FF]' : 'text-[#A7ACB8]'}`}>
                      Bank Transfer
                    </div>
                  </button>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <form onSubmit={handleCardPayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        className="rv-input"
                        maxLength={16}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          placeholder="MM/YY"
                          className="rv-input"
                          maxLength={5}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          placeholder="123"
                          className="rv-input"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        placeholder="John Doe"
                        className="rv-input"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="rv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Pay LKR {software.price.toLocaleString()}
                          <CreditCard className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* Bank Transfer Form */}
                {paymentMethod === 'bank' && (
                  <form onSubmit={handleBankTransfer} className="space-y-4">
                    <div className="p-4 rounded-lg bg-[rgba(244,246,255,0.03)]">
                      <h4 className="text-[#F4F6FF] font-medium mb-3">Bank Account Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#A7ACB8]">Bank:</span>
                          <span className="text-[#F4F6FF]">Commercial Bank</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A7ACB8]">Account Name:</span>
                          <span className="text-[#F4F6FF]">RV Developers (Pvt) Ltd</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A7ACB8]">Account Number:</span>
                          <span className="text-[#F4F6FF] mono">1234567890</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#A7ACB8]">Branch:</span>
                          <span className="text-[#F4F6FF]">Colombo 03</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
                        Upload Bank Slip
                      </label>
                      <div className="border-2 border-dashed border-[rgba(244,246,255,0.15)] rounded-lg p-8 text-center hover:border-[#4F46E5]/50 transition-colors">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                          className="hidden"
                          id="slip-upload"
                          required
                        />
                        <label htmlFor="slip-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-[#A7ACB8] mx-auto mb-3" />
                          <p className="text-[#F4F6FF] font-medium mb-1">
                            {slipFile ? slipFile.name : 'Click to upload bank slip'}
                          </p>
                          <p className="text-sm text-[#A7ACB8]">
                            JPG, PNG or PDF up to 5MB
                          </p>
                        </label>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-sm text-yellow-400">
                        <strong>Note:</strong> Your software license will be generated after payment verification (usually within 24 hours).
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isProcessing || !slipFile}
                      className="rv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Submit Payment
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
