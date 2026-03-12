import type { Software, Category } from '@/types';

// .env එකේ තියෙන API URL එක ගන්නවා
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const cleanUrl = (endpoint: string) => {
  const baseUrl = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

class SoftwareService {
  async getAllSoftware(): Promise<Software[]> {
    try {
      const response = await fetch(cleanUrl('/api/software'));
      
      if (!response.ok) throw new Error('Failed to fetch from MySQL');
      const data = await response.json();
      
      return data.map((s: any) => ({
        ...s,
        id: s.id.toString(),
        // features parse කිරීම
        features: typeof s.features === 'string' ? JSON.parse(s.features) : s.features,
        // අලුතින් එකතු කළ productLinks parse කිරීම (මෙය ඉතා වැදගත්)
        productLinks: typeof s.productLinks === 'string' ? JSON.parse(s.productLinks) : s.productLinks,
        isFree: s.isFree === 1 || s.isFree === true,
        isActive: s.isActive === 1 || s.isActive === true,
      }));
    } catch (error) {
      console.error("Error fetching software:", error);
      return [];
    }
  }

  async getSoftwareById(id: string): Promise<Software | null> {
    try {
      const response = await fetch(cleanUrl(`/api/software/${id}`));
      
      if (!response.ok) return null;
      
      const s = await response.json();
      
      return {
        ...s,
        id: s.id.toString(),
        features: typeof s.features === 'string' ? JSON.parse(s.features) : s.features,
        // productLinks parse කිරීම
        productLinks: typeof s.productLinks === 'string' ? JSON.parse(s.productLinks) : s.productLinks,
        isFree: s.isFree === 1 || s.isFree === true,
        isActive: s.isActive === 1 || s.isActive === true,
        price: s.price || 0
      };
    } catch (error) {
      console.error("Error fetching software by ID:", error);
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    const software = await this.getAllSoftware();
    const uniqueCategories = Array.from(new Set(software.map(s => s.category)));
    return uniqueCategories.map(name => ({
      id: name.toLowerCase(),
      name: name,
      icon: 'Package'
    }));
  }
}

export const softwareService = new SoftwareService();
