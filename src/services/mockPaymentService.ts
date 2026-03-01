import type { Purchase, Invoice } from '@/types';

// Backend එකේ URL එක .env එකෙන් ගන්නවා. නැත්නම් localhost:8080 පාවිච්චි කරනවා.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class MockPaymentService {
  // URL එක පිරිසිදුව සකස් කරගන්නා Helper එකක්
  private cleanUrl(endpoint: string) {
    const baseUrl = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  // 1. Card Payment - Logic එක වෙනස් නොකර API එකට දත්ත යවනවා
  async processCardPayment(
    userId: string,
    softwareId: string,
    cardData: { number: string; expiry: string; cvv: string; name: string }
  ): Promise<{ success: boolean; purchase?: Purchase; message: string }> {
    try {
      const response = await fetch(this.cleanUrl('/api/payments/card'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, softwareId, ...cardData }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Card payment failed to connect to server' };
    }
  }

  // 2. Bank Transfer - Slip එක Upload කරන අතරතුර Database එකට දත්ත යවනවා
  async submitBankTransfer(
    userId: string,
    softwareId: string,
    slipFile: File
  ): Promise<{ success: boolean; purchase?: Purchase; message: string }> {
    // Image එකක් නිසා FormData පාවිච්චි කළ යුතුමයි
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('softwareId', softwareId);
    formData.append('slip', slipFile);

    try {
      const response = await fetch(this.cleanUrl('/api/payments/bank-transfer'), {
        method: 'POST',
        body: formData, // JSON නෙවෙයි, FormData යවන්නේ
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Failed to upload bank slip to server' };
    }
  }

  // 3. User හට අදාළ Purchases Database එකෙන් ලබා ගැනීම
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    try {
      const response = await fetch(this.cleanUrl(`/api/purchases/user/${userId}`));
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  // 4. User හට අදාළ Invoices Database එකෙන් ලබා ගැනීම
  async getUserInvoices(userId: string): Promise<Invoice[]> {
    try {
      const response = await fetch(this.cleanUrl(`/api/invoices/user/${userId}`));
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  // 5. Invoice එකක් ID එකෙන් සෙවීම
  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    try {
      const response = await fetch(this.cleanUrl(`/api/invoices/${invoiceId}`));
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  // --- ADMIN METHODS (MySQL Database එකේ Status Update කිරීමට) ---

  // Admin ට පෙන්වීමට Pending Payments ලබා ගැනීම
  async getPendingPayments(): Promise<Purchase[]> {
    try {
      const response = await fetch(this.cleanUrl('/api/admin/payments/pending'));
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  // Payment එක Verify කර Invoice සහ License Generate කිරීම (Backend එකේ සිදුවේ)
  async verifyPayment(purchaseId: string, adminId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(this.cleanUrl('/api/admin/verify-payment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId, adminId }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Verification process failed' };
    }
  }

  // Payment එක Reject කිරීම
  async rejectPayment(purchaseId: string, adminId: string, reason: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(this.cleanUrl('/api/admin/reject-payment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseId, adminId, reason }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Rejection process failed' };
    }
  }

  // සේරම Purchases ලබා ගැනීම
  async getAllPurchases(): Promise<Purchase[]> {
    try {
      const response = await fetch(this.cleanUrl('/api/admin/purchases/all'));
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  // සේරම Invoices ලබා ගැනීම
  async getAllInvoices(): Promise<Invoice[]> {
    try {
      const response = await fetch(this.cleanUrl('/api/admin/invoices/all'));
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  // Revenue Report එක Database දත්ත ඇසුරෙන් සකස් කිරීම
  async generateRevenueReport(startDate: string, endDate: string): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    byPaymentMethod: Record<string, number>;
    bySoftware: Record<string, number>;
  }> {
    try {
      const response = await fetch(this.cleanUrl('/api/admin/reports/revenue'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      });
      return await response.json();
    } catch (error) {
      return { totalRevenue: 0, totalTransactions: 0, byPaymentMethod: {}, bySoftware: {} };
    }
  }
}

// RV Developers Brand එකට ගැලපෙන පරිදි Export කිරීම
export const paymentService = new MockPaymentService();
