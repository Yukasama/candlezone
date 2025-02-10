import { CustomTooltip } from '@/components/custom-tooltip';
import { isActualGood } from '@/features/stock/lib/is-actual-good';
import { EconomicEvent } from '@/lib/fmp/types/info';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface Props {
  event: EconomicEvent;
}

export const EconomicItem = ({ event }: Props) => {
  return (
    <CustomTooltip
      className="flex items-center gap-3 rounded-lg"
      content={<Tooltip event={event} />}
    >
      <div>
        <Image
          alt={event.country}
          className="rounded-sm"
          height={25}
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
            event.country === 'UK' ? 'GB' : event.country.toUpperCase()
          }.svg`}
          width={35}
        />
        <div>
          <p className="w-24 truncate text-[13px]">{event.event || 'N/A'}</p>
        </div>
      </div>
    </CustomTooltip>
  );
};

const Tooltip = ({ event }: Props) => {
  const isGood = isActualGood(event) ? 'text-success' : 'text-destructive';

  return (
    <div className="space-y-1 p-1">
      <div className="flex gap-3">
        <Image
          alt={event.country}
          className="rounded-sm"
          height={25}
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
            event.country === 'UK' ? 'GB' : event.country.toUpperCase()
          }.svg`}
          width={35}
        />
        <p className="w-40 truncate font-semibold">{event.event || 'N/A'}</p>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div>
          <p className="text-desc text-[13px]">Previous</p>
          <p className="text-sm font-semibold">{event.previous ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-desc text-[13px]">Estimate</p>
          <p className="text-sm font-semibold">{event.estimate ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-desc text-[13px]">Actual</p>
          <p
            className={cn(
              'w-12 text-sm font-semibold sm:w-20',
              event.estimate && event.actual ? isGood : '',
            )}
          >
            {event.actual ?? '-'}
          </p>
        </div>
      </div>
    </div>
  );
};
