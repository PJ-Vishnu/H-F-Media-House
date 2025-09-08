
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { HeroData } from "@/modules/hero/hero.schema";
import axios from 'axios';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

const heroSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().min(1, "Subheadline is required"),
  ctaText: z.string().min(1, "CTA text is required"),
  ctaLink: z.string().min(1, "CTA link is required"), // Changed to min(1) as URL is not always required
  images: z.array(z.object({
    src: z.string().min(1, "Image URL is required"),
    alt: z.string().min(1, "Alt text is required"),
  })),
});

type StagedFile = {
  index: number;
  file: File;
};

export default function HeroAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);

  const form = useForm<z.infer<typeof heroSchema>>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      headline: "",
      subheadline: "",
      ctaText: "",
      ctaLink: "",
      images: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "images",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/hero");
        const fetchedData: HeroData = await res.json();
        setData(fetchedData);
        form.reset(fetchedData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to fetch data",
          description: "Could not load hero section data.",
        });
      }
    }
    fetchData();
  }, [form, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      // Update the form state to show the preview immediately
      const currentImages = form.getValues('images');
      update(index, { ...currentImages[index], src: previewUrl });
      
      // Stage the actual file for upload
      setStagedFiles(prev => {
        const others = prev.filter(f => f.index !== index);
        return [...others, { index, file }];
      });
    };
    reader.readAsDataURL(file);
  };
  
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', 'hero');
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.filePath;
    } catch (error) {
      console.error("Upload failed", error);
      toast({ variant: 'destructive', title: 'Upload failed for one or more images.' });
      return null;
    }
  };

  async function onSubmit(values: z.infer<typeof heroSchema>) {
    setIsLoading(true);
    let submissionValues = { ...values }; 

    try {
      if (stagedFiles.length > 0) {
        const uploadPromises = stagedFiles.map(sf => uploadFile(sf.file));
        const uploadedPaths = await Promise.all(uploadPromises);

        stagedFiles.forEach((sf, i) => {
          const newPath = uploadedPaths[i];
          if (newPath) {
            submissionValues.images[sf.index].src = newPath;
          } else {
            throw new Error(`Failed to upload image for item ${sf.index + 1}.`);
          }
        });
      }

      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionValues),
      });

      if (!res.ok) throw new Error("Failed to save data");

      const savedData = await res.json();
      form.reset(savedData);
      setStagedFiles([]); // Clear staged files after successful save
      toast({
        title: "Success!",
        description: "Hero section has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Could not save changes.",
      });
    } finally {
        setIsLoading(false);
    }
  }

  const handleAddImage = () => {
    append({ src: '', alt: 'New Image' });
  };


  if (!data) {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Manage Hero Section</h1>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-1/4" />
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Hero Section</h1>
                <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>

            <Card>
                <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Update the main content of the hero section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="headline"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Headline</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="subheadline"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subheadline</FormLabel>
                            <FormControl>
                            <Textarea rows={4} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ctaText"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Call to Action Button Text</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="ctaLink"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Call to Action Button Link</FormLabel>
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Hero Images</CardTitle>
                    <CardDescription>Manage the images in the hero carousel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => {
                      const currentSrc = form.watch(`images.${index}.src`);
                      return (
                        <div key={field.id} className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg">
                           <div className="w-full md:w-32 flex-shrink-0">
                             {currentSrc && (
                             <Image 
                                src={currentSrc} 
                                alt={form.watch(`images.${index}.alt`) || 'Hero image preview'} 
                                width={128} 
                                height={128} 
                                className="object-cover rounded-md aspect-square bg-muted"
                            />)}
                           </div>
                           <div className="flex-grow space-y-4 w-full">
                             <FormItem>
                                <FormLabel>Image {index + 1}</FormLabel>
                                <FormControl>
                                  <Input type="file" onChange={(e) => handleFileChange(e, index)} className="mb-2"/>
                                </FormControl>
                                <FormMessage />
                             </FormItem>
                              <FormField
                                control={form.control}
                                name={`images.${index}.alt`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alt Text</FormLabel>
                                        <FormControl><Input {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                             />
                           </div>
                           <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                      )
                    })}
                    <Button type="button" variant="outline" onClick={handleAddImage}>
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Image
                    </Button>
                </CardContent>
            </Card>
        </form>
      </Form>
    </div>
  );
}
