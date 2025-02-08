import { cn } from '@/lib/utils';

export interface TooltipPayload {
  name: string;
  value: string;
  stroke?: string;
}

interface Props {
  active: boolean;
  payload?: TooltipPayload[];
}

export const IndexChartTooltip = ({ active, payload }: Props) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-background space-y-1 rounded-md border p-2 shadow">
        {payload.map(({ name, stroke, value }, i) => (
          <div
            key={String(name) + String(i)}
            className="text-muted-foreground flex items-center gap-2 text-xs"
          >
            <div
              className="h-4 w-1 rounded-md"
              style={{ backgroundColor: stroke ?? '#000' }}
            />
            <p className="w-24">{name}</p>
            <div
              className={cn(
                'text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums',
                Number(value) >= 0 ? 'text-price-up' : 'text-price-down',
              )}
            >
              {Number(value) >= 0 ? '+' : ''}
              {Number(value).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    );
  }
};
