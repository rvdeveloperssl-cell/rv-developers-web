import type { User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || "http://c4ckkocookws8kg4wc8ckow8.65.108.212.204.sslip.io";

class AuthService {
  async sendOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  try {
    console.log("--- [STEP 4] authService: Starting Fetch ---");
    
    // අපි දැන් කෙලින්ම Google Script එකට දත්ත යවමු (VPS එකේ Port issues මගහරින්න)
    const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxDBtNzkGL685gbIA6foL6FyD-JE7usPQ32mtw1_QuM4KZo_GkZvsXSvA3pQzc41psHXA/exec";
    
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ email, otp }),
    });

    const resultText = await response.text();
    console.log("Response from Script:", resultText);

    if (resultText.includes("Success")) {
      // වැදගත්: OTP_STORE වෙනුවට sessionStorage පාවිච්චි කරන්න
      sessionStorage.setItem('rv_temp_otp', otp); 
      
      return { success: true, message: 'OTP sent successfully!' };
    } else {
      return { success: false, message: 'Failed to send OTP. Please check your email.' };
    }
  } catch (error: any) {
    console.error("--- [CRITICAL] authService Fetch Error ---", error);
    return { success: false, message: 'Server connection error. Please try again.' };
  }
}

  // 2. Register වන කොටස
  async register(data: any, userOTP: string): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      // 1. OTP_STORE එක වෙනුවට අපි කලින් කරපු විදිහටම API එකට කෙලින්ම දත්ත යවමු.
      // මොකද අපි දැනටමත් AuthContext එකේදී OTP එක හරිද කියලා sessionStorage එකෙන් බලනවා.

      const cleanUrl = API_URL.endsWith('/') ? `${API_URL}api/register` : `${API_URL}/api/register`;
      
      console.log("Connecting to Backend for Registration:", cleanUrl);

      const response = await fetch(cleanUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // මෙතන data එකේ දැන් otp එකත් තියෙනවා (අපි කලින් Register.tsx එකේ හැදුවා වගේ)
      });

      const result = await response.json();

      if (result.success) {
        // වැඩේ සාර්ථක නම් user දත්ත local storage එකේ දාගන්නවා (Login වෙලා ඉන්න විදිහට පේන්න)
        if (result.user) {
          localStorage.setItem('rv_user', JSON.stringify(result.user));
        }
        return { success: true, message: 'Registration successful!', user: result.user };
      } else {
        return { success: false, message: result.message || 'Registration failed.' };
      }
    } catch (error: any) {
      console.error("Register Error:", error);
      // 'Could not connect to server' කියලා වැටෙන්නේ catch එකට ආවමයි
      return { success: false, message: 'Server error: ' + error.message };
    }
  }

  // 3. Login වන කොටස
  async login(credentials: { email: string; password: string }): Promise<{ success: boolean; user?: any; message: string }> {
  try {
    const cleanUrl = API_URL.endsWith('/') ? `${API_URL}api/login` : `${API_URL}/api/login`;

    // 1. මේ ලොග් එක Browser console එකේ පේනවා නේද බලන්න
    console.log("LOGGING DATA:", credentials.email, credentials.password);

    const response = await fetch(cleanUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });

    const result = await response.json();
    if (result.success) {
      localStorage.setItem('rv_user', JSON.stringify(result.user));
    }
    return result;
  } catch (error) {
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
