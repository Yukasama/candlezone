'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { getNews } from '@/lib/fmp/info/get-news';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { RotateCcw, TriangleAlert } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export const NewsSlider = () => {
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  const { data, isError, isLoading, refetch } = useQuery({
    queryFn: getNews,
    queryKey: ['get-news'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextButtonRef.current) {
        nextButtonRef.current.click();
      }
    }, 15000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <Skeleton className="flex h-[105px] items-center justify-center rounded-lg sm:h-[120px]" />
    );
  }

  if (isError || !data || data.length === 0) {
    return (
      <div className="flex h-[105px] flex-col items-center justify-center gap-2 rounded-lg sm:h-[120px]">
        <div className="flex items-center gap-1">
          <TriangleAlert className="text-desc size-4" />
          <p className="text-desc text-[15px]">No news available.</p>
        </div>
        <Button onClick={() => refetch()} size="icon-sm">
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <Carousel className="motion-preset-slide-down-sm">
      <CarouselContent className="h-[105px] sm:h-[120px]">
        {data.map(({ image, publishedDate, text, title, url }) => (
          <CarouselItem className="relative overflow-hidden" key={url}>
            <div className="h-full w-full">
              <Image
                alt={title}
                className="light:brightness-[0.4] h-full w-full rounded-lg object-cover opacity-80 dark:opacity-40"
                height={125}
                priority
                referrerPolicy="no-referrer"
                src={image}
                width={800}
              />
            </div>
            <div className="absolute top-0 flex h-full flex-col justify-between gap-1.5 p-3 px-[52px]">
              <div className="space-y-0.5">
                <strong className="text-md line-clamp-1 rounded-md bg-black/40 px-2 text-start font-semibold text-white sm:text-lg dark:text-gray-200">
                  {title.trim()}
                </strong>
                <p className="line-clamp-2 rounded-md bg-black/40 px-2 text-xs text-white sm:text-sm dark:text-gray-300">
                  {text}
                </p>
              </div>
              <div className="flex items-center gap-2.5 px-2">
                <Badge>
                  {format(publishedDate, "MMM do, yyyy 'at' h:mm a")}
                </Badge>
                <Link
                  className="mt-0.5 text-xs text-white hover:underline dark:text-gray-300"
                  href={url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Read more about this article
                </Link>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext ref={nextButtonRef} />
    </Carousel>
  );
};
