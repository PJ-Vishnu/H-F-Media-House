
"use client";

import { useState, useEffect } from 'react';
import type { ContactData } from '@/modules/contact/contact.schema';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const inquirySchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});


export function ContactSection() {
    const [contactData, setContactData] = useState<ContactData | null>(null);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
          try {
            const res = await fetch('/api/contact');
            const fetchedData: ContactData = await res.json();
            setContactData(fetchedData);
          } catch (error) {
            console.error("Failed to fetch contact data:", error);
          }
        }
        fetchData();
    }, []);

    const form = useForm<z.infer<typeof inquirySchema>>({
        resolver: zodResolver(inquirySchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            message: "",
        }
    });

    async function onSubmit(values: z.infer<typeof inquirySchema>) {
        setIsLoading(true);
        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                throw new Error("Failed to send message. Please try again.");
            }

            toast({
                title: "Message Sent!",
                description: "Thank you for reaching out. We'll get back to you soon.",
            });
            form.reset();

        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Submission Error",
                description: error instanceof Error ? error.message : "An unknown error occurred.",
            })
        } finally {
            setIsLoading(false);
        }
    }
    
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
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-12 w-40" />
                        </div>
                        <Skeleton className="h-96 w-full rounded-xl" />
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => (
                                <FormItem><FormControl><Input placeholder="First Name" {...field} className="bg-input"/></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="lastName" render={({ field }) => (
                                <FormItem><FormControl><Input placeholder="Last Name" {...field} className="bg-input"/></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="Email" type="email" {...field} className="bg-input" /></FormControl><FormMessage /></FormItem>
                        )}/>
                         <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormControl><Input placeholder="Contact Number (Optional)" type="tel" {...field} className="bg-input" /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="message" render={({ field }) => (
                            <FormItem><FormControl><Textarea placeholder="Your Message" rows={5} {...field} className="bg-input" /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <Button type="submit" size="lg" className="w-full md:w-auto rounded-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Message
                        </Button>
                    </form>
                </Form>
            </div>
            <div className="relative w-full h-96 lg:h-full rounded-xl overflow-hidden shadow-2xl">
              {contactData.imageUrl ? (
                <Image src={contactData.imageUrl} alt="Camera gear" fill style={{objectFit: 'cover'}}/>
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
