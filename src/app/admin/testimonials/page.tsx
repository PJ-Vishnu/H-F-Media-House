
"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@/modules/testimonials/testimonials.schema";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const testimonialsSchema = z.object({
  testimonials: z.array(z.object({
    id: z.string(),
    quote: z.string().min(1, "Quote is required"),
    author: z.string().min(1, "Author is required"),
    company: z.string().min(1, "Company is required"),
    avatar: z.string().optional(),
  }))
});

type StagedFile = {
  index: number;
  file: File;
};

export default function TestimonialsAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; index: number } | null>(null);

  const form = useForm<z.infer<typeof testimonialsSchema>>({
    resolver: zodResolver(testimonialsSchema),
    defaultValues: { testimonials: [] },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "testimonials",
  });

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/testimonials");
      const fetchedData: Testimonial[] = await res.json();
      form.reset({ testimonials: fetchedData });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch testimonials" });
    }
  }, [form, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (id: string, index: number) => {
    setItemToDelete({ id, index });
    setDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      const currentTestimonials = form.getValues('testimonials');
      update(index, { ...currentTestimonials[index], avatar: previewUrl });

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
    formData.append('section', 'testimonials');
    try {
      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.filePath;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed' });
      return null;
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await fetch(`/api/testimonials?id=${itemToDelete.id}`, { method: 'DELETE' });
      remove(itemToDelete.index);
      toast({ title: "Testimonial deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete testimonial" });
    } finally {
      setDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleSaveAll = async (data: z.infer<typeof testimonialsSchema>) => {
    setIsSubmitting(true);
    let submissionValues = { ...data };

    try {
      if (stagedFiles.length > 0) {
        const uploadPromises = stagedFiles.map(sf => uploadFile(sf.file));
        const uploadedPaths = await Promise.all(uploadPromises);

        stagedFiles.forEach((sf, i) => {
          const newPath = uploadedPaths[i];
          if (newPath) {
            submissionValues.testimonials[sf.index].avatar = newPath;
          } else {
            throw new Error(`Upload failed for testimonial: ${submissionValues.testimonials[sf.index].author}`);
          }
        });
      }

      for (const testimonial of submissionValues.testimonials) {
        const { id, ...testimonialData } = testimonial;
        await fetch(`/api/testimonials?id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonialData),
        });
      }
      toast({ title: "Success!", description: "Testimonials updated successfully." });
      form.reset({ testimonials: submissionValues.testimonials });
      setStagedFiles([]);

    } catch (error) {
      toast({ variant: 'destructive', title: "Failed to save testimonials.", description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = async () => {
    const newTestimonial = {
      quote: "A new fantastic testimonial about our services.",
      author: "New Client",
      company: "Client's Company",
      avatar: ''
    };
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTestimonial),
      });
      if (!res.ok) throw new Error('Failed to add testimonial');
      const addedItem = await res.json();
      append(addedItem);
      toast({ title: "Testimonial added" });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to add testimonial.' });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveAll)}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Testimonials</h1>
            <div>
              <Button type="button" onClick={handleAddItem} variant="outline" className="mr-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save All Changes
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Client Testimonials</CardTitle>
              <CardDescription>Manage client feedback. Remember to save all changes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.length === 0 && !form.formState.isValidating ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)
                ) : (
                  fields.map((field, index) => {
                    const currentSrc = form.watch(`testimonials.${index}.avatar`);

                    return (
                      <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-background">
                        <div className="flex-grow space-y-3">
                          <FormField
                            control={form.control}
                            name={`testimonials.${index}.quote`}
                            render={({ field }) => (
                              <FormItem><FormLabel>Quote</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                            <FormField
                              control={form.control}
                              name={`testimonials.${index}.author`}
                              render={({ field }) => (
                                <FormItem><FormLabel>Author</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`testimonials.${index}.company`}
                              render={({ field }) => (
                                <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                              )}
                            />
                            <FormItem className="md:col-span-2">
                              <FormLabel>Avatar</FormLabel>
                              <div className="flex items-center gap-4">
                                {currentSrc && <Image src={currentSrc} alt={form.getValues(`testimonials.${index}.author`)} width={60} height={60} className="rounded-full bg-muted object-cover" />}
                                <div className="flex-grow">
                                  <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, index)} disabled={isSubmitting} />
                                </div>
                              </div>
                              <FormMessage />
                            </FormItem>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteClick(form.getValues(`testimonials.${index}.id`), index)} className="mt-2">
                          <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null);
          setDialogOpen(open);
        }}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        description="This will permanently delete the testimonial."
        confirmText="Delete"
      />
    </div>
  );
}

