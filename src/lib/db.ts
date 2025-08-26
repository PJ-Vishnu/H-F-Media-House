import type { HeroData, GalleryImage, AboutData, Service, PortfolioItem, Testimonial, ContactData, FooterData, AdminUser } from '@/lib/definitions';
import fs from 'node:fs/promises';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'src', 'lib', 'db');

async function readJsonFile<T>(filename: string): Promise<T> {
  const filePath = path.join(DB_PATH, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading or parsing ${filename}:`, error);
    // Depending on the use case, you might want to return a default value or re-throw
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`Database file ${filename} not found. Did you run the seeder script?`);
      // Return empty array or object for GET requests to avoid crashing the app if DB is not seeded.
      if(filename.endsWith('s.json')) return [] as T;
      return {} as T;
    }
    throw error;
  }
}

async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  await fs.writeFile(path.join(DB_PATH, filename), JSON.stringify(data, null, 2), 'utf-8');
}


// Mock "DB" methods
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const db = {
  // ADMIN
  getAdmin: async () => { await delay(50); return await readJsonFile<AdminUser>('admin.json'); },

  // HERO
  getHero: async () => { await delay(50); return await readJsonFile<HeroData>('hero.json'); },
  updateHero: async (data: HeroData) => { await delay(100); await writeJsonFile('hero.json', data); return data; },
  
  // GALLERY
  getGallery: async () => { 
    await delay(50); 
    const images = await readJsonFile<GalleryImage[]>('gallery.json');
    return images.sort((a, b) => a.order - b.order); 
  },
  addGalleryImage: async (image: Omit<GalleryImage, 'id' | 'order'>) => {
    await delay(100);
    let galleryImages = await readJsonFile<GalleryImage[]>('gallery.json');
    const newImage: GalleryImage = {
      ...image,
      id: Date.now().toString(),
      order: galleryImages.length + 1,
    };
    galleryImages.push(newImage);
    await writeJsonFile('gallery.json', galleryImages);
    return newImage;
  },
  updateGalleryImage: async (id: string, data: Partial<GalleryImage>) => {
    await delay(100);
    let galleryImages = await readJsonFile<GalleryImage[]>('gallery.json');
    galleryImages = galleryImages.map(img => img.id === id ? { ...img, ...data } : img);
    await writeJsonFile('gallery.json', galleryImages);
    return galleryImages.find(img => img.id === id);
  },
  deleteGalleryImage: async (id: string) => {
    await delay(100);
    let galleryImages = await readJsonFile<GalleryImage[]>('gallery.json');
    galleryImages = galleryImages.filter(img => img.id !== id);
    await writeJsonFile('gallery.json', galleryImages);
    return { success: true };
  },
  reorderGallery: async (orderedIds: string[]) => {
    await delay(100);
    let galleryImages = await readJsonFile<GalleryImage[]>('gallery.json');
    const newOrderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
    galleryImages.forEach(img => {
      img.order = newOrderMap.get(img.id) ?? img.order;
    });
    await writeJsonFile('gallery.json', galleryImages.sort((a,b) => a.order - b.order));
    return galleryImages;
  },

  // ABOUT
  getAbout: async () => { await delay(50); return await readJsonFile<AboutData>('about.json'); },
  updateAbout: async (data: AboutData) => { await delay(100); await writeJsonFile('about.json', data); return data; },

  // SERVICES
  getServices: async () => { await delay(50); return await readJsonFile<Service[]>('services.json'); },
  
  // PORTFOLIO
  getPortfolio: async () => { 
    await delay(50); 
    const items = await readJsonFile<PortfolioItem[]>('portfolio.json');
    return items.sort((a, b) => a.order - b.order); 
  },
  addPortfolioItem: async (item: Omit<PortfolioItem, 'id' | 'order'>) => {
    await delay(100);
    let portfolioItems = await readJsonFile<PortfolioItem[]>('portfolio.json');
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString(),
      order: portfolioItems.length + 1,
    };
    portfolioItems.push(newItem);
    await writeJsonFile('portfolio.json', portfolioItems);
    return newItem;
  },
  deletePortfolioItem: async (id: string) => {
    await delay(100);
    let portfolioItems = await readJsonFile<PortfolioItem[]>('portfolio.json');
    portfolioItems = portfolioItems.filter(item => item.id !== id);
    await writeJsonFile('portfolio.json', portfolioItems);
    return { success: true };
  },
  reorderPortfolio: async (orderedIds: string[]) => {
    await delay(100);
    let portfolioItems = await readJsonFile<PortfolioItem[]>('portfolio.json');
    const newOrderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
    portfolioItems.forEach(item => {
      item.order = newOrderMap.get(item.id) ?? item.order;
    });
    await writeJsonFile('portfolio.json', portfolioItems.sort((a,b) => a.order - b.order));
    return portfolioItems;
  },
  updatePortfolioItem: async (id: string, data: Partial<PortfolioItem>) => {
    await delay(100);
    let portfolioItems = await readJsonFile<PortfolioItem[]>('portfolio.json');
    portfolioItems = portfolioItems.map(item => item.id === id ? { ...item, ...data } : item);
    await writeJsonFile('portfolio.json', portfolioItems);
    return portfolioItems.find(item => item.id === id);
  },

  // TESTIMONIALS
  getTestimonials: async () => { await delay(50); return await readJsonFile<Testimonial[]>('testimonials.json'); },

  // CONTACT
  getContact: async () => { await delay(50); return await readJsonFile<ContactData>('contact.json'); },
  updateContact: async (data: ContactData) => { await delay(100); await writeJsonFile('contact.json', data); return data; },

  // FOOTER
  getFooter: async () => { await delay(50); return await readJsonFile<FooterData>('footer.json'); },
  updateFooter: async (data: FooterData) => { await delay(100); await writeJsonFile('footer.json', data); return data; },
};
