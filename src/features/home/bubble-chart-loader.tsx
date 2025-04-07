import { Skeleton } from '@/components/ui/skeleton';

export const BubbleChartLoader = () => {
  return (
    <div className="w-full space-y-2 lg:h-full">
      <div
        className="relative h-[690px] w-full overflow-hidden rounded-xl border"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(100,100,100,0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(100,100,100,0.12) 1px, transparent 1px)
          `,
          backgroundSize: '70px 70px',
          boxShadow: 'inset 0 0 70px 50px rgba(0,0,0,0.02)',
        }}
      >
        {/* Top filters and labels */}
        <div className="absolute top-0 right-3 left-0 z-10 flex justify-between">
          <Skeleton className="bg-background/90 m-3 flex h-7 w-24 rounded-md" />
          <Skeleton className="bg-background/90 m-2 flex h-16 w-32 flex-col items-center rounded-md" />
          <Skeleton className="bg-background/90 m-3 h-7 w-24 rounded-md" />
        </div>

        {/* Up/down percentage indicators */}
        <Skeleton className="bg-background/90 absolute top-14 left-4 h-6 w-16 rounded-md" />
        <Skeleton className="bg-background/90 absolute bottom-4 left-4 h-6 w-16 rounded-md" />

        {/* Filter selectors */}
        <div className="absolute right-4 bottom-4 z-10 space-y-2">
          <Skeleton className="bg-background/90 h-16 w-28 rounded-md" />
          <Skeleton className="bg-background/90 h-16 w-28 rounded-md" />
        </div>

        {/* Dashed horizontal center line */}
        <Skeleton className="border-muted-foreground/30 absolute top-1/2 right-5 left-5 z-10 border-t border-dashed" />

        {/* Placeholder bubbles */}
        <Skeleton className="absolute top-[25%] left-[20%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[40%] left-[45%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[60%] left-[30%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[35%] left-[65%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[70%] left-[55%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[55%] left-[75%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[20%] left-[35%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[65%] left-[25%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[30%] left-[80%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[75%] left-[70%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[15%] left-[10%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[85%] left-[15%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[45%] left-[22%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[28%] left-[52%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[78%] left-[40%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[10%] left-[60%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[50%] left-[8%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[12%] left-[85%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[90%] left-[85%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[80%] left-[30%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[20%] left-[72%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[55%] left-[42%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[38%] left-[88%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[67%] left-[62%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[42%] left-[15%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[33%] left-[28%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[82%] left-[58%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[25%] left-[90%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[48%] left-[68%] h-[70px] w-[70px] rounded-full" />
        <Skeleton className="absolute top-[18%] left-[48%] h-[70px] w-[70px] rounded-full" />
      </div>

      {/* Sector badges */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton className="h-8 w-20 rounded-full" key={i} />
        ))}
      </div>
    </div>
  );
};
