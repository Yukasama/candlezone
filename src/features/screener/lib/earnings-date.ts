import { addDays, addMonths, addWeeks, endOfWeek, startOfWeek } from 'date-fns';

export const getEarningsDateRange = ({ filter }: { filter: string }) => {
  const today = new Date();

  switch (filter) {
    case '+1 Month': {
      return { endDate: addMonths(today, 1), startDate: today };
    }
    case '+2 Weeks': {
      return { endDate: addWeeks(today, 2), startDate: today };
    }
    case 'This Week': {
      return {
        endDate: endOfWeek(today, { weekStartsOn: 1 }),
        startDate: startOfWeek(today, { weekStartsOn: 1 }),
      };
    }
    case 'Today': {
      return { endDate: today, startDate: today };
    }
    case 'Tomorrow': {
      return { endDate: addDays(today, 1), startDate: addDays(today, 1) };
    }
  }
};
