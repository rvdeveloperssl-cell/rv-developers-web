// src/services/licenseService.ts

// ඔයාගේ Backend එකේ URL එක
const API_URL = "http://c4ckkocookws8kg4wc8ckow8.65.108.212.204.sslip.io";

/**
 * අද දින සිට වසරක් ඉදිරියට expiry date එක ගණනය කරන function එක
 */
const calculateExpiryDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1); // වසර 1ක් එකතු කරයි
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format එකට ලබා දෙයි
};

export const generateAndSaveLicense = async (userId: string, fullName: string) => {
  // 1. අහඹු අකුරු සහ ඉලක්කම් භාවිතයෙන් License Key එකක් සාදා ගැනීම
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
  const finalKey = `RVQ-${part1}-${part2}`;

  // 2. අද සිට වසරක් ඉදිරියට දින වකවානුව ලබා ගැනීම
  const expiryDate = calculateExpiryDate();

  try {
    // 3. MySQL Backend (API) එකට දත්ත යැවීම
    const response = await fetch(`${API_URL}/api/licenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        ownerName: fullName,
        licenseKey: finalKey,
        status: 'active',
        expiryDate: expiryDate,
        activatedDate: new Date().toISOString()
      }),
    });

    const result = await response.json();

    if (result.success) {
      console.log("License saved successfully to MySQL!");
      return finalKey;
    } else {
      console.error("Failed to save license:", result.message);
      return null;
    }
  } catch (error) {
    console.error("MySQL License saving error:", error);
    return null;
  }
};

// අනිත් ෆයිල් වල පාවිච්චි කරන්න ලේසි වෙන්න මෙහෙම Export කරනවා
export const licenseService = {
  generateAndSaveLicense
};
