
"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { ContactData } from "@/modules/contact/contact.schema";
import { Loader2 } from "lucide-react";
import axios from 'axios';
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  imageUrl: z.string().optional(),
  socials: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    youtube: z.string().optional(),
  }),
});

export default function ContactAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/contact");
      const fetchedData: ContactData = await res.json();
      setData(fetchedData);
      form.reset(fetchedData);
      if (fetchedData.imageUrl) {
        setPreviewUrl(fetchedData.imageUrl);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch data" });
    }
  }, [form, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStagedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      form.setValue('imageUrl', result, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', 'contact');
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.filePath;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed' });
      return null;
    }
  };

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsLoading(true);
    let updatedValues = { ...values };

    try {
      if (stagedFile) {
        const newImageUrl = await uploadFile(stagedFile);
        if (newImageUrl) {
          updatedValues.imageUrl = newImageUrl;
        } else {
          throw new Error("Upload failed, aborting save.");
        }
      }

      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });

      if (!res.ok) throw new Error("Failed to save data");
      
      const savedData = await res.json();
      toast({ title: "Success!", description: "Contact details updated." });
      form.reset(savedData);
      setStagedFile(null);
      if (savedData.imageUrl) setPreviewUrl(savedData.imageUrl);

    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  }

  if (!data) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Contact Page</h1>
            <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>Update main contact information and the section image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormItem>
                <FormLabel>Section Image</FormLabel>
                <FormControl>
                    <div>
                        <Input type="file" onChange={handleFileChange} className="mb-2" disabled={isLoading}/>
                        {previewUrl && (
                          <Image 
                            src={previewUrl} 
                            alt="Preview" 
                            width={192} 
                            height={256} 
                            className="w-48 h-auto mt-2 rounded-md object-cover bg-muted" 
                          />
                        )}
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Update social media profile links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="socials.facebook" render={({ field }) => (
                  <FormItem><FormLabel>Facebook</FormLabel><FormControl><Input placeholder="https://facebook.com/..." {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.twitter" render={({ field }) => (
                  <FormItem><FormLabel>Twitter</FormLabel><FormControl><Input placeholder="https://twitter.com/..." {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.instagram" render={({ field }) => (
                  <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.linkedin" render={({ field }) => (
                  <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/..." {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.youtube" render={({ field }) => (
                  <FormItem><FormLabel>YouTube</FormLabel><FormControl><Input placeholder="https://youtube.com/..." {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
