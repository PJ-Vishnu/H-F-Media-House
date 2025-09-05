import type { ContactData } from '@/modules/contact/contact.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

type ContactSectionProps = {
  contactData: ContactData;
};

export function ContactSection({ contactData }: ContactSectionProps) {
  return (
    <section id="contact" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">Contact H&F Media House</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Let's Work Together</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Ready to start your next project? Send us a message and we'll get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
                <h3 className="text-2xl font-bold mb-4">Send us a message</h3>
                <p className="text-muted-foreground mb-8">We are committed to providing our clients with the best possible service and support. Please do not hesitate to contact us at any time.</p>
                <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input placeholder="First Name" className="bg-input"/>
                        <Input placeholder="Last Name" className="bg-input"/>
                    </div>
                    <Input placeholder="Email" type="email" className="bg-input" />
                    <Input placeholder="Contact Number" type="tel" className="bg-input" />
                    <Textarea placeholder="Your Message" rows={5} className="bg-input" />
                    <Button type="submit" size="lg" className="w-full md:w-auto rounded-full">Send Message</Button>
                </form>
            </div>
            <div className="relative w-full h-96 lg:h-full rounded-xl overflow-hidden shadow-2xl">
              <Image src="https://picsum.photos/600/800?random=50" alt="Camera gear" data-ai-hint="camera gear" fill style={{objectFit: 'cover'}}/>
            </div>
        </div>
        
        <ScrollFadeIn className="mt-24">
            <div className="aspect-video relative rounded-xl overflow-hidden">
                <Image src="https://picsum.photos/1280/720?random=51" alt="Wedding couple" data-ai-hint="wedding couple" fill style={{objectFit: 'cover'}}/>
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button variant="ghost" size="icon" className="w-20 h-20 bg-white/30 hover:bg-white/50 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-8 h-8 ml-1">
                            <path d="M5 4.5V19.5L19 12L5 4.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                </div>
            </div>
        </ScrollFadeIn>
      </ScrollFadeIn>
    </section>
  );
}
