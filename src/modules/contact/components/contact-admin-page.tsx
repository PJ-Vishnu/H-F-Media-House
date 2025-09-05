"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { ContactData } from "@/modules/contact/contact.schema";
import { Loader2 } from "lucide-react";
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  socials: z.object({
    facebook: z.string().url().or(z.literal("")).optional(),
    twitter: z.string().url().or(z.literal("")).optional(),
    instagram: z.string().url().or(z.literal("")).optional(),
    linkedin: z.string().url().or(z.literal("")).optional(),
  }),
  videoType: z.enum(["youtube", "upload"]).optional(),
  videoUrl: z.string().optional(),
  videoThumbnail: z.string().optional(),
});

export default function ContactAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<ContactData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  const videoType = form.watch("videoType");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/contact");
        const fetchedData: ContactData = await res.json();
        setData(fetchedData);
        form.reset(fetchedData);
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch data" });
      }
    }
    fetchData();
  }, [form, toast]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const isVideo = file.type.startsWith('video/');
    const fieldToUpdate = isVideo ? 'videoUrl' : 'videoThumbnail';

    try {
      const res = await axios.post(`/api/upload?section=contact`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      form.setValue(fieldToUpdate, res.data.filePath, { shouldDirty: true });
      toast({ title: `${isVideo ? 'Video' : 'Thumbnail'} upload successful` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save data");
      
      toast({ title: "Success!", description: "Contact details updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed" });
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>Update main contact information.</CardDescription>
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Update social media profile links.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="socials.facebook" render={({ field }) => (
                  <FormItem><FormLabel>Facebook</FormLabel><FormControl><Input placeholder="https://facebook.com/..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.twitter" render={({ field }) => (
                  <FormItem><FormLabel>Twitter</FormLabel><FormControl><Input placeholder="https://twitter.com/..." {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="socials.instagram" render={({ field }) => (
                  <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input placeholder="https://instagram.com/..." {...field} /></FormControl><FormMessage /></FormMessage>
              )} />
              <FormField control={form.control} name="socials.linkedin" render={({ field }) => (
                  <FormItem><FormLabel>LinkedIn</FormLabel><FormControl><Input placeholder="https://linkedin.com/..." {...field} /></FormControl><FormMessage /></FormMessage>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Section</CardTitle>
              <CardDescription>Configure the video player shown above the footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="videoType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Video Source</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="youtube" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            YouTube
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="upload" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Upload Video
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {videoType === 'youtube' && (
                 <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Embed URL</FormLabel>
                        <FormControl><Input placeholder="https://www.youtube.com/embed/..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}

              {videoType === 'upload' && (
                 <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Video File</FormLabel>
                        <FormControl>
                           <Input 
                             type="file" 
                             accept="video/*" 
                             onChange={handleFileChange} 
                             disabled={isUploading}
                           />
                        </FormControl>
                        {field.value && <p className="text-sm text-muted-foreground mt-2">Current file: {field.value}</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}
            </CardContent>
          </Card>

        </form>
      </Form>
    </div>
  );
}
