"use client";

import { useEffect, useState } from "react";
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

export default function TestimonialsAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; index: number } | null>(null);

  const form = useForm<z.infer<typeof testimonialsSchema>>({
    resolver: zodResolver(testimonialsSchema),
    defaultValues: { testimonials: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testimonials",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/testimonials");
        const fetchedData: Testimonial[] = await res.json();
        form.reset({ testimonials: fetchedData });
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch testimonials" });
      }
    }
    fetchData();
  }, [form, toast]);

  const handleDeleteClick = (id: string, index: number) => {
    setItemToDelete({ id, index });
    setDialogOpen(true);
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(index);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload?section=testimonials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      form.setValue(`testimonials.${index}.avatar`, res.data.filePath, { shouldDirty: true });
      toast({ title: 'Avatar upload successful' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed' });
    } finally {
      setIsUploading(null);
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
      setItemToDelete(null);
    }
  };

  const handleSaveAll = async (data: z.infer<typeof testimonialsSchema>) => {
    setIsSubmitting(true);
    try {
      for (const testimonial of data.testimonials) {
        const { id, ...testimonialData } = testimonial;
        await fetch(`/api/testimonials?id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testimonialData),
        });
      }
      toast({ title: "Success!", description: "Testimonials updated successfully." });
      form.reset(data);
    } catch (error) {
      toast({ variant: 'destructive', title: "Failed to save testimonials." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = async () => {
    const newTestimonial = {
      quote: "A new fantastic testimonial about our services.",
      author: "New Client",
      company: "Client's Company",
      avatar: '/uploads/testimonials/placeholder.png'
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
                  fields.map((field, index) => (
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
                             <FormField
                                control={form.control}
                                name={`testimonials.${index}.avatar`}
                                render={({ field: avatarField }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Avatar</FormLabel>
                                        <div className="flex items-center gap-4">
                                            <Image src={avatarField.value || `https://i.pravatar.cc/150?u=${form.getValues(`testimonials.${index}.author`)}`} alt={form.getValues(`testimonials.${index}.author`)} width={60} height={60} className="rounded-full bg-muted object-cover"/>
                                            <div className="flex-grow">
                                                <Input type="file" onChange={(e) => handleFileChange(e, index)} disabled={isUploading === index}/>
                                                {isUploading === index && <p className="text-sm mt-1">Uploading...</p>}
                                            </div>
                                        </div>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                             />
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteClick(field.id, index)} className="mt-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <ConfirmationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Are you sure?"
        description="This will permanently delete the testimonial."
        confirmText="Delete"
      />
    </div>
  );
}
