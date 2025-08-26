import type { Service } from '@/modules/services/services.schema';
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
          <p className="text-primary font-semibold tracking-widest uppercase mb-2">What We Do Best</p>
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Creative Solutions for Every Need</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">From concept to completion, we offer a comprehensive suite of services to bring your vision to life. Our team is dedicated to producing high-quality content that resonates with your audience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((service) => {
            const Icon = iconMap[service.icon] || Video;
            return (
              <Card key={service.id} className="text-left shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 rounded-xl p-6">
                <CardHeader className="p-0">
                  <div className="w-16 h-16 mb-4 bg-accent rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4">
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
