
"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@/modules/services/services.schema";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import axios from "axios";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const servicesSchema = z.object({
  services: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      icon: z.string().min(1, "Icon name is required"),
      image: z.string().optional(),
    })
  ),
});

type StagedFile = {
  index: number;
  file: File;
};

export default function ServicesAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const form = useForm<z.infer<typeof servicesSchema>>({
    resolver: zodResolver(servicesSchema),
    defaultValues: { services: [] },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "services",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/services");
      if (!res.ok) throw new Error("Failed to fetch");
      const fetchedData: Service[] = await res.json();
      form.reset({ services: fetchedData });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch services" });
    } finally {
      setIsLoading(false);
    }
  }, [form, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteClick = (id: string, index: number) => {
    setItemToDelete({ id, index });
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await fetch(`/api/services?id=${itemToDelete.id}`, { method: "DELETE" });
      remove(itemToDelete.index);
      toast({ title: "Service deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete service" });
    } finally {
      setDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      const currentServices = form.getValues("services");
      update(index, { ...currentServices[index], image: previewUrl });
      
      setStagedFiles(prev => {
        const others = prev.filter(f => f.index !== index);
        return [...others, { index, file }];
      });
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("section", "services");
    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.filePath;
    } catch (error) {
      toast({ variant: "destructive", title: "Upload failed" });
      return null;
    }
  };

  const handleSaveAll = async (data: z.infer<typeof servicesSchema>) => {
    setIsSubmitting(true);
    let submissionValues = { ...data };

    try {
      if (stagedFiles.length > 0) {
        const uploadPromises = stagedFiles.map((sf) => uploadFile(sf.file));
        const uploadedPaths = await Promise.all(uploadPromises);

        stagedFiles.forEach((sf, i) => {
          const newPath = uploadedPaths[i];
          if (newPath) {
            submissionValues.services[sf.index].image = newPath;
          } else {
            throw new Error(
              `Upload failed for service: ${submissionValues.services[sf.index].title}`
            );
          }
        });
      }

      for (const service of submissionValues.services) {
        const { id, ...serviceData } = service;
        await fetch(`/api/services?id=${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });
      }
      toast({
        title: "Success!",
        description: "Services updated successfully.",
      });
      form.reset({ services: submissionValues.services });
      setStagedFiles([]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save services.",
        description:
          error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddItem = async () => {
    const newServiceData = {
      title: "New Service",
      description: "A brief description of the new service.",
      icon: "Wand",
      image: "",
    };
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newServiceData),
      });
      if (!res.ok) throw new Error("Failed to add service");
      const addedService = await res.json();
      append(addedService);
      toast({ title: "Service added" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to add service." });
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveAll)}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Services</h1>
            <div>
              <Button
                type="button"
                onClick={handleAddItem}
                variant="outline"
                className="mr-2"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Service
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isDirty}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save All Changes
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Service Items</CardTitle>
              <CardDescription>
                Manage the services offered. Remember to save all changes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.length === 0 ? (
                  <p className="text-muted-foreground itaic p-4 text-center">No services found. Add one to get started.</p>
                ) : (
                  fields.map((field, index) => {
                    const currentSrc = form.watch(`services.${index}.image`);
                    return (
                      <div
                        key={field.id}
                        className="flex items-start gap-4 p-4 border rounded-lg bg-background"
                      >
                        <div className="flex-grow space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name={`services.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Title</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`services.${index}.icon`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Icon Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      placeholder="e.g. Camera"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name={`services.${index}.description`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea rows={3} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormItem>
                            <FormLabel>Image</FormLabel>
                            <div className="flex items-center gap-4">
                              {currentSrc ? (
                                <Image
                                  src={currentSrc}
                                  alt={form.getValues(
                                    `services.${index}.title`
                                  )}
                                  width={100}
                                  height={100}
                                  className="rounded-md object-cover aspect-square bg-muted"
                                />
                              ) : (
                                <div className="w-[100px] h-[100px] bg-muted rounded-md flex items-center justify-center text-muted-foreground text-xs">
                                  No Image
                                </div>
                              )}
                              <div className="flex-grow">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) =>
                                    handleFileChange(e, index)
                                  }
                                  disabled={isSubmitting}
                                />
                              </div>
                            </div>
                            <FormMessage />
                          </FormItem>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleDeleteClick(field.id, index)
                          }
                          className="mt-2"
                        >
                          <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                      </div>
                    );
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
        description="This will permanently delete the service."
        confirmText="Delete"
      />
    </div>
  );
}

    