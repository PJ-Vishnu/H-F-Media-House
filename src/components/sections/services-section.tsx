import type { Service } from '@/lib/definitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Camera, Video, Wand, BrainCircuit } from 'lucide-react';

type ServicesSectionProps = {
  data: Service[];
};

const iconMap: { [key: string]: React.ElementType } = {
  Video: Video,
  Camera: Camera,
  Wand: Wand,
  BrainCircuit: BrainCircuit,
};

export function ServicesSection({ data }: ServicesSectionProps) {
  return (
    <section id="services" className="w-full py-24 bg-background">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">What We Do</h2>
          <p className="text-lg text-muted-foreground mt-2">Our comprehensive suite of creative services.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((service) => {
            const Icon = iconMap[service.icon] || Video;
            return (
              <Card key={service.id} className="text-center shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-accent/50">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 mb-4 bg-accent/50 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-accent-foreground" />
                  </div>
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollFadeIn>
    </section>
  );
}
