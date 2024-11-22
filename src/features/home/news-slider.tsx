'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { NewsItem } from '@/lib/fmp/types/info';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface Props {
  newsData?: NewsItem[];
}

export const NewsSlider = ({ newsData }: Props) => {
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (nextButtonRef.current) {
        nextButtonRef.current.click();
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  if (!newsData) {
    return (
      <div className="f-box h-[105px] sm:h-[120px]">
        <p className="text-gray-400">No news available.</p>
      </div>
    );
  }

  return (
    <Carousel className="motion-preset-slide-down-sm">
      <CarouselContent className="h-[105px] sm:h-[120px]">
        {newsData?.map((news) => (
          <CarouselItem key={news.url} className="relative overflow-hidden">
            <div className="h-full w-full">
              <Image
                alt={news.url}
                src={news.image}
                className="h-full w-full rounded-lg object-cover opacity-40"
                referrerPolicy="no-referrer"
                width={800}
                height={125}
              />
            </div>
            <div className="f-col absolute top-0 h-full justify-between p-3 px-14">
              <div>
                <h3 className="text-md line-clamp-1 font-semibold text-gray-500 dark:text-gray-200 sm:text-lg">
                  {news.title}
                </h3>
                <p className="line-clamp-2 text-xs text-gray-400 dark:text-gray-300 sm:text-sm">
                  {news.text}
                </p>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <p className="text-sm font-medium text-gray-400 dark:text-gray-300">
                  {format(news.publishedDate, "MMM do, yyyy 'at' h:mm a")}
                </p>
                <Link
                  href={news.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-400 hover:underline"
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
