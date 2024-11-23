import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { EconomicEvent } from '@/lib/fmp/types/info';
import Image from 'next/image';

const impactColors = {
  None: 'bg-gray-200 text-gray-800',
  Low: 'bg-emerald-500 text-white',
  Medium: 'bg-amber-600 text-white',
  High: 'bg-red-600 text-white',
};

interface Props {
  event: EconomicEvent;
}

export const EconomicItem = ({ event }: Props) => {
  return (
    <AccordionItem
      value={event.event + event.country}
      className="bg-faded rounded-lg border"
    >
      <AccordionTrigger className="f-center justify-between p-1.5 px-3.5 hover:no-underline">
        <div className="f-center gap-3">
          <Image
            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
              event.country === 'UK' ? 'GB' : event.country?.toUpperCase()
            }.svg`}
            width={40}
            height={30}
            alt={event.country ?? 'Unknown'}
            className="w-8 rounded-sm object-contain lg:w-10"
          />
          <div>
            <p className="truncate text-sm font-semibold lg:text-[15px]">
              {event.event || 'N/A'}
            </p>
            <div className="flex items-center gap-2">
              <div
                className={`f-box h-[18px] rounded-full px-2 text-xs font-semibold ${
                  impactColors[event.impact] || impactColors.None
                }`}
              >
                {event.impact || 'None'}
              </div>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="f-center -mb-1 gap-4 px-[17px] pt-1">
        <div>
          <p className="text-[13px] text-gray-400">Previous</p>
          <p className="text-sm font-semibold">{event.previous ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-[13px] text-gray-400">Estimate</p>
          <p className="text-sm font-semibold">{event.estimate ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-[13px] text-gray-400">Actual</p>
          <p className="text-sm font-semibold">
            {event.actual ?? 'Not released yet.'}
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};
