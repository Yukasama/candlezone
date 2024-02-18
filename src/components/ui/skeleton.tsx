import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoaded?: boolean;
  children?: React.ReactNode;
}

export default function Skeleton({
  isLoaded,
  children,
  className,
  ...props
}: Props) {
  return (
    <div className="relative">
      {!isLoaded && (
        <div
          className={cn(
            "animate-pulse-right absolute inset-0 rounded-md",
            className
          )}
        />
      )}
      <div className={`${!isLoaded && "invisible"}`} {...props}>
        {children}
      </div>
    </div>
  );
}

export function SkeletonText({ count = 2 }: { count?: number }) {
  return (
    <div className="f-col gap-1">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i}>
          <div className="h-4 w-[200px]"></div>
        </Skeleton>
      ))}
    </div>
  );
}

export function SkeletonInput() {
  return (
    <Skeleton>
      <div className="h-7 w-[200px]"></div>
    </Skeleton>
  );
}

export function SkeletonButton({
  isIconOnly = false,
}: {
  isIconOnly?: boolean;
}) {
  return (
    <Skeleton>
      <div className={`${isIconOnly ? "h-8 w-8" : "h-10 w-20"} rounded-3xl`} />
    </Skeleton>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-12 min-w-[300px] w-full"></Skeleton>
      ))}
    </div>
  );
}
