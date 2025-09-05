"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import type { GalleryImage } from "@/modules/gallery/gallery.schema";
import { GripVertical, PlusCircle, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import axios from 'axios';


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmationDialog } from "@/components/admin/confirmation-dialog";
import { Input } from "@/components/ui/input";

export default function GalleryAdminPage() {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[] | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const fetchedData: GalleryImage[] = await res.json();
      setImages(fetchedData);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to fetch gallery" });
    }
  }, [toast]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!imageToDelete) return;
    try {
      await fetch(`/api/gallery?id=${imageToDelete}`, { method: 'DELETE' });
      setImages(prev => prev?.filter(img => img.id !== imageToDelete) || null);
      toast({ title: "Image deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to delete image" });
    } finally {
      setImageToDelete(null);
    }
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    if (!images) return;
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setImages(newImages);
  };

  const handleSaveOrder = async () => {
    if (!images) return;
    setIsSavingOrder(true);
    try {
        const orderedIds = images.map(img => img.id);
        const res = await fetch('/api/gallery/reorder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds })
        });
        if (!res.ok) throw new Error("Failed to save order");
        const updatedImages = await res.json();
        setImages(updatedImages);
        toast({ title: "Success!", description: "Gallery order saved." });
    } catch (error) {
        toast({ variant: 'destructive', title: "Failed to save order." });
    } finally {
        setIsSavingOrder(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/upload?section=gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newImage = {
        src: res.data.filePath,
        alt: "New uploaded image",
        'data-ai-hint': 'uploaded image',
      };
      const addRes = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage),
      });
      if(!addRes.ok) throw new Error('Failed to save image reference');
      fetchGallery();
      toast({ title: "Image uploaded and added" });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Upload failed' });
    } finally {
        setIsUploading(false);
    }
  };

  const debouncedUpdateAltText = useDebouncedCallback(async (id: string, alt: string) => {
    try {
        const res = await fetch(`/api/gallery?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ alt })
        });
        if (!res.ok) throw new Error("Failed to update alt text");
        toast({ title: 'Alt text updated' });
    } catch (error) {
        toast({ variant: 'destructive', title: "Failed to update alt text" });
    }
  }, 500);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Gallery</h1>
        <div>
            <Button onClick={handleSaveOrder} disabled={isSavingOrder}>
                {isSavingOrder && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Order
            </Button>
        </div>
      </div>
      <Card className="mb-6">
        <CardHeader>
            <CardTitle>Upload New Image</CardTitle>
            <CardDescription>Upload a new image to add to the gallery.</CardDescription>
        </CardHeader>
        <CardContent>
            <Input type="file" onChange={handleFileChange} disabled={isUploading} />
            {isUploading && (
                <div className="flex items-center mt-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Uploading...</span>
                </div>
            )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>Use arrows to reorder images. Changes to alt text are saved automatically.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!images ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : (
              images.map((image, index) => (
                <div key={image.id} className="flex items-center gap-4 p-2 border rounded-lg bg-background">
                  <div className="flex flex-col">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveImage(index, 'up')} disabled={index === 0}>
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1}>
                        <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative h-20 w-32 rounded-md overflow-hidden flex-shrink-0">
                    <Image src={image.src} alt={image.alt} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <Input 
                      defaultValue={image.alt}
                      onChange={(e) => debouncedUpdateAltText(image.id, e.target.value)}
                      className="border-0 focus-visible:ring-1" 
                      placeholder="Image alt text" 
                    />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(image.id)}>
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
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
