import { auth, rtdb } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import type { User } from '@/types';

const OTP_STORE: Record<string, { otp: string; expiresAt: number }> = {};
const SESSION_KEY = 'rv_session';

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  nic: string;
  address: string;
  companyName?: string;
  password: string;
}

class AuthService {
  // authService.ts ඇතුළත...

  async sendOTP(email: string): Promise<{ success: boolean; message: string; otp?: string }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

    try {
      // Google Script එකට data යවනවා
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Google Script වලට අත්‍යවශ්‍යයි
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      // no-cors නිසා response එක check කරන්න බැහැ, 
      // ඒ නිසා අපි සාර්ථකයි කියලා උපකල්පනය කරලා OTP එක store කරනවා.
      OTP_STORE[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
      
      // ලින්ක් එක URL එකේ පෙනුණාට කමක් නැති නිසා console එකේ දානවා (Testing වලට ලේසියි)
      console.log(`OTP for ${email}: ${otp}`); 
      
      return { success: true, message: 'OTP sent successfully!', otp };
    } catch (error) {
      console.error("OTP Error:", error);
      return { success: false, message: 'Failed to connect to security service.' };
    }
  }

  // --- Register Logic (Firebase) ---
  async register(data: RegisterData, userOTP: string): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      // 1. OTP Verify කිරීම
      const stored = OTP_STORE[data.email];
      if (!stored || stored.otp !== userOTP || Date.now() > stored.expiresAt) {
        return { success: false, message: 'Invalid or expired OTP code.' };
      }

      // 2. Firebase Auth එකේ User හැදීම
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // 3. අමතර දත්ත (Phone, NIC) Realtime Database එකේ Save කිරීම
      const userData = {
        uid: firebaseUser.uid,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        nic: data.nic,
        address: data.address,
        companyName: data.companyName || '',
        role: 'client',
        createdAt: new Date().toISOString()
      };

      await set(ref(rtdb, 'users/' + firebaseUser.uid), userData);
      
      delete OTP_STORE[data.email];
      return { success: true, user: userData, message: 'Registration successful!' };
    } catch (error: any) {
      let msg = "Registration failed.";
      if (error.code === 'auth/email-already-in-use') msg = "Email already in use.";
      return { success: false, message: msg };
    }
  }

  // --- Login Logic ---
  async login(data: any): Promise<{ success: boolean; user?: any; message: string }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const firebaseUser = userCredential.user;

      // Database එකෙන් User ගේ විස්තර ආපහු ගන්නවා
      const snapshot = await get(ref(rtdb, 'users/' + firebaseUser.uid));
      const userData = snapshot.val();

      return { success: true, user: userData, message: 'Login successful!' };
    } catch (error) {
      return { success: false, message: 'Invalid email or password.' };
    }
  }

  async logout() {
    await signOut(auth);
  }
  // දැනට ලොග් වෙලා ඉන්න User ගේ විස්තර ගන්න මේක ඕනේ
  getCurrentUser(): any {
    return auth.currentUser;
  }
}

export const authService = new AuthService();
