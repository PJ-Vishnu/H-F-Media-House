
import Image from "next/image";
import { ScrollFadeIn } from "@/components/shared/scroll-fade-in";
import { Skeleton } from '@/components/ui/skeleton';
import { getAboutData } from "../about.data";
import { AboutCarousel } from "./about-carousel";

export async function AboutSection() {
  const data = await getAboutData();

  if (!data) {
    return (
      <section id="about" className="w-full py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <Skeleton className="h-6 w-1/3 mx-auto mb-2" />
              <Skeleton className="h-10 w-2/3 mx-auto mb-6" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-5/6 mx-auto" />
            </div>
            <Skeleton className="w-full h-[500px] rounded-3xl" />
        </div>
      </section>
    );
  }

  const hasFeatures = data.features && Array.isArray(data.features) && data.features.length > 0;

  return (
    <section id="about" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">
            Passion. Creativity. Precision.
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
            {data.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {data.content}
          </p>
        </div>

        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          {data.imageUrl && (
            <Image
              src={data.imageUrl}
              alt="About H&F Media House"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          )}
          
          {hasFeatures && (
            <AboutCarousel features={data.features} />
          )}
        </div>
      </ScrollFadeIn>
    </section>
  );
}
