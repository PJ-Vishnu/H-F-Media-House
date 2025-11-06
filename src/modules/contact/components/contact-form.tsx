
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const inquirySchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email(),
    phone: z.string().optional(),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export function ContactForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof inquirySchema>>({
        resolver: zodResolver(inquirySchema),
        defaultValues: { firstName: "", lastName: "", email: "", phone: "", message: "" }
    });

    async function onSubmit(values: z.infer<typeof inquirySchema>) {
        setIsLoading(true);
        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error("Failed to send message. Please try again.");
            toast({ title: "Message Sent!", description: "Thank you for reaching out. We'll get back to you soon." });
            form.reset();
        } catch (error) {
            toast({ variant: 'destructive', title: "Submission Error", description: error instanceof Error ? error.message : "An unknown error occurred." });
        } finally {
            setIsLoading(false);
        }
    }

    return (
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
    );
}
