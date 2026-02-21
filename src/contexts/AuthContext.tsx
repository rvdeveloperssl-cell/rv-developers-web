import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '@/types';
import { authService } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    fullName: string;
    email: string;
    phone: string;
    nic: string;
    address: string;
    companyName?: string;
    password: string;
    otp: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  sendOTP: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    fullName: string;
    email: string;
    phone: string;
    nic: string;
    address: string;
    companyName?: string;
    password: string;
    otp: string;
  }) => {
    setIsLoading(true);
    try {
      // 1. Browser එකේ හංගපු OTP එක ලබාගන්නවා
      const savedOTP = sessionStorage.getItem('rv_temp_otp');

    // 1. මුලින්ම Frontend එකේදී OTP එක චෙක් කරනවා
    if (data.otp !== savedOTP) {
      return { success: false, message: 'Invalid or expired OTP code.' };
    }

    // 2. OTP එක හරි නම් විතරක් Service එකට යවනවා. 
    // වැදගත්: මෙතනදී data.otp වෙනුවට Mock service එකට ඕන කරන විදිහට දත්ත යවන්න.
    const result = await authService.register(data, data.otp); 
    
    if (result.success) {
      setUser(result.user);
      sessionStorage.removeItem('rv_temp_otp');
    }
    return result;
  } finally {
    setIsLoading(false);
  }
};

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOTP = async (email: string) => {
    try {
      // 1. ඉලක්කම් 6ක OTP එකක් මෙහේදීම හදනවා
      const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 2. පස්සේ register වෙද්දී බලන්න මේක Browser එකේ තාවකාලිකව සඟවනවා
      sessionStorage.setItem('rv_temp_otp', generatedOTP);

      // 3. දැන් ඔයාගේ Google Script එකට Email එක සහ OTP එක යවනවා
      const response = await fetch(import.meta.env.VITE_GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          otp: generatedOTP 
        }),
      });

      if (response.ok) {
        return { success: true, message: 'OTP sent successfully!' };
      }
      return { success: false, message: 'Failed to send OTP email.' };
    } catch (error) {
      return { success: false, message: 'Network error occurred.' };
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    const savedOTP = sessionStorage.getItem('rv_temp_otp');
    if (otp === savedOTP) {
      return { success: true, message: 'Verified!' };
    }
    return { success: false, message: 'Invalid code.' };
  };

  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
        isLoading,
        login,
        register,
        logout,
        sendOTP,
        verifyOTP,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
