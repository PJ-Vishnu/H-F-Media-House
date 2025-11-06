
import Image from 'next/image';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { getContactData } from '../contact.data';
import { ContactForm } from './contact-form';

export async function ContactSection() {
    const contactData = await getContactData();
    
    if (!contactData) {
        return (
            <section id="contact" className="w-full py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
                        <Skeleton className="h-10 w-2/3 mx-auto mb-4" />
                        <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-12 w-40 rounded-full" />
                        </div>
                        <Skeleton className="h-[550px] w-full rounded-xl" />
                    </div>
                </div>
            </section>
        );
    }

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
                <ContactForm />
            </div>
            <div className="relative w-full h-96 lg:h-full min-h-[550px] rounded-xl overflow-hidden shadow-2xl">
              {contactData.imageUrl ? (
                <Image src={contactData.imageUrl} alt="Camera gear" fill className="object-cover"/>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">Image not available</p>
                </div>
              )}
            </div>
        </div>
      </ScrollFadeIn>
    </section>
  );
}
