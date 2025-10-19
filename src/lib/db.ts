
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
import type { VideoData } from '@/modules/video/video.schema';
import type { Inquiry } from '@/modules/inquiries/inquiries.schema';
import path from 'path';

export const UPLOADS_DIR = path.join(process.cwd(), 'public/uploads');

// Ensure the MONGODB_URI is set in your environment variables
const uri = process.env.MONGODB_URI;

let client: MongoClient;
let dbInstance: Db;
let isConnected = false;

async function connectToDb(): Promise<Db> {
  if (!uri) {
    console.error('FATAL: MONGODB_URI is not defined. Application cannot connect to the database.');
    throw new Error('Database configuration is missing.');
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
    throw new Error("Could not connect to the database.");
  }
}

// Helper to remove _id and set id
function mapDoc<T>(doc: WithId<any>): T {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return { ...rest, id: _id.toHexString() } as T;
}

function mapDocs<T>(docs: WithId<any>[]): T[] {
    return docs.map(mapDoc);
}


async function fetchSingle<T>(collectionName: string, fallback: T): Promise<T> {
  try {
    const db = await connectToDb();
    const data = await db.collection<T>(collectionName).findOne({});
    // The initial data might not have an _id, so we don't map it.
    // We only map when we're sure there's a document from the DB.
    if (!data) return fallback;
    return mapDoc(data);
  } catch (error) {
    console.warn(`Could not fetch from ${collectionName}, returning fallback data. Error:`, (error as Error).message);
    return fallback;
  }
}

async function fetchMultiple<T>(collectionName: string, fallback: T[], sort: any = {}): Promise<T[]> {
  try {
    const db = await connectToDb();
    const data = await db.collection<any>(collectionName).find().sort(sort).toArray();
    return mapDocs(data);
  } catch (error) {
    console.warn(`Could not fetch from ${collectionName}, returning fallback data. Error:`, (error as Error).message);
    return fallback;
  }
}


// Mock "DB" methods, now interacting with MongoDB
export const db = {
  // ADMIN
  getAdmin: async (): Promise<AdminUser | null> => {
    const db = await connectToDb();
    return db.collection<AdminUser>('admin').findOne({});
  },
  updateAdminPassword: async (passwordHash: string) => {
    const db = await connectToDb();
    await db.collection('admin').updateOne({}, { $set: { passwordHash } });
    return { success: true };
  },


  // HERO
  getHero: async (): Promise<HeroData> => {
    const data = await fetchSingle<HeroData>('hero', {
        headline: 'Creating Stories',
        subheadline: 'We are a creative film and photo production house. Please connect to a database to see full content.',
        ctaText: 'Explore Now',
        ctaLink: '#portfolio',
        images: [],
    });

    if (data && typeof data.images === 'object' && !Array.isArray(data.images)) {
        data.images = Object.values(data.images);
    }
    return data;
  },
  updateHero: async (data: HeroData) => {
    const db = await connectToDb();
    const { id, ...updateData } = data as any;
    await db.collection('hero').updateOne({}, { $set: updateData }, { upsert: true });
    const updatedDoc = await db.collection('hero').findOne({});
    return mapDoc(updatedDoc);
  },
  
  // GALLERY
  getGallery: async (): Promise<GalleryImage[]> => {
    return fetchMultiple<GalleryImage>('gallery', [], { order: 1 });
  },
  getGalleryImageById: async (id: string): Promise<WithId<GalleryImage> | null> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    return db.collection<GalleryImage>('gallery').findOne({ _id: new ObjectId(id) });
  },
  addGalleryImage: async (image: Omit<GalleryImage, 'id' | 'order'>): Promise<GalleryImage> => {
    const db = await connectToDb();
    const count = await db.collection('gallery').countDocuments();
    const newImage = { ...image, order: count + 1 };
    const result = await db.collection('gallery').insertOne(newImage);
    return mapDoc({ ...newImage, _id: result.insertedId });
  },
  updateGalleryImage: async (id: string, data: Partial<GalleryImage>): Promise<GalleryImage | undefined> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    const { id: itemId, ...updateData } = data as any; // Prevent id from being in $set
    await db.collection('gallery').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('gallery').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },
  deleteGalleryImage: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    await db.collection('gallery').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
  reorderGallery: async (orderedIds: string[]): Promise<GalleryImage[]> => {
    const db = await connectToDb();
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
    return db.collection<GalleryImage>('gallery').find().sort({ order: 1 }).toArray().then(mapDocs);
  },

  // ABOUT
  getAbout: async (): Promise<AboutData> => {
    const data = await fetchSingle<AboutData>('about', { 
        title: 'Our Story Behind the Lens', 
        content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.', 
        imageUrl: '', 
        features: [
          { title: 'Creative & Emotional', description: 'We believe every moment has a story to tell. We turn your special moments into timeless memories.' },
          { title: 'Modern & Professional', description: 'We use the latest technology and techniques to produce high-quality content that exceeds expectations.' },
          { title: 'Passionate & Dedicated', description: 'Our team is passionate about storytelling and dedicated to delivering exceptional results for every client.' },
        ]
    });

    if (data && typeof data.features === 'object' && !Array.isArray(data.features)) {
        data.features = Object.values(data.features);
    }
    return data;
  },
  updateAbout: async (data: AboutData): Promise<AboutData> => {
    const db = await connectToDb();
    const { id, ...updateData } = data as any;
    await db.collection('about').updateOne({}, { $set: updateData }, { upsert: true });
    const updatedDoc = await db.collection('about').findOne({});
    return mapDoc(updatedDoc);
  },

  // SERVICES
  getServices: async (): Promise<Service[]> => {
    return fetchMultiple<Service>('services', [], { _id: 1 });
  },
  getServiceById: async (id: string): Promise<WithId<Service> | null> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    return db.collection<Service>('services').findOne({ _id: new ObjectId(id) });
  },
  addService: async (item: Omit<Service, 'id'>): Promise<Service> => {
    const db = await connectToDb();
    const result = await db.collection('services').insertOne(item);
    return mapDoc({ ...item, _id: result.insertedId });
  },
  updateService: async (id: string, data: Partial<Service>): Promise<Service | undefined> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    const { id: itemId, ...updateData } = data as any;
    await db.collection('services').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('services').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },
  deleteService: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    await db.collection('services').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
  
  // PORTFOLIO
  getPortfolio: async (): Promise<PortfolioItem[]> => {
    return fetchMultiple<PortfolioItem>('portfolio', [], { order: 1 });
  },
  getPortfolioItemById: async (id: string): Promise<WithId<PortfolioItem> | null> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    return db.collection<PortfolioItem>('portfolio').findOne({ _id: new ObjectId(id) });
  },
  addPortfolioItem: async (item: Omit<PortfolioItem, 'id' | 'order'>): Promise<PortfolioItem> => {
    const db = await connectToDb();
    const count = await db.collection('portfolio').countDocuments();
    const newItem = { ...item, order: count + 1 };
    const result = await db.collection('portfolio').insertOne(newItem);
    return mapDoc({ ...newItem, _id: result.insertedId });
  },
  deletePortfolioItem: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    await db.collection('portfolio').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
  reorderPortfolio: async (orderedIds: string[]): Promise<PortfolioItem[]> => {
    const db = await connectToDb();
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
    return db.collection<PortfolioItem>('portfolio').find().sort({ order: 1 }).toArray().then(mapDocs);
  },
  updatePortfolioItem: async (id: string, data: Partial<PortfolioItem>): Promise<PortfolioItem | undefined> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    const { id: itemId, ...updateData } = data as any;
    await db.collection('portfolio').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('portfolio').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },

  // TESTIMONIALS
  getTestimonials: async (): Promise<Testimonial[]> => {
    return fetchMultiple<Testimonial>('testimonials', [], { _id: 1 });
  },
  getTestimonialById: async (id: string): Promise<WithId<Testimonial> | null> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    return db.collection<Testimonial>('testimonials').findOne({ _id: new ObjectId(id) });
  },
  addTestimonial: async (item: Omit<Testimonial, 'id'>): Promise<Testimonial> => {
    const db = await connectToDb();
    const result = await db.collection('testimonials').insertOne(item);
    return mapDoc({ ...item, _id: result.insertedId });
  },
  updateTestimonial: async (id: string, data: Partial<Testimonial>): Promise<Testimonial | undefined> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    const { id: itemId, ...updateData } = data as any;
    await db.collection('testimonials').updateOne({ _id: new ObjectId(id) }, { $set: updateData });
    const updatedDoc = await db.collection('testimonials').findOne({ _id: new ObjectId(id) });
    return updatedDoc ? mapDoc(updatedDoc) : undefined;
  },
  deleteTestimonial: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    await db.collection('testimonials').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },

  // VIDEO
  getVideo: async (): Promise<VideoData> => {
    return fetchSingle<VideoData>('video', { 
        title: 'Check Out Our Latest Work',
        description: 'A showcase of our recent projects, capturing unique stories and breathtaking moments. See our passion in action.',
        videoType: 'youtube',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videoThumbnail: ''
    });
  },
  updateVideo: async (data: VideoData): Promise<VideoData> => {
    const db = await connectToDb();
    const { id, ...updateData } = data as any;
    await db.collection('video').updateOne({}, { $set: updateData }, { upsert: true });
    const updatedDoc = await db.collection('video').findOne({});
    return mapDoc(updatedDoc);
  },
  
  // CONTACT
  getContact: async (): Promise<ContactData> => {
    return fetchSingle<ContactData>('contact', { 
        email: 'hello@hfmedia.house', 
        phone: '+1 (234) 567-890', 
        address: '123 Media Lane, Creative City, 10001', 
        imageUrl: '',
        socials: { facebook: '#', twitter: '#', instagram: '#', linkedin: '#', youtube: '#' },
    });
  },
  updateContact: async (data: ContactData): Promise<ContactData> => {
    const db = await connectToDb();
    const { id, ...updateData } = data as any;
    await db.collection('contact').updateOne({}, { $set: updateData }, { upsert: true });
    const updatedDoc = await db.collection('contact').findOne({});
    return mapDoc(updatedDoc);
  },

  // FOOTER
  getFooter: async (): Promise<FooterData> => {
    return fetchSingle<FooterData>('footer', { 
        copyright: `Copyright @${new Date().getFullYear()} H&F Media. All rights reserved.`, 
        links: [
            { title: 'Home', url: '/' },
            { title: 'About', url: '#about' },
            { title: 'Services', url: '#services' },
            { title: 'Contact', url: '#contact' },
        ] 
    });
  },
  updateFooter: async (data: FooterData): Promise<FooterData> => {
    const db = await connectToDb();
    const { id, ...updateData } = data as any;
    await db.collection('footer').updateOne({}, { $set: updateData }, { upsert: true });
    const updatedDoc = await db.collection('footer').findOne({});
    return mapDoc(updatedDoc);
  },

  // SEO
  getSEO: async (): Promise<SEOData> => {
    return fetchSingle<SEOData>('seo', { 
        title: 'H&F Media House | Fallback Title', 
        description: 'This is fallback description for when the database is not connected.',
        keywords: 'media, photography, video',
        url: 'https://example.com',
        ogImage: ''
    });
  },
  updateSEO: async (data: SEOData): Promise<SEOData> => {
    const db = await connectToDb();
    const { id, ...updateData } = data as any;
    await db.collection('seo').updateOne({}, { $set: updateData }, { upsert: true });
    const updatedDoc = await db.collection('seo').findOne({});
    return mapDoc(updatedDoc);
  },

  // INQUIRIES
  getInquiries: async (): Promise<Inquiry[]> => {
    return fetchMultiple<Inquiry>('inquiries', [], { createdAt: -1 });
  },
  addInquiry: async (item: Omit<Inquiry, 'id' | 'createdAt'>): Promise<Inquiry> => {
    const db = await connectToDb();
    const newItem = { ...item, createdAt: new Date() };
    const result = await db.collection('inquiries').insertOne(newItem);
    return mapDoc({ ...newItem, _id: result.insertedId });
  },
  deleteInquiry: async (id: string): Promise<{ success: boolean }> => {
    const db = await connectToDb();
    const { ObjectId } = await import('mongodb');
    await db.collection('inquiries').deleteOne({ _id: new ObjectId(id) });
    return { success: true };
  },
};
