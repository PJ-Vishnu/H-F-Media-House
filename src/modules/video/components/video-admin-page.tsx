"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { VideoData } from "@/modules/video/video.schema";
import { Loader2 } from "lucide-react";
import axios from 'axios';
import Image from 'next/image';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  videoType: z.enum(["youtube", "upload"]).optional(),
  videoUrl: z.string().optional(),
  videoThumbnail: z.string().optional(),
});

type StagedFiles = {
  video?: { file: File, preview?: string };
  thumbnail?: { file: File, preview: string };
}

export default function VideoAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFiles>({});
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
  });

  const videoType = form.watch("videoType");
  const thumbnailPreview = stagedFiles.thumbnail?.preview || form.watch('videoThumbnail');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/video");
        const fetchedData: VideoData = await res.json();
        setData(fetchedData);
        form.reset(fetchedData);
      } catch (error) {
        toast({ variant: "destructive", title: "Failed to fetch data" });
      }
    }
    fetchData();
  }, [form, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'video' | 'thumbnail') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (fileType === 'thumbnail') {
        const reader = new FileReader();
        reader.onload = (e) => {
            setStagedFiles(prev => ({ ...prev, thumbnail: { file, preview: e.target?.result as string }}));
            form.setValue('videoThumbnail', e.target?.result as string, { shouldDirty: true });
        };
        reader.readAsDataURL(file);
    } else {
        setStagedFiles(prev => ({ ...prev, video: { file }}));
        form.setValue('videoUrl', 'new-file-staged', { shouldDirty: true });
    }
  };

  const uploadFile = async (file: File, section: string, onProgress?: (percent: number) => void): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', section); // Add section to form data
    try {
      const res = await axios.post(`/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                if (onProgress) onProgress(percentCompleted);
            }
        }
      });
      return res.data.filePath;
    } catch (error) {
      toast({ variant: 'destructive', title: `Upload failed for ${section}` });
      return null;
    }
  };

  async function onSubmit(values: z.infer<typeof videoSchema>) {
    setIsLoading(true);
    let updatedValues = { ...values };

    try {
      if (stagedFiles.thumbnail) {
        const newThumbnailUrl = await uploadFile(stagedFiles.thumbnail.file, 'video-thumbnails');
        if (newThumbnailUrl) updatedValues.videoThumbnail = newThumbnailUrl;
        else throw new Error("Thumbnail upload failed.");
      }
      if (stagedFiles.video) {
        const newVideoUrl = await uploadFile(stagedFiles.video.file, 'video-files', setUploadProgress);
        if (newVideoUrl) updatedValues.videoUrl = newVideoUrl;
        else throw new Error("Video upload failed.");
      }

      const res = await fetch("/api/video", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedValues),
      });

      if (!res.ok) throw new Error("Failed to save data");
      
      const savedData = await res.json();
      toast({ title: "Success!", description: "Video section updated." });
      form.reset(savedData);
      setStagedFiles({});
      setUploadProgress(0);

    } catch (error) {
      toast({ variant: "destructive", title: "Save Failed", description: error instanceof Error ? error.message : "Unknown error" });
    } finally {
      setIsLoading(false);
    }
  }

  if (!data) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Video Section</h1>
            <Button type="submit" disabled={isLoading || !form.formState.isDirty}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>

           <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Update the title and description for the video section.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                  <FormItem><FormLabel>Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Video Player</CardTitle>
              <CardDescription>Configure the video player.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="videoType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Video Source</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="youtube" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            YouTube
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="upload" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Upload Video
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {videoType === 'youtube' && (
                 <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube Embed URL</FormLabel>
                        <FormControl><Input placeholder="https://www.youtube.com/embed/..." {...field} value={field.value || ''} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}

              {videoType === 'upload' && (
                 <>
                    <FormItem>
                        <FormLabel>Upload Video File</FormLabel>
                        <FormControl>
                        <Input 
                            type="file" 
                            accept="video/*" 
                            onChange={(e) => handleFileChange(e, 'video')}
                            disabled={isLoading}
                        />
                        </FormControl>
                        {isLoading && stagedFiles.video && (
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <span>Uploading Video... ({uploadProgress}%)</span>
                          </div>
                        )}
                        {form.getValues('videoUrl') && !stagedFiles.video && <p className="text-sm text-muted-foreground mt-2">Current file: {form.getValues('videoUrl')}</p>}
                        {stagedFiles.video && <p className="text-sm text-muted-foreground mt-2">New file staged: {stagedFiles.video.file.name}</p>}
                        <FormMessage />
                    </FormItem>

                    <FormItem>
                        <FormLabel>Video Thumbnail</FormLabel>
                            <FormControl>
                            <div>
                                <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'thumbnail')} className="mb-2" disabled={isLoading}/>
                                {thumbnailPreview && <Image src={thumbnailPreview} alt="Preview" width={192} height={108} className="w-48 h-auto mt-2 rounded-md object-cover bg-muted" />}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                 </>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
