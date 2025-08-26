import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'
import { db } from '@/lib/db';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900']
})


export async function generateMetadata(): Promise<Metadata> {
  const seoData = await db.getSEO();
  
  const title = seoData?.title || 'H&F Media House';
  const description = seoData?.description || 'Creative Film & Photo Production';

  return {
    title,
    description,
    keywords: seoData?.keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: seoData?.url || '/',
      images: [
        {
          url: seoData?.ogImage || 'https://picsum.photos/1200/630',
          width: 1200,
          height: 630,
          alt: 'H&F Media House',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [seoData?.ogImage || 'https://picsum.photos/1200/630'],
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="!scroll-smooth">
      <body className={`${poppins.className} font-body antialiased min-h-screen bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
