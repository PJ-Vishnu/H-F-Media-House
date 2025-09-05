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

export default function VideoAdminPage() {
  const { toast } = useToast();
  const [data, setData] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);


  const form = useForm<z.infer<typeof videoSchema>>({
    resolver: zodResolver(videoSchema),
  });

  const videoType = form.watch("videoType");

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, isVideo: boolean) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', file);

    const fieldToUpdate = isVideo ? 'videoUrl' : 'videoThumbnail';
    const section = isVideo ? 'video-files' : 'video-thumbnails';

    try {
      const res = await axios.post(`/api/upload?section=${section}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });
      form.setValue(fieldToUpdate, res.data.filePath, { shouldDirty: true });
      toast({ title: `${isVideo ? 'Video' : 'Thumbnail'} upload successful` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof videoSchema>) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/video", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Failed to save data");
      
      toast({ title: "Success!", description: "Video section updated." });
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Manage Video Section</h1>
            <Button type="submit" disabled={isLoading || isUploading}>
              {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                        defaultValue={field.value}
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
                        <FormControl><Input placeholder="https://www.youtube.com/embed/..." {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              )}

              {videoType === 'upload' && (
                 <>
                    <FormField
                        control={form.control}
                        name="videoUrl"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload Video File</FormLabel>
                            <FormControl>
                            <Input 
                                type="file" 
                                accept="video/*" 
                                onChange={(e) => handleFileChange(e, true)}
                                disabled={isUploading}
                            />
                            </FormControl>
                            {isUploading && (
                              <div className="flex items-center mt-2 text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                <span>Uploading... ({uploadProgress}%)</span>
                              </div>
                            )}
                            {field.value && !isUploading && <p className="text-sm text-muted-foreground mt-2">Current file: {field.value}</p>}
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="videoThumbnail"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Video Thumbnail</FormLabel>
                             <FormControl>
                                <div>
                                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, false)} className="mb-2" disabled={isUploading}/>
                                    {isUploading && field.name === 'videoThumbnail' && (
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <span>Uploading...</span>
                                      </div>
                                    )}
                                    {field.value && <Image src={field.value} alt="Preview" width={192} height={108} className="w-48 h-auto mt-2 rounded-md object-cover" />}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                 </>
              )}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
