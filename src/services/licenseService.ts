import { rtdb } from '@/lib/firebase';
import { ref, set, push } from "firebase/database";

export const generateAndSaveLicense = async (userId: string, fullName: string) => {
  // 1. අකුරු සහ ඉලක්කම් කලවම් කරලා Key එකක් හදනවා
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  const finalKey = `RVQ-${part1}-${part2}`;

  try {
    // 2. Database එකේ 'licenses' යටතේ Save කරනවා
    // මෙතන userId එක key එක විදිහට පාවිච්චි කරන එක ලේසියි
    await set(ref(rtdb, 'licenses/' + userId), {
      ownerName: fullName,
      licenseKey: finalKey,
      status: 'active',
      management: 'enabled', // ඔයාගේ Control Panel එකේ වැඩ කරන්න මේක ඕනේ
      activatedDate: new Date().toISOString(),
      expiryDate: '2026-12-31',
      systemAccess: 'enabled'
    });

    return finalKey;
  } catch (error) {
    console.error("License saving error:", error);
    return null;
  }

};

// අන්න අර කලින් ආපු Error එක නිවෙන්න මෙන්න මේ පේළි ටික අන්තිමටම පේස්ට් කරන්න
export const licenseService = {
  generateAndSaveLicense: generateAndSaveLicense
};
