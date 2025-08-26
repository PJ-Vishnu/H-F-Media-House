import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900']
})


export const metadata: Metadata = {
  title: 'H&F Media House CMS',
  description: 'Content Management System for H&F Media House',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} font-body antialiased min-h-screen bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
