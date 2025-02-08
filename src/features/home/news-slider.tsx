'use client';

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

  const { data, isLoading, refetch, isError } = useQuery({
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
          <TriangleAlert className="size-4 text-gray-400" />
          <p className="text-[15px] text-gray-400">No news available.</p>
        </div>
        <Button size="icon-sm" onClick={() => refetch()}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <Carousel className="motion-preset-slide-down-sm">
      <CarouselContent className="h-[105px] sm:h-[120px]">
        {data.map((news) => (
          <CarouselItem key={news.url} className="relative overflow-hidden">
            <div className="h-full w-full">
              <Image
                alt={news.url}
                src={news.image}
                className="light:brightness-[0.4] h-full w-full rounded-lg object-cover opacity-80 dark:opacity-40"
                referrerPolicy="no-referrer"
                width={800}
                height={125}
                priority
              />
            </div>
            <div className="absolute top-0 flex h-full flex-col justify-between p-3 px-14">
              <div>
                <h3 className="text-md line-clamp-1 font-semibold text-white sm:text-lg dark:text-gray-200">
                  {news.title}
                </h3>
                <p className="line-clamp-2 text-xs text-white sm:text-sm dark:text-gray-300">
                  {news.text}
                </p>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <p className="text-sm font-medium text-white dark:text-gray-300">
                  {format(news.publishedDate, "MMM do, yyyy 'at' h:mm a")}
                </p>
                <Link
                  href={news.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[13px] text-white hover:underline dark:text-gray-300"
                >
                  Read More
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
