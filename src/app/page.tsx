import { db } from '@/lib/db';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { GallerySection } from '@/components/sections/gallery-section';
import { ServicesSection } from '@/components/sections/services-section';
import { PortfolioSection } from '@/components/sections/portfolio-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { ContactSection } from '@/components/sections/contact-section';
import { Footer } from '@/components/sections/footer';

export default async function Home() {
  // In a real app, you might have a single API call that fetches all page data.
  const [
    heroData,
    aboutData,
    galleryData,
    servicesData,
    portfolioData,
    testimonialsData,
    contactData,
    footerData,
  ] = await Promise.all([
    db.getHero(),
    db.getAbout(),
    db.getGallery(),
    db.getServices(),
    db.getPortfolio(),
    db.getTestimonials(),
    db.getContact(),
    db.getFooter(),
  ]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <HeroSection data={heroData} />
      <AboutSection data={aboutData} />
      <ServicesSection data={servicesData} />
      <GallerySection data={galleryData} />
      <PortfolioSection data={portfolioData} />
      <TestimonialsSection data={testimonialsData} />
      <ContactSection data={contactData} />
      <Footer data={footerData} />
    </main>
  );
}
