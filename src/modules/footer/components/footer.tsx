
import { FooterLogo } from '@/components/shared/footerLogo';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getFooterData, getFooterContactData } from '../footer.data';

export async function Footer() {
  const [footerData, contactData] = await Promise.all([
    getFooterData(),
    getFooterContactData(),
  ]);

  if (!footerData || !contactData) {
    return (
      <footer className="w-full bg-gray-900 text-slate-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                  <Skeleton className="h-10 w-40 mb-4" />
                  <Skeleton className="h-4 w-full" />
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
               <div>
                  <Skeleton className="h-6 w-32 mb-4" />
                   <Skeleton className="h-4 w-full" />
                   <Skeleton className="h-4 w-full mt-2" />
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
  const exploreLinks = footerData.links || [];

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
                  {socials.facebook && <Link href={socials.facebook} aria-label="Facebook"><Facebook className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                  {socials.twitter && <Link href={socials.twitter} aria-label="Twitter"><Twitter className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                  {socials.instagram && <Link href={socials.instagram} aria-label="Instagram"><Instagram className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                  {socials.linkedin && <Link href={socials.linkedin} aria-label="LinkedIn"><Linkedin className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                  {socials.youtube && <Link href={socials.youtube} aria-label="YouTube"><Youtube className="h-6 w-6 hover:text-white transition-colors" /></Link>}
                </div>
            </div>
            <div>
                 <h4 className="font-bold text-white mb-4">CONTACT</h4>
                 <div className="text-sm space-y-2">
                    <p>{contactData.address}</p>
                    <p>{contactData.email}</p>
                    <p>{contactData.phone}</p>
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
