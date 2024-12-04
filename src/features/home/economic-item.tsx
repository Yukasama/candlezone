import { CustomTooltip } from '@/components/custom-tooltip';
import { EconomicEvent } from '@/lib/fmp/types/info';
import Image from 'next/image';

interface Props {
  event: EconomicEvent;
}

export const EconomicItem = ({ event }: Props) => {
  return (
    <CustomTooltip
      content={<Tooltip event={event} />}
      className="f-center gap-3"
    >
      <div>
        <Image
          src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${
            event.country === 'UK' ? 'GB' : event.country?.toUpperCase()
          }.svg`}
          width={45}
          height={30}
          alt={event.country ?? 'Unknown'}
          className="rounded-sm"
        />
        <div>
          <p className="truncate text-sm font-semibold lg:text-[15px]">
            {event.event.replace('procure.ch ', '') || 'N/A'}
          </p>
        </div>
      </div>
    </CustomTooltip>
  );
};

const Tooltip = ({ event }: Props) => {
  return (
    <div className="f-center -mb-2 gap-4 px-[17px] pt-1">
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
    </div>
  );
};
