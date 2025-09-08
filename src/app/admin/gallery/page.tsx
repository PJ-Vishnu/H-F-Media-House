
"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { GalleryImage } from "@/modules/gallery/gallery.schema";
import { GripVertical, PlusCircle, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Form } from "@/components/ui/form";


const gallerySchema = z.object({
  images: z.array(z.object({
    id: z.string(),
    src: z.string().min(1, "Image source is required"),
    alt: z.string().min(1, "Alt text is required"),
    order: z.number(),
    colSpan: z.number().optional(),
    rowSpan: z.number().optional(),
  }))
});

type StagedFile = {
  index: number;
  file: File;
  preview: string;
};


export default function GalleryAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; index: number } | null>(null);

  const form = useForm<z.infer<typeof gallerySchema>>({
    resolver: zodResolver(gallerySchema),
    defaultValues: { images: [] },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "images"
  });

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const fetchedData: GalleryImage[] = await res.json();
      form.reset({ images: fetchedData });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch gallery" });
    }
  }, [form, toast]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);
  
  const handleDeleteClick = (id: string, index: number) => {
    setItemToDelete({id, index});
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await fetch(`/api/gallery?id=${itemToDelete.id}`, { method: 'DELETE' });
      remove(itemToDelete.index);
      toast({ title: "Image deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete image" });
    } finally {
      setItemToDelete(null);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', 'gallery');
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

  const handleSaveAll = async (data: z.infer<typeof gallerySchema>) => {
    setIsSubmitting(true);
    let updatedItems = [...data.images];

    try {
      if (stagedFiles.length > 0) {
        const uploadPromises = stagedFiles.map(sf => uploadFile(sf.file));
        const uploadedPaths = await Promise.all(uploadPromises);

        stagedFiles.forEach((sf, i) => {
          const newPath = uploadedPaths[i];
          if (newPath) {
            updatedItems[sf.index].src = newPath;
          } else {
            throw new Error(`Upload failed for an image.`);
          }
        });
      }

      const finalItems = updatedItems.map((item, index) => ({...item, order: index + 1 }));

      await fetch('/api/gallery/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds: finalItems.map(item => item.id) })
      });

      for (const item of finalItems) {
        await fetch(`/api/gallery?id=${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });
      }

      toast({ title: "Success!", description: "Gallery updated successfully." });
      form.reset({ images: finalItems });
      setStagedFiles([]);

    } catch (error) {
      toast({ variant: 'destructive', title: "Failed to save gallery.", description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const newImageUrl = await uploadFile(file);
      if (!newImageUrl) throw new Error("Upload failed");

      const newImage = {
        src: newImageUrl,
        alt: "New uploaded image",
        colSpan: 1,
        rowSpan: 1,
      };

      const addRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage),
      });

      if(!addRes.ok) throw new Error('Failed to save image reference');
      
      const addedItem = await addRes.json();
      append(addedItem);
      toast({ title: "Image uploaded and added" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Upload failed' });
    } finally {
        setIsUploading(false);
    }
  };


  return (
    <div>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveAll)}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Gallery</h1>
            <div>
                <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
          </div>
          <Card className="mb-6">
            <CardHeader>
                <CardTitle>Upload New Image</CardTitle>
                <CardDescription>Upload a new image to add to the gallery. It will be added to the end of the list. Remember to save changes after uploading.</CardDescription>
            </CardHeader>
            <CardContent>
                <Input type="file" onChange={handleFileChange} disabled={isUploading} />
                {isUploading && (
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Uploading...</span>
                    </div>
                )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
              <CardDescription>Drag to reorder images. Changes to alt text and layout are saved automatically.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!form.formState.isValidating && fields.length === 0 ? (
                  <p>No images in the gallery. Upload one to get started.</p>
                ) : (
                  fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-4 p-4 border rounded-lg bg-background">
                      <div className="flex flex-col items-center">
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(index, index - 1)} disabled={index === 0}>
                            <ArrowUp className="h-4 w-4" />
                        </Button>
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => move(index, index + 1)} disabled={index === fields.length - 1}>
                            <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="relative h-20 w-32 rounded-md overflow-hidden flex-shrink-0">
                        <Image src={form.watch(`images.${index}.src`)} alt={form.watch(`images.${index}.alt`)} fill className="object-cover" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <Label htmlFor={`alt-${field.id}`}>Alt Text</Label>
                        <Input
                          id={`alt-${field.id}`}
                          {...form.register(`images.${index}.alt`)}
                          className="border-input focus-visible:ring-1" 
                          placeholder="Image alt text" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Column Span</Label>
                        <Select
                          value={String(form.watch(`images.${index}.colSpan`) || 1)}
                          onValueChange={(value) => {
                            form.setValue(`images.${index}.colSpan`, parseInt(value), { shouldDirty: true });
                          }}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Cols" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Row Span</Label>
                         <Select
                           value={String(form.watch(`images.${index}.rowSpan`) || 1)}
                           onValueChange={(value) => {
                             form.setValue(`images.${index}.rowSpan`, parseInt(value), { shouldDirty: true });
                           }}
                        >
                          <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Rows" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteClick(field.id, index)} className="self-center">
                        <Trash2 className="h-5 w-5 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
                 {form.formState.isValidating && fields.length === 0 && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
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
        description="This action cannot be undone. This will permanently delete the image."
        confirmText="Delete"
      />
    </div>
  );
}
