import { db } from '@/lib/db';
import { HeroSection } from '@/modules/hero/components/hero-section';
import { AboutSection } from '@/modules/about/components/about-section';
import { GallerySection } from '@/modules/gallery/components/gallery-section';
import { ServicesSection } from '@/modules/services/components/services-section';
import { PortfolioSection } from '@/modules/portfolio/components/portfolio-section';
import { TestimonialsSection } from '@/modules/testimonials/components/testimonials-section';
import { ContactSection } from '@/modules/contact/components/contact-section';
import { Footer } from '@/modules/footer/components/footer';
import { Header } from '@/components/sections/header';

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
      <Header />
      <HeroSection data={heroData} />
      <AboutSection data={aboutData} />
      <ServicesSection data={servicesData} />
      <GallerySection data={galleryData} />
      <PortfolioSection data={portfolioData} />
      <TestimonialsSection data={testimonialsData} />
      <ContactSection contactData={contactData} />
      <Footer data={footerData} />
    </main>
  );
}
