"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { FooterData } from "@/modules/footer/footer.schema";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const footerSchema = z.object({
  copyright: z.string().min(1, "Copyright text is required"),
  links: z.array(z.object({
    title: z.string().min(1, "Link title is required"),
    url: z.string().min(1, "Link URL is required"),
  })),
});

export default function FooterAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<FooterData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof footerSchema>>({
    resolver: zodResolver(footerSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/footer");
        const fetchedData: FooterData = await res.json();
        setData(fetchedData);
        form.reset(fetchedData);
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch data" });
      }
    }
    fetchData();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof footerSchema>) {
    setIsLoading(true);
    try {
      await fetch("/api/footer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      toast({ title: "Success!", description: "Footer content updated." });
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Footer</h1>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Copyright</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField control={form.control} name="copyright" render={({ field }) => (
                  <FormItem><FormLabel>Copyright Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Footer Links</CardTitle>
              <CardDescription>Manage the navigation links in the footer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end p-4 border rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                    <FormField control={form.control} name={`links.${index}.title`} render={({ field }) => (
                        <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name={`links.${index}.url`} render={({ field }) => (
                        <FormItem><FormLabel>URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => append({ title: "", url: "" })}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Link
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
