export type VideoData = {
  title: string;
  description: string;
  videoType?: 'youtube' | 'upload';
  videoUrl?: string;
  videoThumbnail?: string;
};
