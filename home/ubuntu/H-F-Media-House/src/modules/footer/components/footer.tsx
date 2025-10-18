"use client";

import { useState, useEffect } from 'react';
import type { FooterData } from '@/modules/footer/footer.schema';
import type { ContactData } from '@/modules/contact/contact.schema';
import { FooterLogo } from '@/components/shared/footerLogo';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [footerRes, contactRes] = await Promise.all([
          fetch('/api/footer'),
          fetch('/api/contact'),
        ]);
        const footerJson: FooterData = await footerRes.json();
        const contactJson: ContactData = await contactRes.json();
        setFooterData(footerJson);
        setContactData(contactJson);
      } catch (error) {
        console.error("Failed to fetch footer/contact data:", error);
      }
    }
    fetchData();
  }, []);

  if (!footerData || !contactData) {
    return (
      <footer className="w-full bg-gray-900 text-slate-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
              </div>
              <div>
                  <Skeleton className="h-6 w-24 mb-4" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-4 w-20 mb-2" />
              </div>
               <div>
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
              </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm">
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </div>
      </footer>
    );
  }

  const socials = contactData.socials || {};
  const exploreLinks = [
    { title: 'Home', url: '/' },
    { title: 'About Us', url: '#about' },
    { title: 'Contact Us', url: '#contact' },
    { title: 'Services', url: '#services' },
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
           <p>{footerData.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
