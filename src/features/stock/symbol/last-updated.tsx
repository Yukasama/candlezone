import { Badge } from '@/components/ui/badge';

export const LastUpdated = () => {
  const localTime = new Date();
  localTime.setHours(localTime.getHours() + 2);

  return (
    <Badge variant="secondary" className="self-start font-normal">
      Last updated: {localTime.toISOString().split('T')[1].slice(0, 8)}
    </Badge>
  );
};
