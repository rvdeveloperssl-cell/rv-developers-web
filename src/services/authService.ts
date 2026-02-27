import type { User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || "http://pscgk48cgko8ok4kskswcog8.65.108.212.204.sslip.io";

class AuthService {
  async sendOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("--- [STEP 4] authService: Starting Fetch ---");
    
    // 1. අපි කෙලින්ම VPS Backend URL එක මෙතනට දාමු (Variables වල ලෙඩ මගහරින්න)
    const backendUrl = "http://pscgk48cgko8ok4kskswcog8.65.108.212.204.sslip.io/api/send-otp";
    
    console.log("Request URL:", backendUrl);
    console.log("Payload:", { email, otp });

    // 2. Fetch Request එක යවනවා
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    console.log("Fetch Status:", response.status);

    // 3. Response එක කියවනවා
    const data = await response.json();
    console.log("Backend Response Data:", data);

    if (response.ok && data.success) {
      // Frontend එකේ Verification එක සඳහා OTP එක තාවකාලිකව මතක තබා ගමු
      OTP_STORE[email] = { 
        otp, 
        expiresAt: Date.now() + 10 * 60 * 1000 
      };
      console.log("OTP_STORE updated successfully");
      return { success: true, message: 'OTP sent to your email.' };
    } else {
      console.warn("Backend returned failure:", data.message);
      return { success: false, message: data.message || 'Failed to send OTP.' };
    }

  } catch (error) {
    // Network එකේ මොකක් හරි ලොකු අවුලක් නම් මෙතනින් පේනවා
    console.error("--- [CRITICAL] authService Fetch Error ---", error);
    return { success: false, message: 'Server connection error. Please try again.' };
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
