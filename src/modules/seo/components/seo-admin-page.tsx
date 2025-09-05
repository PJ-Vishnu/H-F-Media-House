"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { SEOData } from "@/modules/seo/seo.schema";
import { Loader2 } from "lucide-react";
import axios from "axios";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const seoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  keywords: z.string().optional(),
  url: z.string().url("Must be a valid URL"),
  ogImage: z.string().optional(),
});

export default function SEOAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<SEOData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof seoSchema>>({
    resolver: zodResolver(seoSchema),
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/seo");
        const fetchedData: SEOData = await res.json();
        setData(fetchedData);
        form.reset(fetchedData);
        if(fetchedData.ogImage) {
          setPreviewUrl(fetchedData.ogImage);
        }
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch SEO data" });
      }
    }
    fetchData();
  }, [form, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStagedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      form.setValue('ogImage', result, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('/api/upload?section=seo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.filePath;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed' });
      return null;
    }
  }


  async function onSubmit(values: z.infer<typeof seoSchema>) {
    setIsLoading(true);
    let updatedValues = { ...values };

    try {
      if (stagedFile) {
        const newImageUrl = await uploadFile(stagedFile);
        if (newImageUrl) {
          updatedValues.ogImage = newImageUrl;
        } else {
          throw new Error("Upload failed, aborting save.");
        }
      }

      const res = await fetch("/api/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });

      if (!res.ok) throw new Error("Failed to save data");
      
      const savedData = await res.json();
      toast({ title: "Success!", description: "SEO settings updated." });
      form.reset(savedData);
      setStagedFile(null);
      if(savedData.ogImage) setPreviewUrl(savedData.ogImage);

    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  }

  if (!data) {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-9 w-1/3" />
                <Skeleton className="h-10 w-32" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage SEO</h1>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading || !form.formState.isDirty}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO & Metadata</CardTitle>
          <CardDescription>Update the metadata for search engines and social media sharing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Description</FormLabel>
                    <FormControl><Textarea rows={3} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="keywords"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Keywords</FormLabel>
                    <FormControl><Input placeholder="e.g. photography, video, media production" {...field} value={field.value || ''}/></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canonical URL</FormLabel>
                    <FormControl><Input placeholder="https://www.your-domain.com" {...field} value={field.value || ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Open Graph Image (1200x630px)</FormLabel>
                  <FormControl>
                    <div>
                        <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" disabled={isLoading}/>
                        {previewUrl && <Image src={previewUrl} alt="OG Preview" width={240} height={126} className="w-48 h-auto mt-2 rounded-md object-cover bg-muted" />}
                    </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

    