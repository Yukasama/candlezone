'use client';

import { CustomTooltip } from '@/components/custom-tooltip';
import { Lock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

interface Props {
  gradient: string[];
  hint: string;
  id?: string;
  title: string;
  val: number;
}

export const AIMetric = ({
  gradient,
  hint,
  id,
  title,
  val,
}: Readonly<Props>) => {
  const { theme } = useTheme();
  const { data: session } = useSession();

  const fullCircumference = 2 * Math.PI * 54;
  const threeQuarterCircumference = (3 / 4) * fullCircumference;

  const dashOffset = ((100 - val) / 100) * threeQuarterCircumference;
  const dashGreyArray = threeQuarterCircumference;
  const dashGreyOffset = 0;

  const rotationDegree = -224.75;

  return (
    <CustomTooltip content={hint} side="bottom" sideOffset={4}>
      <div className="flex flex-col gap-0.5">
        <div className="relative h-20 w-20 translate-y-2 overflow-hidden">
          <svg
            className="absolute top-0 left-0 h-full w-full"
            style={{ transform: `rotate(${String(rotationDegree)}deg)` }}
            viewBox="0 0 120 120"
          >
            <defs>
              <linearGradient
                id={`gradient${title}${String(id)}`}
                x1="0%"
                x2="100%"
                y1="0%"
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
              stroke={theme === 'light' ? '#e4e4e7' : '#27272a'}
              strokeDasharray={dashGreyArray}
              strokeDashoffset={dashGreyOffset}
              strokeLinecap="round"
              strokeWidth={8}
            />
            <circle
              className="fill-transparent"
              cx="60"
              cy="60"
              r="54"
              stroke={`url(#gradient${title}${String(id)})`}
              strokeDasharray={dashGreyArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeWidth={8}
            />
          </svg>
          <div className="relative flex h-[95%] w-full flex-col items-center justify-center">
            <p className="text-center text-xl">
              {session?.user ? val : <Lock size={20} />}
            </p>
          </div>
        </div>
        <p className="text-desc text-center text-[13px]">{title}</p>
      </div>
    </CustomTooltip>
  );
};
