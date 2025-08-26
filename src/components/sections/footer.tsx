import type { FooterData } from '@/lib/definitions';
import { Logo } from '@/components/shared/logo';
import Link from 'next/link';

type FooterProps = {
  data: FooterData;
};

export function Footer({ data }: FooterProps) {
  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <Logo className="text-white" />
            <p className="mt-2 text-sm">{data.copyright}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
            {data.links.map(link => (
              <Link key={link.title} href={link.url} className="hover:text-white transition-colors">
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
