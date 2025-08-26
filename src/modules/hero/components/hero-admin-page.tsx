"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { HeroData } from "@/modules/hero/hero.schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const heroSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  subheadline: z.string().min(1, "Subheadline is required"),
  ctaText: z.string().min(1, "CTA text is required"),
  ctaLink: z.string().url("Must be a valid URL"),
});

export default function HeroAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<HeroData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof heroSchema>>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      headline: "",
      subheadline: "",
      ctaText: "",
      ctaLink: "",
    },
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

  async function onSubmit(values: z.infer<typeof heroSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save data");

      const savedData = await res.json();
      setData(savedData);
      form.reset(savedData);
      toast({
        title: "Success!",
        description: "Hero section has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: "Could not save changes to the hero section.",
      });
    } finally {
        setIsLoading(false);
    }
  }

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Hero Section</h1>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
          <CardDescription>Update the main content of the hero section.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Note: Image carousel management is not part of this form as it's complex and might require a separate interface or be static. */}
    </div>
  );
}
