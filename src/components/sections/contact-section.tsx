import type { ContactData } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

type ContactSectionProps = {
  data: ContactData;
};

export function ContactSection({ data }: ContactSectionProps) {
  return (
    <section id="contact" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Get In Touch</h2>
          <p className="text-lg text-muted-foreground mt-2">We'd love to hear from you. Let's create something amazing together.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center shadow-lg">
            <CardHeader>
              <Mail className="mx-auto h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Email</CardTitle>
              <a href={`mailto:${data.email}`} className="text-muted-foreground hover:text-primary transition-colors">{data.email}</a>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardHeader>
              <Phone className="mx-auto h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Phone</CardTitle>
              <p className="text-muted-foreground">{data.phone}</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-lg">
            <CardHeader>
              <MapPin className="mx-auto h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg">Address</CardTitle>
              <p className="text-muted-foreground">{data.address}</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-12">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center gap-6">
                <Link href={data.socials.facebook}><Facebook className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href={data.socials.twitter}><Twitter className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href={data.socials.instagram}><Instagram className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors" /></Link>
                <Link href={data.socials.linkedin}><Linkedin className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors" /></Link>
            </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}
