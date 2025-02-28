import { Timeframe } from '@/lib/fmp/types/history';
import { format, parseISO } from 'date-fns';

export const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

export const getFormattedDate = (date: string, timeframe: Timeframe) => {
  switch (timeframe) {
    case '1D': {
      return format(parseISO(date), 'HH:mm');
    }
    case '1M': {
      return format(parseISO(date), 'MMM dd');
    }
    case '1Y':
    case '6M': {
      return format(parseISO(date), 'MMM');
    }
    case '5D': {
      return format(parseISO(date), 'dd');
    }
    case '5Y':
    case 'All': {
      return format(parseISO(date), 'yyyy');
    }
    default: {
      return format(parseISO(date), 'MM/dd/yyyy');
    }
  }
};
