"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { AboutData } from "@/modules/about/about.schema";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

const aboutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Must be a valid image URL"),
  'data-ai-hint': z.string().optional(),
  features: z.array(z.object({
    title: z.string().min(1, "Feature title is required"),
    description: z.string().min(1, "Feature description is required"),
  })).max(3, "You can have a maximum of 3 features."),
});

export default function AboutAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<AboutData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof aboutSchema>>({
    resolver: zodResolver(aboutSchema),
  });
  
  const { fields } = useFieldArray({
    control: form.control,
    name: "features"
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/about");
        const fetchedData: AboutData = await res.json();
        setData(fetchedData);
        // Ensure features is always an array of 3 for the form
        const features = fetchedData.features || [];
        while (features.length < 3) {
          features.push({ title: "", description: "" });
        }
        form.reset({ ...fetchedData, features: features.slice(0, 3) });
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch data" });
      }
    }
    fetchData();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof aboutSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save data");
      
      toast({ title: "Success!", description: "About section updated." });
    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed" });
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
            <Button type="submit" disabled={isLoading}>
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
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="data-ai-hint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Hint</FormLabel>
                    <FormControl><Input {...field} placeholder="e.g. camera lens" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Overlay Features</CardTitle>
              <CardDescription>Update the content for the 3 feature cards that overlay the image.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                 <div key={field.id} className="p-4 border rounded-lg space-y-4">
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
                 </div>
              ))}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
