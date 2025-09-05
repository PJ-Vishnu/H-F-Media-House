import { MongoClient, Db, WithId } from 'mongodb';
import type { HeroData } from '@/modules/hero/hero.schema';
import type { GalleryImage } from '@/modules/gallery/gallery.schema';
import type { AboutData } from '@/modules/about/about.schema';
import type { Service } from '@/modules/services/services.schema';
import type { PortfolioItem } from '@/modules/portfolio/portfolio.schema';
import type { Testimonial } from '@/modules/testimonials/testimonials.schema';
import type { ContactData } from '@/modules/contact/contact.schema';
import type { FooterData } from '@/modules/footer/footer.schema';
import type { AdminUser } from '@/modules/admin/admin.schema';
import type { SEOData } from '@/modules/seo/seo.schema';


// Ensure the MONGODB_URI is set in your environment variables
const uri = process.env.MONGODB_URI;

let client: MongoClient;
let dbInstance: Db;
let isConnected = false;

async function connectToDb(): Promise<Db | null> {
  if (!uri) {
    console.warn('MONGODB_URI not found, running in fallback mode.');
    return null;
  }
  if (dbInstance && isConnected) {
    return dbInstance;
  }
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    dbInstance = client.db("hf-media-house");
    isConnected = true;
    console.log("Successfully connected to MongoDB.");
    return dbInstance;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    isConnected = false;
    return null;
  }
}

// Helper to remove _id and set id
function mapDoc<T>(doc: WithId<any>): T {
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toHexString() } as T;
}

// Mock "DB" methods, now interacting with MongoDB
export const db = {
  // ADMIN
  getAdmin: async (): Promise<AdminUser> => {
    const db = await connectToDb();
    if (!db) return { email: 'admin@example.com', password_DO_NOT_STORE_IN_PLAIN_TEXT: 'password' };
    const admin = await db.collection<AdminUser>('admin').findOne({});
    return admin ?? { email: '', password_DO_NOT_STORE_IN_PLAIN_TEXT: '' };
  },

  // HERO
  getHero: async (): Promise<HeroData> => {
    const db = await connectToDb();
    if (!db) return {
      headline: 'Creating Stories',
      subheadline: 'We are a creative film and photo production house. Please connect to a database to see full content.',
      ctaText: 'Explore Now',
      ctaLink: '#portfolio',
      images: [
        { src: '/uploads/hero/placeholder-1.jpg', alt: 'Man with a camera' },
        { src: '/uploads/hero/placeholder-2.jpg', alt: 'Film set lighting' },
        { src: '/uploads/hero/placeholder-3.jpg', alt: 'Video editing suite' },
        { src: '/uploads/hero/placeholder-4.jpg', alt: 'Drone flying over a landscape' },
        { src: '/uploads/hero/placeholder-5.jpg', alt: 'Podcast recording microphone' },
        { src: '/uploads/hero/placeholder-6.jpg', alt: 'Photographer in action' },
      ],
    };
    const data = await db.collection<HeroData>('hero').findOne({});
    return data ?? { headline: '', subheadline: '', ctaText: '', ctaLink: '#', images: [] };
  },
  updateHero: async (data: HeroData) => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection<HeroData>('hero').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },
  
  // GALLERY
  getGallery: async (): Promise<GalleryImage[]> => {
    const db = await connectToDb();
    if (!db) return [
        { id: '1', src: '/uploads/gallery/placeholder-1.jpg', alt: 'Couple walking on a hill', order: 1 },
        { id: '2', src: '/uploads/gallery/placeholder-2.jpg', alt: 'Black and white wedding photo', order: 2 },
        { id: '3', src: '/uploads/gallery/placeholder-3.jpg', alt: 'Couple reflected in a window', order: 3 },
        { id: '4', src: '/uploads/gallery/placeholder-4.jpg', alt: 'Wedding rings', order: 4 },
    ];
    const images = await db.collection<GalleryImage>('gallery').find().sort({ order: 1 }).toArray();
    return images.map(mapDoc);
  },
  addGalleryImage: async (image: Omit<GalleryImage, 'id' | 'order'>): Promise<GalleryImage> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const count = await db.collection('gallery').countDocuments();
    const newImage = { ...image, order: count + 1 };
    const result = await db.collection('gallery').insertOne(newImage);
    return mapDoc({ ...newImage, _id: result.insertedId });
  },
  updateGalleryImage: async (id: string, data: Partial<GalleryImage>): Promise<GalleryImage | undefined> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    const { _id, ...updateData } = data as any; // Prevent _id from being in $set
    await db.collection('gallery').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('gallery').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },
  deleteGalleryImage: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    await db.collection('gallery').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
  reorderGallery: async (orderedIds: string[]): Promise<GalleryImage[]> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1 } },
      },
    }));
    if(bulkOps.length > 0) {
        await db.collection('gallery').bulkWrite(bulkOps);
    }
    return db.collection<GalleryImage>('gallery').find().sort({ order: 1 }).toArray().then(docs => docs.map(mapDoc));
  },

  // ABOUT
  getAbout: async (): Promise<AboutData> => {
    const db = await connectToDb();
    if (!db) return { 
        title: 'Our Story Behind the Lens', 
        content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 
        imageUrl: '/uploads/about/placeholder.jpg', 
        features: [
          { title: 'Creative & Emotional', description: 'We believe every moment has a story to tell. We turn your special moments into timeless memories.' },
          { title: 'Modern & Professional', description: 'We use the latest technology and techniques to produce high-quality content that exceeds expectations.' },
          { title: 'Passionate & Dedicated', description: 'Our team is passionate about storytelling and dedicated to delivering exceptional results for every client.' },
        ]
    };
    const data = await db.collection<AboutData>('about').findOne({});
    return data ?? { title: '', content: '', imageUrl: '', features: []};
  },
  updateAbout: async (data: AboutData): Promise<AboutData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('about').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },

  // SERVICES
  getServices: async (): Promise<Service[]> => {
    const db = await connectToDb();
    if (!db) return [
        { id: '1', title: 'Photography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Camera', image: '/uploads/services/placeholder-1.jpg' },
        { id: '2', title: 'Videography', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Video', image: '/uploads/services/placeholder-2.jpg' },
        { id: '3', title: 'Content Creation', description: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', icon: 'Wand', image: '/uploads/services/placeholder-3.jpg' },
    ];
    return db.collection<Service>('services').find().toArray().then(docs => docs.map(mapDoc));
  },
  addService: async (item: Omit<Service, 'id'>): Promise<Service> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const result = await db.collection('services').insertOne(item);
    return mapDoc({ ...item, _id: result.insertedId });
  },
  updateService: async (id: string, data: Partial<Service>): Promise<Service | undefined> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    const { _id, ...updateData } = data as any;
    await db.collection('services').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('services').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },
  deleteService: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    await db.collection('services').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
  
  // PORTFOLIO
  getPortfolio: async (): Promise<PortfolioItem[]> => {
    const db = await connectToDb();
    if (!db) return [
      { id: '1', title: 'Project Alpha', description: 'A documentary short on urban exploration.', imageUrl: '/uploads/portfolio/placeholder-1.jpg', category: 'Video', order: 1 },
      { id: '2', title: 'Project Beta', description: 'Brand photography for a new startup.', imageUrl: '/uploads/portfolio/placeholder-2.jpg', category: 'Photography', order: 2 },
      { id: '3', title: 'Project Gamma', description: 'Animated explainer video for a tech company.', imageUrl: '/uploads/portfolio/placeholder-3.jpg', category: 'Animation', order: 3 },
      { id: '4', title: 'Project Delta', description: 'Event coverage for a major music festival.', imageUrl: '/uploads/portfolio/placeholder-4.jpg', category: 'Video', order: 4 },
    ];
    const items = await db.collection<PortfolioItem>('portfolio').find().sort({ order: 1 }).toArray();
    return items.map(mapDoc);
  },
  addPortfolioItem: async (item: Omit<PortfolioItem, 'id' | 'order'>): Promise<PortfolioItem> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const count = await db.collection('portfolio').countDocuments();
    const newItem = { ...item, order: count + 1 };
    const result = await db.collection('portfolio').insertOne(newItem);
    return mapDoc({ ...newItem, _id: result.insertedId });
  },
  deletePortfolioItem: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    await db.collection('portfolio').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
  reorderPortfolio: async (orderedIds: string[]): Promise<PortfolioItem[]> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
     const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: new ObjectId(id) },
        update: { $set: { order: index + 1 } },
      },
    }));
    if(bulkOps.length > 0) {
        await db.collection('portfolio').bulkWrite(bulkOps);
    }
    return db.collection<PortfolioItem>('portfolio').find().sort({ order: 1 }).toArray().then(docs => docs.map(mapDoc));
  },
  updatePortfolioItem: async (id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem | undefined> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    const { _id, ...updateData } = data as any; // Prevent _id from being in $set
    await db.collection('portfolio').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('portfolio').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },

  // TESTIMONIALS
  getTestimonials: async (): Promise<Testimonial[]> => {
    const db = await connectToDb();
    if (!db) return [
      { id: '1', quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', author: 'Leo', company: 'Marketer', avatar: '/uploads/testimonials/avatar-1.png' },
      { id: '2', quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', author: 'Ana', company: 'Photographer', avatar: '/uploads/testimonials/avatar-2.png' },
      { id: '3', quote: 'It was a very good experience. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', author: 'John', company: 'Videographer', avatar: '/uploads/testimonials/avatar-3.png' },
    ];
    return db.collection<Testimonial>('testimonials').find().toArray().then(docs => docs.map(mapDoc));
  },
  addTestimonial: async (item: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const result = await db.collection('testimonials').insertOne(item);
    return mapDoc({ ...item, _id: result.insertedId });
  },
  updateTestimonial: async (id: string, data: Partial<Testimonial>): Promise<Testimonial | undefined> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    const { _id, ...updateData } = data as any;
    await db.collection('testimonials').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('testimonials').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },
  deleteTestimonial: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    const { ObjectId } = await import('mongodb');
    await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },

  // CONTACT
  getContact: async (): Promise<ContactData> => {
    const db = await connectToDb();
    if (!db) return { 
        email: 'hello@hfmedia.house', 
        phone: '+1 (234) 567-890', 
        address: '123 Media Lane, Creative City, 10001', 
        socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }
    };
    const data = await db.collection<ContactData>('contact').findOne({});
    return data ?? { email: '', phone: '', address: '', socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#' }};
  },
  updateContact: async (data: ContactData): Promise<ContactData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('contact').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },

  // FOOTER
  getFooter: async (): Promise<FooterData> => {
    const db = await connectToDb();
    if (!db) return { 
        copyright: `Copyright @${new Date().getFullYear()} H&F Media. All rights reserved.`, 
        links: [
            { title: 'Home', url: '/' },
            { title: 'About', url: '#about' },
            { title: 'Services', url: '#services' },
            { title: 'Contact', url: '#contact' },
        ] 
    };
    const data = await db.collection<FooterData>('footer').findOne({});
    return data ?? { copyright: '', links: [] };
  },
  updateFooter: async (data: FooterData): Promise<FooterData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('footer').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },

  // SEO
  getSEO: async (): Promise<SEOData> => {
    const db = await connectToDb();
    if (!db) return { 
        title: 'H&F Media House | Fallback Title', 
        description: 'This is fallback description for when the database is not connected.',
        keywords: 'media, photography, video',
        url: 'https://example.com',
        ogImage: '/uploads/seo/og-image.jpg'
    };
    const data = await db.collection<SEOData>('seo').findOne({});
    return data ?? { title: '', description: '', keywords: '', url: '', ogImage: '' };
  },
  updateSEO: async (data: SEOData): Promise<SEOData> => {
    const db = await connectToDb();
    if (!db) throw new Error("Database not connected");
    await db.collection('seo').updateOne({}, { $set: data }, { upsert: true });
    return data;
  },
};
