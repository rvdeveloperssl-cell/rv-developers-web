import type { User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;
const OTP_STORE: Record<string, { otp: string; expiresAt: number }> = {};

class AuthService {
  
  async sendOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    // ඉතාම වැදගත්: මේ URL එක ඔබ Browser එකේ ගහලා වැඩ කරපු URL එකම බව සහතික කරගන්න.
    // මම මෙතනට දැම්මේ ඔබ අවසානයට එවූ වැඩ කරන URL එකයි.
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxDBtNzkGL685gbIA6foL6FyD-JE7usPQ32mtw1_QuM4KZo_GkZvsXSvA3pQzc41psHXA/exec";

    try {
      const finalUrl = `${SCRIPT_URL}?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
      
      console.log("--- OTP SENDING START ---");
      console.log("Email:", email);
      console.log("OTP:", otp);
      console.log("Target URL:", finalUrl);

      // Fetch එක await කරන්න. 'no-cors' නිසා response එක කියවන්න බැහැ, ඒත් request එක යනවා.
      const response = await fetch(finalUrl, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache',
        keepalive: true
      });

      console.log("Fetch call finished execution.");

      // Verification සඳහා OTP එක මතක තබා ගැනීම
      OTP_STORE[email] = { 
        otp, 
        expiresAt: Date.now() + 10 * 60 * 1000 
      };
      
      return { success: true, message: 'OTP request triggered.' };
    } catch (error) {
      console.error("Critical OTP Fetch Error:", error);
      return { success: false, message: 'Failed to send OTP. Network error.' };
    }
  }

  async register(data: any, userOTP: string): Promise<{ success: boolean; user?: any; message: string }> {
    try {
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
