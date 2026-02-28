import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LoginProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // මෙන්න මෙතන තමයි වැරැද්ද තිබුණේ. 
    // අපි පරීක්ෂා කරමු email සහ password කියන state දෙකේ අගයන් තියෙනවද කියලා.
    console.log("Form States - Email:", email, "Password:", password);

    // කෙලින්ම අගයන් දෙක object එකක් විදිහට යවමු
    const loginData = {
      email: email,
      password: password
    };

    const result = await login(loginData);

    if (result.success) {
      toast({ title: 'Welcome back!', description: 'Successful login.' });
      if (result.user && result.user.role === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('dashboard');
      }
    } else {
      toast({
        title: 'Login Failed',
        description: result.message,
        variant: 'destructive',
      });
    }
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Server connection failed.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="rv-container">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#F4F6FF]">Welcome Back</h1>
            <p className="text-[#A7ACB8] mt-2">Sign in to access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="rv-panel p-8 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rv-input pl-12"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#F4F6FF] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A7ACB8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="rv-input pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A7ACB8] hover:text-[#F4F6FF] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="rv-btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Demo Credentials */}
            <div className="pt-4 border-t border-[rgba(244,246,255,0.08)]">
              <p className="text-xs text-[#A7ACB8] text-center mb-2">Demo Credentials:</p>
              <div className="text-xs text-[#A7ACB8] text-center space-y-1">
                <p>Client: demo@rvdevelopers.com / demo123</p>
                <p>Admin: admin@rvdevelopers.com / admin123</p>
              </div>
            </div>
          </form>

          {/* Register Link */}
          <p className="text-center mt-6 text-[#A7ACB8]">
            Don&apos;t have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[#4F46E5] hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
