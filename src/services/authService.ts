import type { User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;
// OTP එක තාවකාලිකව තියාගන්න (Frontend verification සඳහා අවශ්‍ය නම් පමණක්)
const OTP_STORE: Record<string, { otp: string; expiresAt: number }> = {};

class AuthService {
  // 1. OTP යවන කොටස (VPS Backend එකට)
  async sendOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log("--- Sending OTP via VPS Backend ---");
      const cleanUrl = API_URL.endsWith('/') ? `${API_URL}api/send-otp` : `${API_URL}/api/send-otp`;
      
      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Verification සඳහා OTP එක මතක තබා ගැනීම
        OTP_STORE[email] = { 
          otp, 
          expiresAt: Date.now() + 10 * 60 * 1000 // විනාඩි 10 කින් expire වේ
        };
        return { success: true, message: 'OTP sent to your email.' };
      } else {
        return { success: false, message: data.message || 'Failed to send OTP.' };
      }
    } catch (error) {
      console.error("VPS SendOTP Error:", error);
      return { success: false, message: 'Server connection error.' };
    }
  }

  // 2. Register වන කොටස
  async register(data: any, userOTP: string): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      // Frontend එකේදී OTP එක නිවැරදිදැයි බලනවා
      const stored = OTP_STORE[data.email];
      if (!stored || stored.otp !== userOTP) {
        return { success: false, message: 'Invalid OTP code.' };
      }
      
      if (Date.now() > stored.expiresAt) {
        return { success: false, message: 'OTP has expired.' };
      }

      const cleanUrl = API_URL.endsWith('/') ? `${API_URL}api/register` : `${API_URL}/api/register`;
      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        delete OTP_STORE[data.email]; // වැඩේ ඉවර නිසා OTP එක අයින් කරනවා
        return { success: true, message: 'Registration successful!' };
      } else {
        return { success: false, message: result.message || 'Registration failed.' };
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      return { success: false, message: 'Could not connect to server.' };
    }
  }

  // 3. Login වන කොටස
  async login(credentials: any): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      const cleanUrl = API_URL.endsWith('/') ? `${API_URL}api/login` : `${API_URL}/api/login`;

      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('rv_user', JSON.stringify(result.user));
        return { success: true, user: result.user, message: 'Login successful!' };
      } else {
        return { success: false, message: result.message || 'Invalid email or password.' };
      }
    } catch (error) {
      console.error("Login Error:", error);
      return { success: false, message: 'Server connection failed.' };
    }
  }

  // 4. දැනට ඉන්න User ව ලබාගැනීම
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem('rv_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // 5. Logout වීම
  async logout() {
    localStorage.removeItem('rv_user');
  }
}

// මෙතනදී එක පාරක් පමණක් Export කරනවා
export const authService = new AuthService();
