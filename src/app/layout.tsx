
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900']
})

// This function now only provides fallback metadata.
// The dynamic metadata is handled by the client-side fetching in the pages.
export const metadata: Metadata = {
    title: 'H&F Media House | Creative Film & Photo Production',
    description: 'A creative film and photo production house based in New York, specializing in cinematic storytelling for weddings, brands, and events.',
    keywords: 'film production, photography, video services, new york, wedding videographer, brand content',
    openGraph: {
      title: 'H&F Media House | Creative Film & Photo Production',
      description: 'A creative film and photo production house based in New York, specializing in cinematic storytelling for weddings, brands, and events.',
      type: 'website',
      url: 'https://hf-media-house.com',
      images: [
        {
          url: '/og-image.png', // A default OG image in public folder
          width: 1200,
          height: 630,
          alt: 'H&F Media House',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'H&F Media House | Creative Film & Photo Production',
      description: 'A creative film and photo production house based in New York, specializing in cinematic storytelling for weddings, brands, and events.',
      images: ['/og-image.png'],
    },
  };


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
