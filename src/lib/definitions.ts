
export type HeroData = {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaLink: string;
  images: { src: string; alt: string; 'data-ai-hint': string }[];
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  'data-ai-hint': string;
  order: number;
};

export type AboutData = {
  title: string;
  content: string;
  imageUrl: string;
  'data-ai-hint': string;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  'data-ai-hint': string;
  category: string;
  order: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  company: string;
};

export type ContactData = {
  email: string;
  phone: string;
  address: string;
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
};

export type FooterData = {
  copyright: string;
  links: {
    title: string;
    url: string;
  }[];
};

export type AdminUser = {
  email: string;
  password_DO_NOT_STORE_IN_PLAIN_TEXT: string;
}
