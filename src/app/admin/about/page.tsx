
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { AboutData } from "@/modules/about/about.schema";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import axios from 'axios';
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image is required"),
  features: z.array(z.object({
    title: z.string().max(50, "Title cannot exceed 50 characters."),
    description: z.string().max(250, "Description cannot exceed 250 characters."),
  })).max(3, "You can have a maximum of 3 features."),
});

export default function AboutAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stagedFile, setStagedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof aboutSchema>>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
      features: [],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features"
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/about");
        const fetchedData: AboutData = await res.json();
        setData(fetchedData);
        setPreviewUrl(fetchedData.imageUrl);
        form.reset({ ...fetchedData, features: fetchedData.features || [] });
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch data" });
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
      form.setValue('imageUrl', result, { shouldDirty: true });
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', 'about');
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

  async function onSubmit(values: z.infer<typeof aboutSchema>) {
    setIsLoading(true);
    let updatedValues = { ...values };
    
    // Filter out any features that are completely empty before saving.
    updatedValues.features = updatedValues.features.filter(
        feature => feature.title.trim() !== '' || feature.description.trim() !== ''
    );

    try {
      if (stagedFile) {
        const newImageUrl = await uploadFile(stagedFile);
        if (newImageUrl) {
          updatedValues.imageUrl = newImageUrl;
        } else {
          throw new Error("Upload failed, aborting save.");
        }
      }

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });

      if (!res.ok) throw new Error("Failed to save data");
      
      const savedData = await res.json();
      toast({ title: "Success!", description: "About section updated." });
      form.reset(savedData);
      setStagedFile(null);
      setPreviewUrl(savedData.imageUrl);

    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  }

  if (!data) {
    return <Skeleton className="w-full h-[60rem]" />;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage About Section</h1>
            <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About Us Content</CardTitle>
              <CardDescription>Update the text and image for the about section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl><Textarea rows={8} {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                    <div>
                        <Input type="file" onChange={handleFileChange} className="mb-2" disabled={isLoading}/>
                        {previewUrl && (
                          <Image 
                            src={previewUrl} 
                            alt="Preview" 
                            width={192} 
                            height={108} 
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
              <CardTitle>Overlay Features</CardTitle>
              <CardDescription>Update the content for the feature cards that overlay the image. You can add up to 3.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                 <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                    <h3 className="font-semibold">Feature Card {index + 1}</h3>
                    <FormField
                      control={form.control}
                      name={`features.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`features.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl><Textarea rows={3} {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                 </div>
              ))}
               {fields.length < 3 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ title: '', description: '' })}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
                </Button>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
