const API_URL = "http://c4ckkocookws8kg4wc8ckow8.65.108.212.204.sslip.io";

/**
 * අද දින සිට වසරක් ඉදිරියට expiry date එක ගණනය කරන function එක
 */
const calculateExpiryDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
};

export const licenseService = {
  // 1. අලුතින් License එකක් හදන පරණ function එක (වෙනස් කර නැත)
  generateAndSaveLicense: async (userId: string, fullName: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const part1 = Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array(5).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const finalKey = `RVQ-${part1}-${part2}`;
    const expiryDate = calculateExpiryDate();

    try {
      const response = await fetch(`${API_URL}/api/licenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      if (result.success) return finalKey;
      return null;
    } catch (error) {
      console.error("MySQL License saving error:", error);
      return null;
    }
  },

  // 2. Admin සඳහා සියලුම Licenses ලබා ගැනීම
  getAllLicenses: async () => {
    const response = await fetch(`${API_URL}/api/admin/licenses/all`);
    if (!response.ok) throw new Error('Failed to fetch licenses');
    return response.json();
  },

  // 3. Admin සඳහා Expiry Date එක Update කිරීම (Update Expiry Button එකට)
  updateExpiry: async (id: string, expiresAt: string) => {
    const response = await fetch(`${API_URL}/api/admin/licenses/${id}/expiry`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ expiresAt }),
    });
    return response.json();
  },

  // 4. License එකක් Block කිරීම
  blockLicense: async (id: string) => {
    const response = await fetch(`${API_URL}/api/admin/licenses/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'blocked' }),
    });
    return response.json();
  },

  // 5. License එකක් Unblock කිරීම
  unblockLicense: async (id: string) => {
    const response = await fetch(`${API_URL}/api/admin/licenses/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'active' }),
    });
    return response.json();
  }
};

