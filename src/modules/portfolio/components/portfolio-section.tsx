
import { ScrollFadeIn } from '@/components/shared/scroll-fade-in';
import { Skeleton } from '@/components/ui/skeleton';
import { getPortfolioData } from '../portfolio.data';
import { PortfolioList } from './portfolio-list';

export async function PortfolioSection() {
  const data = await getPortfolioData();

  if (!data) {
     return (
      <section id="portfolio" className="w-full py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-10 w-1/3 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
            </div>
             <div className="flex justify-center flex-wrap gap-2 mb-8">
                <Skeleton className="h-10 w-20 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-20 rounded-full" />
             </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Skeleton className="h-[420px] w-full rounded-lg" />
              <Skeleton className="h-[420px] w-full rounded-lg" />
              <Skeleton className="h-[420px] w-full rounded-lg" />
            </div>
        </div>
      </section>
    );
  }
  
  if (data.length === 0) return null;

  const categories = ['All', ...Array.from(new Set(data.map(item => item.category)))];

  return (
    <section id="portfolio" className="w-full py-24 bg-secondary/50">
      <ScrollFadeIn className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-headline text-primary">Our Portfolio</h2>
          <p className="text-lg text-muted-foreground mt-2">A selection of our finest work.</p>
        </div>
        <PortfolioList items={data} categories={categories} />
      </ScrollFadeIn>
    </section>
  );
}
