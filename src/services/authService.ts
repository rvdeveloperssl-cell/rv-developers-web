import type { User } from '@/types';

// .env.local එකේ තියෙන URL එක මෙතනට ගන්නවා
const API_URL = import.meta.env.VITE_API_URL;

// OTP තාවකාලිකව තියාගන්න (Browser memory එකේ)
const OTP_STORE: Record<string, { otp: string; expiresAt: number }> = {};

class AuthService {
  
  // --- OTP යවන කොටස (Google Script එක හරහා) ---
  async sendOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    try {
      // Google Script එකට data යවනවා
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }), 
      });

      // පස්සේ චෙක් කරගන්න OTP එක memory එකේ සේව් කරගන්නවා
      OTP_STORE[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
      return { success: true, message: 'OTP sent successfully!' };
    } catch (error) {
      console.error("OTP Error:", error);
      return { success: false, message: 'Failed to send OTP.' };
    }
  }

  // --- Register Logic (MySQL Backend එකට) ---
  async register(data: any, userOTP: string): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      // 1. මුලින්ම OTP එක නිවැරදිද බලනවා
      const stored = OTP_STORE[data.email];
      if (!stored || stored.otp !== userOTP || Date.now() > stored.expiresAt) {
        return { success: false, message: 'Invalid or expired OTP code.' };
      }

      // 2. අපේ Node.js Backend එකට Data යවනවා
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        delete OTP_STORE[data.email]; // වැඩේ ඉවර නිසා OTP එක මකනවා
        return { success: true, message: 'Registration successful!' };
      } else {
        return { success: false, message: result.message || 'Registration failed.' };
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      return { success: false, message: 'Could not connect to server.' };
    }
  }

  // --- Login Logic (MySQL Backend එකට) ---
  async login(data: any): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // User දත්ත LocalStorage එකේ සේව් කරනවා (Refresh කරත් ලොග් වෙලා ඉන්න)
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

  // දැනට ලොග් වෙලා ඉන්න User ගේ විස්තර ගන්න
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('rv_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  // Logout Logic
  async logout() {
    localStorage.removeItem('rv_user');
  }
}

export const authService = new AuthService();
