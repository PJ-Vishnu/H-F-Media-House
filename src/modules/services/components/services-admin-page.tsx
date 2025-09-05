"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/modules/services/services.schema";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import axios from 'axios';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const servicesSchema = z.object({
  services: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    icon: z.string().min(1, "Icon name is required"),
    image: z.string().min(1, "Image is required"),
  }))
});

export default function ServicesAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; index: number } | null>(null);

  const form = useForm<z.infer<typeof servicesSchema>>({
    resolver: zodResolver(servicesSchema),
    defaultValues: { services: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "services",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/services");
        const fetchedData: Service[] = await res.json();
        form.reset({ services: fetchedData });
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch services" });
      }
    }
    fetchData();
  }, [form, toast]);

  const handleDeleteClick = (id: string, index: number) => {
    setItemToDelete({ id, index });
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await fetch(`/api/services?id=${itemToDelete.id}`, { method: 'DELETE' });
      remove(itemToDelete.index);
      toast({ title: "Service deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete service" });
    } finally {
      setItemToDelete(null);
    }
  };
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(index);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload?section=services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      form.setValue(`services.${index}.image`, res.data.filePath, { shouldDirty: true });
      toast({ title: 'Upload successful' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed' });
    } finally {
      setIsUploading(null);
    }
  };


  const handleSaveAll = async (data: z.infer<typeof servicesSchema>) => {
    setIsSubmitting(true);
    try {
      for (const service of data.services) {
        await fetch(`/api/services?id=${service.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(service),
        });
      }
      toast({ title: "Success!", description: "Services updated successfully." });
      form.reset(data);
    } catch (error) {
      toast({ variant: 'destructive', title: "Failed to save services." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = async () => {
    const newService = {
      title: "New Service",
      description: "A brief description of the new service.",
      icon: "Wand",
      image: `/uploads/services/placeholder.jpg`,
    };
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService),
      });
      if (!res.ok) throw new Error('Failed to add service');
      const addedService = await res.json();
      append(addedService);
      toast({ title: "Service added" });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to add service.' });
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveAll)}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Services</h1>
            <div>
              <Button type="button" onClick={handleAddItem} variant="outline" className="mr-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Service
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save All Changes
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Service Items</CardTitle>
              <CardDescription>Manage the services offered. Remember to save all changes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.length === 0 && !form.formState.isValidating ? (
                  Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
                ) : (
                  fields.map((field, index) => (
                    <div key={field.id} className="flex items-start gap-4 p-4 border rounded-lg bg-background">
                      <div className="flex-grow space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                            control={form.control}
                            name={`services.${index}.title`}
                            render={({ field }) => (
                                <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}
                            />
                            <FormField
                            control={form.control}
                            name={`services.${index}.icon`}
                            render={({ field }) => (
                                <FormItem><FormLabel>Icon Name</FormLabel><FormControl><Input {...field} placeholder="e.g. Camera" /></FormControl><FormMessage /></FormItem>
                            )}
                            />
                          </div>
                        <FormField
                          control={form.control}
                          name={`services.${index}.description`}
                          render={({ field }) => (
                            <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                          )}
                        />
                        <FormField
                            control={form.control}
                            name={`services.${index}.image`}
                            render={({ field: imageField }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <Image src={imageField.value} alt={form.getValues(`services.${index}.title`)} width={100} height={100} className="rounded-md object-cover aspect-square"/>
                                        <div className="flex-grow">
                                            <Input type="file" onChange={(e) => handleFileChange(e, index)} disabled={isUploading === index} />
                                            {isUploading === index && <p className="text-sm mt-1">Uploading...</p>}
                                        </div>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
        description="This will permanently delete the service."
        confirmText="Delete"
      />
    </div>
  );
}
