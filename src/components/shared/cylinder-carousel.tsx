"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import useEmblaCarousel, { type EmblaCarouselType } from 'embla-carousel-react'
import { useIsMobile } from "@/hooks/use-mobile";
import { Carousel as UICarousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

type CarouselProps = {
  images: { src: string; alt: string; "data-ai-hint": string }[];
  className?: string;
};

// =================================================================================================
// 3D Carousel (Desktop)
// =================================================================================================
const CIRCLE_DEGREES = 360;
const TWEEN_FACTOR = 1.2;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);


const DesktopCarousel = ({ images }: { images: CarouselProps['images'] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        containScroll: false,
    })
    const [tweenValues, setTweenValues] = React.useState<number[]>([]);

    const slideCount = images.length;
    const slidesInView = emblaApi?.slidesInView(true).length || 0;
    const getSlideDegree = (slideCount: number) => CIRCLE_DEGREES / slideCount;

    const onScroll = React.useCallback(() => {
        if (!emblaApi) return;

        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();

        const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
            let diffToTarget = scrollSnap - scrollProgress;
            const slidesInSnap = engine.slideRegistry[index];

            slidesInSnap.forEach((slideIndex) => {
            if (diffToTarget > 0) {
                diffToTarget = scrollSnap - (scrollProgress + 1);
            }
            const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
            return numberWithinRange(tweenValue, 0, 1);
            });
            return 0; // Fallback, should not happen
        });
        setTweenValues(styles);
    }, [emblaApi, setTweenValues]);


    React.useEffect(() => {
        if (!emblaApi) return;
        onScroll();
        emblaApi.on('scroll', onScroll);
        emblaApi.on('resize', onScroll);
    }, [emblaApi, onScroll]);

    return (
        <div className="w-full h-full" ref={emblaRef}>
            <div
                className="h-full w-full"
                style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                }}
            >
                {images.map((image, i) => {
                    const slideStyle: React.CSSProperties = {};
                    if(emblaApi) {
                        const degree = getSlideDegree(slideCount);
                        const rotate = degree * i;
                        const scroll = emblaApi.scrollProgress() * (degree * slideCount);
                        const newRotate = rotate - scroll;
                        slideStyle.transform = `rotateY(${newRotate}deg) translateZ(300px)`
                    }
                    
                   return (
                     <div key={i} className="absolute inset-0 w-full h-full" style={slideStyle}>
                       <div
                         className="relative w-full h-full overflow-hidden rounded-xl shadow-2xl"
                         style={{ width: '400px', margin: '0 auto', height: '100%' }}
                       >
                         <Image
                           src={image.src}
                           alt={image.alt}
                           width={600}
                           height={800}
                           data-ai-hint={image["data-ai-hint"]}
                           className="object-cover w-full h-full"
                         />
                       </div>
                     </div>
                   );
                })}
            </div>
        </div>
    )
};


// =================================================================================================
// Standard Carousel (Mobile)
// =================================================================================================
const MobileCarousel = ({ images }: { images: CarouselProps['images'] }) => {
    return (
        <UICarousel
            opts={{
                align: "start",
                loop: true,
            }}
            className="w-full"
        >
            <CarouselContent className="-ml-4">
                {images.map((image, index) => (
                    <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/3">
                        <div className="p-1 h-[400px]">
                             <Image
                                src={image.src}
                                alt={image.alt}
                                width={600}
                                height={800}
                                data-ai-hint={image["data-ai-hint"]}
                                className="object-cover w-full h-full rounded-xl shadow-2xl"
                                />
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </UICarousel>
    )
}

// =================================================================================================
// Main Component
// =================================================================================================
export function Carousel({ images, className }: CarouselProps) {
    const isMobile = useIsMobile();
    
    return (
        <div
            className={cn(
                "relative w-full h-[400px] overflow-hidden group",
                className
            )}
        >
            { isMobile ? <MobileCarousel images={images} /> : <DesktopCarousel images={images} /> }
        </div>
    )
}