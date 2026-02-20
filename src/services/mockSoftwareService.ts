import type { Software, Category } from '@/types';
import { mockSoftware, mockCategories } from '@/data/mockData';

class MockSoftwareService {
  async getAllSoftware(): Promise<Software[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSoftware.filter(s => s.isActive));
      }, 500);
    });
  }

  async getSoftwareById(id: string): Promise<Software | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const software = mockSoftware.find(s => s.id === id && s.isActive);
        resolve(software || null);
      }, 400);
    });
  }

  async getSoftwareByCategory(category: string): Promise<Software[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const software = mockSoftware.filter(s => s.category === category && s.isActive);
        resolve(software);
      }, 400);
    });
  }

  async getFreeSoftware(): Promise<Software[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const software = mockSoftware.filter(s => s.isFree && s.isActive);
        resolve(software);
      }, 400);
    });
  }

  async getPaidSoftware(): Promise<Software[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const software = mockSoftware.filter(s => !s.isFree && s.isActive);
        resolve(software);
      }, 400);
    });
  }

  async getCategories(): Promise<Category[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 300);
    });
  }

  async searchSoftware(query: string): Promise<Software[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerQuery = query.toLowerCase();
        const results = mockSoftware.filter(s => 
          s.isActive && (
            s.name.toLowerCase().includes(lowerQuery) ||
            s.description.toLowerCase().includes(lowerQuery) ||
            s.category.toLowerCase().includes(lowerQuery)
          )
        );
        resolve(results);
      }, 500);
    });
  }

  // Admin methods
  async createSoftware(data: Partial<Software>): Promise<Software> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSoftware: Software = {
          id: Math.random().toString(36).substring(2, 15),
          name: data.name || '',
          description: data.description || '',
          features: data.features || [],
          price: data.price || 0,
          version: data.version || '1.0.0',
          imageUrl: data.imageUrl || '',
          category: data.category || '',
          demoVideoUrl: data.demoVideoUrl,
          systemRequirements: data.systemRequirements || '',
          isFree: data.isFree || false,
          downloadUrl: data.downloadUrl,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true,
          downloadCount: 0
        };
        mockSoftware.push(newSoftware);
        resolve(newSoftware);
      }, 800);
    });
  }

  async updateSoftware(id: string, data: Partial<Software>): Promise<Software | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockSoftware.findIndex(s => s.id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        mockSoftware[index] = {
          ...mockSoftware[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        resolve(mockSoftware[index]);
      }, 600);
    });
  }

  async deleteSoftware(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockSoftware.findIndex(s => s.id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        mockSoftware[index].isActive = false;
        resolve(true);
      }, 500);
    });
  }
}

export const softwareService = new MockSoftwareService();
