import Image from "next/image";
import type { Service } from "@/modules/services/services.schema";
import { ScrollFadeIn } from "@/components/shared/scroll-fade-in";

type ServicesSectionProps = {
  data: Service[];
};

export function ServicesSection({ data }: ServicesSectionProps) {
  return (
    <section id="services" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        {/* Section heading */}
        <div className="text-center mb-12">
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">
            What We Do Best
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">
            Creative Solutions for Every Need
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            From personal celebrations to professional campaigns, we specialize
            in delivering stunning visuals that highlight every moment, every
            story, and every brand.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((service) => (
            <div
              key={service.id}
              className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Background Image */}
              {service?.image && (
                <Image
                  src={service?.image}
                  alt={service.title}
                  fill
                  style={{objectFit: 'cover'}}
                />
              )}

              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 w-full bg-black/60 text-white p-6 backdrop-blur-sm">
                <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollFadeIn>
    </section>
  );
}
