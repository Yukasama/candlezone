import { addDays, addMonths, addWeeks, endOfWeek, startOfWeek } from 'date-fns';

export const getEarningsDateRange = ({ filter }: { filter: string }) => {
  const today = new Date();

  switch (filter) {
    case 'Today': {
      return { startDate: today, endDate: today };
    }
    case 'Tomorrow': {
      return { startDate: addDays(today, 1), endDate: addDays(today, 1) };
    }
    case 'This Week': {
      return {
        startDate: startOfWeek(today, { weekStartsOn: 1 }),
        endDate: endOfWeek(today, { weekStartsOn: 1 }),
      };
    }
    case '+2 Weeks': {
      return { startDate: today, endDate: addWeeks(today, 2) };
    }
    case '+1 Month': {
      return { startDate: today, endDate: addMonths(today, 1) };
    }
  }
};
