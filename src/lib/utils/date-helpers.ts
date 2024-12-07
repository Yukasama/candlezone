import { addDays, format, parseISO, startOfWeek } from 'date-fns';

export const formatDate = (date: Date): string => format(date, 'yyyy-MM-dd');

export const getFormattedDate = (date: string, timeframe: string) => {
  switch (timeframe) {
    case '1D': {
      return format(parseISO(date), 'HH:mm');
    }
    case '5D': {
      return format(parseISO(date), 'dd');
    }
    case '1M': {
      return format(parseISO(date), 'MMM dd');
    }
    case '6M':
    case '1Y': {
      return format(parseISO(date), 'MMM');
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

export const getCurrentWeek = () => {
  const today = new Date();

  const currentDay = today.getDay();
  const isSunday = currentDay === 0 ? 1 : 0;
  const daysToAdd = currentDay === 6 ? 2 : isSunday;

  const weekStart = startOfWeek(addDays(today, daysToAdd), {
    weekStartsOn: 1,
  });
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  return { today, weekStart, weekDays };
};
