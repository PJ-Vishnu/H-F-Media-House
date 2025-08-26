import type { HeroData, GalleryImage, AboutData, Service, PortfolioItem, Testimonial, ContactData, FooterData } from '@/lib/definitions';

// Mock Data
let heroData: HeroData = {
  headline: 'Innovative Media, Unforgettable Stories.',
  subheadline: 'H&F Media House crafts compelling narratives that captivate and inspire. Discover the power of visual storytelling.',
  ctaText: 'Explore Our Work',
  ctaLink: '#portfolio',
  images: [
    { src: 'https://picsum.photos/600/800?random=1', alt: 'Man with a camera', 'data-ai-hint': 'camera gear' },
    { src: 'https://picsum.photos/600/800?random=2', alt: 'Film set lighting', 'data-ai-hint': 'film set' },
    { src: 'https://picsum.photos/600/800?random=3', alt: 'Video editing suite', 'data-ai-hint': 'video editing' },
    { src: 'https://picsum.photos/600/800?random=4', alt: 'Drone flying over a landscape', 'data-ai-hint': 'drone videography' },
    { src: 'https://picsum.photos/600/800?random=5', alt: 'Podcast recording microphone', 'data-ai-hint': 'podcast setup' },
    { src: 'https://picsum.photos/600/800?random=6', alt: 'Photographer in action', 'data-ai-hint': 'photographer action' },
  ],
};

let galleryImages: GalleryImage[] = [
  { id: '1', src: 'https://picsum.photos/800/600?random=11', alt: 'Abstract art', 'data-ai-hint': 'abstract art', order: 1 },
  { id: '2', src: 'https://picsum.photos/800/600?random=12', alt: 'Cityscape at night', 'data-ai-hint': 'cityscape night', order: 2 },
  { id: '3', src: 'https://picsum.photos/800/600?random=13', alt: 'Nature landscape', 'data-ai-hint': 'nature landscape', order: 3 },
  { id: '4', src: 'https://picsum.photos/800/600?random=14', alt: 'Corporate event', 'data-ai-hint': 'corporate event', order: 4 },
  { id: '5', src: 'https://picsum.photos/800/600?random=15', alt: 'Product photography', 'data-ai-hint': 'product photography', order: 5 },
  { id: '6', src: 'https://picsum.photos/800/600?random=16', alt: 'Wedding photo', 'data-ai-hint': 'wedding photography', order: 6 },
];

let aboutData: AboutData = {
  title: 'About H&F Media House',
  content: 'Founded in 2010, H&F Media House has been at the forefront of digital media production. Our team of creatives, strategists, and technicians work collaboratively to bring your vision to life. We believe in the power of story to connect brands with their audiences in meaningful ways.',
  imageUrl: 'https://picsum.photos/1200/800?random=20',
  'data-ai-hint': 'creative team',
};

let services: Service[] = [
  { id: '1', title: 'Video Production', description: 'Full-service video production, from concept to final cut. Commercials, documentaries, and corporate videos.', icon: 'Video' },
  { id: '2', title: 'Photography', description: 'Professional photography for events, products, and branding. Capturing moments that matter.', icon: 'Camera' },
  { id: '3', title: 'Animation & VFX', description: '2D and 3D animation, motion graphics, and visual effects to make your content stand out.', icon: 'Wand' },
  { id: '4', title: 'Content Strategy', description: 'Developing data-driven content strategies that align with your business goals and engage your target audience.', icon: 'BrainCircuit' },
];

let portfolioItems: PortfolioItem[] = [
  { id: '1', title: 'Project Alpha', description: 'A documentary short on urban exploration.', imageUrl: 'https://picsum.photos/600/400?random=31', 'data-ai-hint': 'urban exploration', category: 'Video', order: 1 },
  { id: '2', title: 'Project Beta', description: 'Brand photography for a new startup.', imageUrl: 'https://picsum.photos/600/400?random=32', 'data-ai-hint': 'startup brand', category: 'Photography', order: 2 },
  { id: '3', title: 'Project Gamma', description: 'Animated explainer video for a tech company.', imageUrl: 'https://picsum.photos/600/400?random=33', 'data-ai-hint': 'animated explainer', category: 'Animation', order: 3 },
  { id: '4', title: 'Project Delta', description: 'Event coverage for a major music festival.', imageUrl: 'https://picsum.photos/600/400?random=34', 'data-ai-hint': 'music festival', category: 'Video', order: 4 },
];

let testimonials: Testimonial[] = [
  { id: '1', quote: 'H&F Media House transformed our brand presence online. Their creativity and professionalism are second to none.', author: 'Jane Doe', company: 'Innovate Corp' },
  { id: '2', quote: 'The team was a pleasure to work with. They delivered beyond our expectations on a tight deadline.', author: 'John Smith', company: 'Tech Solutions' },
];

let contactData: ContactData = {
  email: 'hello@hfmedia.house',
  phone: '+1 (234) 567-890',
  address: '123 Media Lane, Creative City, 10001',
  socials: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
  },
};

let footerData: FooterData = {
  copyright: `© ${new Date().getFullYear()} H&F Media House. All Rights Reserved.`,
  links: [
    { title: 'Home', url: '/' },
    { title: 'About', url: '#about' },
    { title: 'Services', url: '#services' },
    { title: 'Contact', url: '#contact' },
  ]
};

// Mock "DB" methods
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const db = {
  getHero: async () => { await delay(50); return heroData; },
  updateHero: async (data: HeroData) => { await delay(100); heroData = data; return heroData; },
  
  getGallery: async () => { await delay(50); return galleryImages.sort((a, b) => a.order - b.order); },
  addGalleryImage: async (image: Omit<GalleryImage, 'id' | 'order'>) => {
    await delay(100);
    const newImage: GalleryImage = {
      ...image,
      id: Date.now().toString(),
      order: galleryImages.length + 1,
    };
    galleryImages.push(newImage);
    return newImage;
  },
  updateGalleryImage: async (id: string, data: Partial<GalleryImage>) => {
    await delay(100);
    galleryImages = galleryImages.map(img => img.id === id ? { ...img, ...data } : img);
    return galleryImages.find(img => img.id === id);
  },
  deleteGalleryImage: async (id: string) => {
    await delay(100);
    galleryImages = galleryImages.filter(img => img.id !== id);
    return { success: true };
  },
  reorderGallery: async (orderedIds: string[]) => {
    await delay(100);
    const newOrderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
    galleryImages.forEach(img => {
      img.order = newOrderMap.get(img.id) ?? img.order;
    });
    return galleryImages.sort((a,b) => a.order - b.order);
  },

  getAbout: async () => { await delay(50); return aboutData; },
  updateAbout: async (data: AboutData) => { await delay(100); aboutData = data; return aboutData; },

  getServices: async () => { await delay(50); return services; },
  // ... more service methods if needed

  getPortfolio: async () => { await delay(50); return portfolioItems.sort((a, b) => a.order - b.order); },
  addPortfolioItem: async (item: Omit<PortfolioItem, 'id' | 'order'>) => {
    await delay(100);
    const newItem: PortfolioItem = {
      ...item,
      id: Date.now().toString(),
      order: portfolioItems.length + 1,
    };
    portfolioItems.push(newItem);
    return newItem;
  },
  deletePortfolioItem: async (id: string) => {
    await delay(100);
    portfolioItems = portfolioItems.filter(item => item.id !== id);
    return { success: true };
  },
  reorderPortfolio: async (orderedIds: string[]) => {
    await delay(100);
    const newOrderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
    portfolioItems.forEach(item => {
      item.order = newOrderMap.get(item.id) ?? item.order;
    });
    return portfolioItems.sort((a,b) => a.order - b.order);
  },
  updatePortfolioItem: async (id: string, data: Partial<PortfolioItem>) => {
    await delay(100);
    portfolioItems = portfolioItems.map(item => item.id === id ? { ...item, ...data } : item);
    return portfolioItems.find(item => item.id === id);
  },

  getTestimonials: async () => { await delay(50); return testimonials; },
  // ... more testimonial methods

  getContact: async () => { await delay(50); return contactData; },
  updateContact: async (data: ContactData) => { await delay(100); contactData = data; return contactData; },

  getFooter: async () => { await delay(50); return footerData; },
  updateFooter: async (data: FooterData) => { await delay(100); footerData = data; return footerData; },
};
