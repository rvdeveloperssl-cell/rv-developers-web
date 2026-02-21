import { useState, useEffect } from 'react'; // useEffect මෙතනට අනිවාර්යයෙන්ම ඕනේ
import { Lock, Mail, User, Phone, MapPin, Briefcase, ArrowRight, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";



interface RegisterProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    address: '',
    companyName: '',
    password: '',
    confirmPassword: '',
  });
  // --- අලුතින් එකතු කරන කොටස ---
  const [resendTimer, setResendTimer] = useState(60);

  useEffect(() => {
    let interval: any;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      const result = await sendOTP(formData.email);
      if (result.success) {
        toast({ title: 'OTP Resent', description: 'Please check your email.' });
        setResendTimer(60); // Timer එක Reset කරනවා
      }
    } finally {
      setIsLoading(false);
    }
  };
  // ----------------------------
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, sendOTP } = useAuth();
  const { toast } = useToast();

  const handleGoogleSuccess = (credentialResponse: any) => {
    const decoded: any = jwtDecode(credentialResponse.credential);
    setFormData({
        ...formData,
        fullName: decoded.name || '',
        email: decoded.email || '',
    });
    toast({
        title: 'Google Connected',
        description: 'Name and Email imported. Please fill other details.',
    });
};

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOTP(formData.email);
      if (result.success) {
        toast({
          title: 'OTP Sent',
          description: 'Check your email for the verification code.',
        });
        setResendTimer(60); // අලුතින් OTP යවද්දී Timer එක 60 කරන්න
        setStep('otp');
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
        description: 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        nic: formData.nic,
        address: formData.address,
        companyName: formData.companyName,
        password: formData.password,
        otp,
      });

      if (result.success) {
        toast({
          title: 'Welcome!',
          description: 'Your account has been created successfully.',
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
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderDetailsForm = () => (
    <form onSubmit={handleSendOTP} className="space-y-4">

      {/* Google Button Section */}
<div className="mb-6">
    <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => toast({ title: 'Error', description: 'Google Login Failed', variant: 'destructive' })}
        useOneTap
        theme="filled_black"
        shape="pill"
        width="100%"
    />
    <div className="relative mt-6 mb-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[rgba(244,246,255,0.1)]"></div></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="px-2 bg-[#0B0E16] text-[#A7ACB8]">Or register manually</span></div>
    </div>
</div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              className="rv-input pl-12"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="you@example.com"
              className="rv-input pl-12"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+94 77 123 4567"
              className="rv-input pl-12"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
            NIC *
          </label>
          <input
            type="text"
            value={formData.nic}
            onChange={(e) => setFormData({ ...formData, nic: e.target.value })}
            placeholder="123456789V"
            className="rv-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
          Address *
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="123 Main Street, Colombo"
            className="rv-input pl-12"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
          Company Name (Optional)
        </label>
        <div className="relative">
          <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="Your Company Ltd"
            className="rv-input pl-12"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
            Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="rv-input pl-12"
              required
              minLength={8}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="rv-input pl-12"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
          className="rounded border-[rgba(244,246,255,0.2)] bg-[#0B0E16] text-[#4F46E5]"
        />
        <label htmlFor="showPassword" className="text-sm text-[#A7ACB8]">
          Show password
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Continue
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );

  const renderOTPForm = () => (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[rgba(79,70,229,0.15)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#4F46E5]" />
        </div>
        <h3 className="text-xl font-semibold text-[#F4F6FF] mb-2">
          Verify Your Email
        </h3>
        <p className="text-[#A7ACB8]">
          Enter the 6-digit code sent to <span className="text-[#F4F6FF]">{formData.email}</span>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
          Verification Code
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          className="rv-input text-center text-2xl tracking-[0.5em]"
          maxLength={6}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.length !== 6}
        className="rv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Create Account
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* --- Resend Section එක මෙතනට දාන්න --- */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendTimer > 0 || isLoading}
          className="text-sm text-[#4F46E5] disabled:text-[#A7ACB8] font-medium hover:underline transition-all"
        >
          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Code'}
        </button>
      </div>
      {/* ------------------------------------- */}

      <button
        type="button"
        onClick={() => setStep('details')}
        className="w-full text-sm text-[#A7ACB8] hover:text-[#F4F6FF] transition-colors"
      >
        Back to details
      </button>
    </form>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="rv-container">
        <div className="max-w-lg mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#F4F6FF]">
              {step === 'details' ? 'Create Account' : 'Verify Email'}
            </h1>
            <p className="text-[#A7ACB8] mt-2">
              {step === 'details'
                ? 'Join RV Developers and access premium software'
                : 'One more step to complete your registration'}
            </p>
          </div>

          {/* Form */}
          <div className="rv-panel p-8">
            {step === 'details' ? renderDetailsForm() : renderOTPForm()}
          </div>

          {/* Login Link */}
          <p className="text-center mt-6 text-[#A7ACB8]">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[#4F46E5] hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
