
import type { FooterData } from '@/modules/footer/footer.schema';
import type { ContactData } from '@/modules/contact/contact.schema';
import { Logo } from '@/components/shared/logo';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { db } from '@/lib/db';
import { FooterLogo } from '@/components/shared/footerLogo';

type FooterProps = {
  data: FooterData;
};

export async function Footer({ data }: FooterProps) {
  const contactData: ContactData = await db.getContact();
  const socials = contactData.socials || {};

  const exploreLinks = [
    { title: 'Home', url: '/' },
    { title: 'About Us', url: '#about' },
    { title: 'Contact Us', url: '#contact' },
    { title: 'Services', url: '#services' },
  ];

  const portfolioLinks = [
    { title: 'Wedding', url: '#' },
    { title: 'Branding', url: '#' },
    { title: 'Video', url: '#' },
    { title: 'Photo', url: '#' },
  ];


  return (
    <footer className="w-full bg-gray-900 text-slate-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <FooterLogo className="text-white text-3xl" />
                <p className="mt-4 text-sm">We are a creative agency that specializes in video production, photography, and content strategy.</p>
            </div>
            <div>
                <h4 className="font-bold text-white mb-4">EXPLORE</h4>
                <nav className="flex flex-col gap-2">
                    {exploreLinks.map(link => (
                      <Link key={link.title} href={link.url} className="hover:text-white transition-colors text-sm">
                        {link.title}
                      </Link>
                    ))}
                </nav>
            </div>
             {/* <div>
                <h4 className="font-bold text-white mb-4">PORTFOLIO</h4>
                <nav className="flex flex-col gap-2">
                    {portfolioLinks.map(link => (
                      <Link key={link.title} href={link.url} className="hover:text-white transition-colors text-sm">
                        {link.title}
                      </Link>
                    ))}
                </nav>
            </div> */}
             <div>
                <h4 className="font-bold text-white mb-4">SOCIAL MEDIA</h4>
                <div className="flex gap-4">
                  {socials.facebook && <Link href={socials.facebook}><Facebook className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                  {socials.twitter && <Link href={socials.twitter}><Twitter className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                  {socials.instagram && <Link href={socials.instagram}><Instagram className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                  {socials.linkedin && <Link href={socials.linkedin}><Linkedin className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                  {socials.youtube && <Link href={socials.youtube}><Youtube className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                </div>
            </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm">
           <p>{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
