
import Image from "next/image";
import type { AboutData } from "@/modules/about/about.schema";
import { ScrollFadeIn } from "@/components/shared/scroll-fade-in";

type AboutSectionProps = {
  data: AboutData;
};

export function AboutSection({ data }: AboutSectionProps) {
  const hasFeatures = data.features && data.features.length > 0;
  
  return (
    <section id="about" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        {/* Section heading */}
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

        {/* Full-width image with overlayed cards */}
        <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl">
          {data.imageUrl && (
            <Image
              src={data.imageUrl}
              alt="About H&F Media House"
              fill
              priority
              className="object-cover"
            />
          )}
          
          {hasFeatures && (
            <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-end md:justify-center p-4 md:p-6 gap-4 md:gap-6">
                {(data.features || []).map((feature, i) => (
                    <div
                        key={i}
                        className="bg-black/60 text-white rounded-xl p-6 w-full max-w-xs md:max-w-sm h-auto md:h-1/2 backdrop-blur-sm flex flex-col"
                    >
                        <h3 className="text-lg font-semibold mb-2">
                        {feature.title}
                        </h3>
                        <p className="text-sm leading-relaxed">
                        {feature.description}
                        </p>
                    </div>
                ))}
            </div>
          )}
        </div>
      </ScrollFadeIn>
    </section>
  );
}
