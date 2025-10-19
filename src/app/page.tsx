
import { Header } from '@/components/sections/header';
import { HeroSection } from '@/modules/hero/components/hero-section';
import { AboutSection } from '@/modules/about/components/about-section';
import { GallerySection } from '@/modules/gallery/components/gallery-section';
import { ServicesSection } from '@/modules/services/components/services-section';
import { PortfolioSection } from '@/modules/portfolio/components/portfolio-section';
import { TestimonialsSection } from '@/modules/testimonials/components/testimonials-section';
import { VideoSection } from '@/modules/video/components/video-section';
import { ContactSection } from '@/modules/contact/components/contact-section';
import { Footer } from '@/modules/footer/components/footer';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Header />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <GallerySection />
      <PortfolioSection />
      <TestimonialsSection />
      <VideoSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
