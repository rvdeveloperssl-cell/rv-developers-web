import type { Software, Category } from '@/types';

// .env එකේ තියෙන API URL එක ගන්නවා
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class SoftwareService {
  // 1. සියලුම Software MySQL වලින් ලබා ගැනීම
  async getAllSoftware(): Promise<Software[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/software`);
      if (!response.ok) throw new Error('Failed to fetch software');
      const data = await response.json();
      
      // Backend එකෙන් එන දත්ත වල 'features' string එකක් නම් ඒක array එකක් කරනවා
      return data.map((s: any) => ({
        ...s,
        features: typeof s.features === 'string' ? JSON.parse(s.features) : s.features,
        isFree: s.isFree === 1 || s.isFree === true,
        isActive: s.isActive === 1 || s.isActive === true,
      }));
    } catch (error) {
      console.error("Error fetching software:", error);
      return [];
    }
  }

  // 2. ID එක අනුව ලබා ගැනීම
  async getSoftwareById(id: string): Promise<Software | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/software/${id}`);
      if (!response.ok) return null;
      const s = await response.json();
      return {
        ...s,
        features: typeof s.features === 'string' ? JSON.parse(s.features) : s.features,
        isFree: s.isFree === 1 || s.isFree === true,
      };
    } catch (error) {
      return null;
    }
  }

  // 3. දැනට තියෙන software වලින් categories ටික වෙන් කරලා ගැනීම
  async getCategories(): Promise<Category[]> {
    const software = await this.getAllSoftware();
    const uniqueCategories = Array.from(new Set(software.map(s => s.category)));
    return uniqueCategories.map(name => ({
      id: name.toLowerCase(),
      name: name,
      icon: 'Package' // Default icon
    }));
  }
}

export const softwareService = new SoftwareService();
