'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Lock } from 'lucide-react';
import { User } from 'next-auth';
import { useTheme } from 'next-themes';

interface Props {
  user: Pick<User, 'id'> | undefined;
  title: string;
  value: number;
  gradient: string[];
  tooltip: string;
}

export const AIMetric = ({
  user,
  title,
  value,
  gradient,
  tooltip,
}: Readonly<Props>) => {
  const { theme } = useTheme();

  const fullCircumference = 2 * Math.PI * 54;
  const threeQuarterCircumference = (3 / 4) * fullCircumference;

  const dashOffset = ((100 - value) / 100) * threeQuarterCircumference;
  const dashGreyArray = threeQuarterCircumference;
  const dashGreyOffset = 0;

  const rotationDegree = -224.75;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="f-col gap-0.5">
            <div className="relative h-20 w-20 translate-y-2 overflow-hidden">
              <svg
                className="absolute left-0 top-0 h-full w-full"
                style={{ transform: `rotate(${rotationDegree}deg)` }}
                viewBox="0 0 120 120"
              >
                <defs>
                  <linearGradient
                    id={'gradient' + title}
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor={gradient[1]} />
                    <stop offset="100%" stopColor={gradient[0]} />
                  </linearGradient>
                </defs>
                <circle
                  className="fill-transparent"
                  cx="60"
                  cy="60"
                  r="54"
                  strokeWidth={8}
                  stroke={theme === 'light' ? '#e4e4e7' : '#27272a'}
                  strokeDasharray={dashGreyArray}
                  strokeDashoffset={dashGreyOffset}
                  strokeLinecap="round"
                />
                <circle
                  className="fill-transparent"
                  cx="60"
                  cy="60"
                  r="54"
                  strokeWidth={8}
                  stroke={`url(#gradient${title})`}
                  strokeDasharray={dashGreyArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="f-box relative h-[95%] w-full flex-col">
                <p className="text-center text-xl">
                  {user ? value : <Lock size={20} />}
                </p>
              </div>
            </div>
            <p className="text-center text-[13px] text-gray-400">{title}</p>
          </div>
        </TooltipTrigger>

        <TooltipContent side="bottom">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
