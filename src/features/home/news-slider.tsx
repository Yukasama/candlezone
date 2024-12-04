'use client';

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
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export const NewsSlider = () => {
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  const { data, isFetched } = useQuery({
    queryFn: getNews,
    queryKey: ['get-news'],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextButtonRef.current) {
        nextButtonRef.current.click();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!isFetched) {
    return <Skeleton className="f-box h-[105px] rounded-lg sm:h-[120px]" />;
  }

  if (!data && isFetched) {
    return (
      <div className="f-box h-[105px] sm:h-[120px]">
        <p className="text-gray-400">No news available.</p>
      </div>
    );
  }

  return (
    <Carousel className="motion-preset-slide-down-sm">
      <CarouselContent className="h-[105px] sm:h-[120px]">
        {data?.map((news) => (
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
            <div className="f-col absolute top-0 h-full justify-between p-3 px-14">
              <div>
                <h3 className="text-md line-clamp-1 font-semibold text-white dark:text-gray-200 sm:text-lg">
                  {news.title}
                </h3>
                <p className="line-clamp-2 text-xs text-white dark:text-gray-300 sm:text-sm">
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
