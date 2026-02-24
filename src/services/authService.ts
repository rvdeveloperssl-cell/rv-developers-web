import type { User } from '@/types';

// API URL එක අන්තිමට '/' නැතිව එන බව සහතික කරගන්න
const API_URL = import.meta.env.VITE_API_URL;

// OTP තාවකාලිකව තියාගන්න
const OTP_STORE: Record<string, { otp: string; expiresAt: number }> = {};

class AuthService {
  
  // --- OTP යවන කොටස (Google Script එක හරහා) ---
 async sendOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  // 1. .env එකේ තියෙන URL එක ගන්න (Hardcode කරනවට වඩා ඒක හොඳයි)
  const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

  try {
    // 2. URL එකට parameters එකතු කරන්න (GET request එකක් විදියට)
    const finalUrl = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;

    // 3. අනිවාර්යයෙන් 'await' දාන්න. එතකොටයි request එක යනකම් browser එක ඉන්නේ.
    await fetch(finalUrl, {
      method: 'GET',
      mode: 'no-cors', // Google Script වලට මේක ඕනේ
      cache: 'no-cache'
    });

    // Verification එකට local storage එකේ තියාගන්නවා
    OTP_STORE[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
    
    console.log("OTP Sent Request Triggered");
    return { success: true, message: 'OTP sent successfully!' };
  } catch (error) {
    console.error("OTP Error:", error);
    return { success: false, message: 'Failed to send OTP.' };
  }
}

  // --- Register Logic (MySQL Backend එකට) ---
  async register(data: any, userOTP: string): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      // 1. OTP එක නිවැරදිද බලනවා
      const stored = OTP_STORE[data.email];
      
      if (!stored || stored.otp !== userOTP) {
        return { success: false, message: 'Invalid OTP code.' };
      }
      
      if (Date.now() > stored.expiresAt) {
        return { success: false, message: 'OTP has expired.' };
      }

      // 2. Node.js Backend එකට Data යවනවා
      // API_URL එකේ අන්තිමට / තියෙනවද නැද්ද බලලා හරියට සෙට් කරනවා
      const cleanUrl = API_URL.endsWith('/') ? `${API_URL}api/register` : `${API_URL}/api/register`;

      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        delete OTP_STORE[data.email];
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
      const cleanUrl = API_URL.endsWith('/') ? `${API_URL}api/login` : `${API_URL}/api/login`;

      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
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

  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userJson = localStorage.getItem('rv_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  async logout() {
    localStorage.removeItem('rv_user');
  }
}

export const authService = new AuthService();
