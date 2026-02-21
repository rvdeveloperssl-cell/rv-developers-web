import type { Purchase, Invoice } from '@/types';
import { mockPurchases, mockInvoices, mockSoftware } from '@/data/mockData';
import { licenseService } from './licenseService';

class MockPaymentService {
  private generateInvoiceNumber(): string {
    const prefix = 'INV';
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}-${year}-${random}`;
  }

  async processCardPayment(
    userId: string,
    softwareId: string,
    cardData: { number: string; expiry: string; cvv: string }
  ): Promise<{ success: boolean; purchase?: Purchase; message: string }> {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const software = mockSoftware.find(s => s.id === softwareId);
        if (!software) {
          resolve({ success: false, message: 'Software not found' });
          return;
        }

        // Simulate card validation
        if (cardData.number.length < 16) {
          resolve({ success: false, message: 'Invalid card number' });
          return;
        }

        // Generate license for paid software
        const license = await licenseService.generateLicense(softwareId, userId);

        const purchase: Purchase = {
          id: Math.random().toString(36).substring(2, 15),
          userId,
          softwareId,
          licenseId: license.id,
          amount: software.price,
          paymentMethod: 'card',
          paymentStatus: 'verified',
          createdAt: new Date().toISOString(),
          verifiedAt: new Date().toISOString()
        };
        mockPurchases.push(purchase);

        // Generate invoice
        const invoice: Invoice = {
          id: Math.random().toString(36).substring(2, 15),
          invoiceNumber: this.generateInvoiceNumber(),
          userId,
          purchaseId: purchase.id,
          softwareId,
          amount: software.price,
          paymentMethod: 'card',
          licenseKey: license.licenseKey,
          createdAt: new Date().toISOString()
        };
        mockInvoices.push(invoice);
        purchase.invoiceId = invoice.id;

        resolve({ success: true, purchase, message: 'Payment successful' });
      }, 2000);
    });
  }

  async submitBankTransfer(
    userId: string,
    softwareId: string,
    slipFile: File
  ): Promise<{ success: boolean; purchase?: Purchase; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const software = mockSoftware.find(s => s.id === softwareId);
        if (!software) {
          resolve({ success: false, message: 'Software not found' });
          return;
        }

        const purchase: Purchase = {
          id: Math.random().toString(36).substring(2, 15),
          userId,
          softwareId,
          amount: software.price,
          paymentMethod: 'bank_transfer',
          paymentStatus: 'pending',
          slipUrl: `/uploads/${slipFile.name}`,
          createdAt: new Date().toISOString()
        };
        mockPurchases.push(purchase);

        resolve({ 
          success: true, 
          purchase, 
          message: 'Bank slip submitted. Awaiting verification.' 
        });
      }, 1500);
    });
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const purchases = mockPurchases.filter(p => p.userId === userId);
        resolve(purchases.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, 400);
    });
  }

  async getUserInvoices(userId: string): Promise<Invoice[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invoices = mockInvoices.filter(i => i.userId === userId);
        resolve(invoices.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }, 400);
    });
  }

  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invoice = mockInvoices.find(i => i.id === invoiceId);
        resolve(invoice || null);
      }, 300);
    });
  }

  // Admin methods
  async getPendingPayments(): Promise<Purchase[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pending = mockPurchases.filter(p => p.paymentStatus === 'pending');
        resolve(pending);
      }, 400);
    });
  }

  async verifyPayment(purchaseId: string, adminId: string): Promise<{ success: boolean; message: string }> {
    return new Promise(async (resolve) => {
      setTimeout(async () => {
        const purchase = mockPurchases.find(p => p.id === purchaseId);
        if (!purchase) {
          resolve({ success: false, message: 'Purchase not found' });
          return;
        }

        purchase.paymentStatus = 'verified';
        purchase.verifiedAt = new Date().toISOString();
        purchase.verifiedBy = adminId;

        // Generate license after verification
        const license = await licenseService.generateLicense(purchase.softwareId, purchase.userId);
        purchase.licenseId = license.id;

        // Generate invoice
        const invoice: Invoice = {
          id: Math.random().toString(36).substring(2, 15),
          invoiceNumber: this.generateInvoiceNumber(),
          userId: purchase.userId,
          purchaseId: purchase.id,
          softwareId: purchase.softwareId,
          amount: purchase.amount,
          paymentMethod: 'bank_transfer',
          licenseKey: license.licenseKey,
          createdAt: new Date().toISOString()
        };
        mockInvoices.push(invoice);
        purchase.invoiceId = invoice.id;

        resolve({ success: true, message: 'Payment verified successfully' });
      }, 600);
    });
  }

  async rejectPayment(purchaseId: string, adminId: string, reason: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const purchase = mockPurchases.find(p => p.id === purchaseId);
        if (!purchase) {
          resolve({ success: false, message: 'Purchase not found' });
          return;
        }

        purchase.paymentStatus = 'rejected';
        purchase.verifiedAt = new Date().toISOString();
        purchase.verifiedBy = adminId;

        resolve({ success: true, message: `Payment rejected: ${reason}` });
      }, 600);
    });
  }

  async getAllPurchases(): Promise<Purchase[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockPurchases]);
      }, 400);
    });
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockInvoices]);
      }, 400);
    });
  }

  async generateRevenueReport(startDate: string, endDate: string): Promise<{
    totalRevenue: number;
    totalTransactions: number;
    byPaymentMethod: Record<string, number>;
    bySoftware: Record<string, number>;
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();
        
        const filtered = mockPurchases.filter(p => {
          const created = new Date(p.createdAt).getTime();
          return created >= start && created <= end && p.paymentStatus === 'verified';
        });

        const totalRevenue = filtered.reduce((sum, p) => sum + p.amount, 0);
        
        const byPaymentMethod: Record<string, number> = {};
        const bySoftware: Record<string, number> = {};

        filtered.forEach(p => {
          byPaymentMethod[p.paymentMethod] = (byPaymentMethod[p.paymentMethod] || 0) + p.amount;
          const software = mockSoftware.find(s => s.id === p.softwareId);
          const softwareName = software?.name || 'Unknown';
          bySoftware[softwareName] = (bySoftware[softwareName] || 0) + p.amount;
        });

        resolve({
          totalRevenue,
          totalTransactions: filtered.length,
          byPaymentMethod,
          bySoftware
        });
      }, 600);
    });
  }
}

export const paymentService = new MockPaymentService();
