import { EconomicCalendarItem } from '@/lib/fmp/types/info';

/**
 * Determines if a higher actual value is better for the given event.
 * @param eventName The name of the economic event.
 * @returns True if higher is better, false if lower is better.
 */
const isHigherBetter = (eventName: string) => {
  const lowerBetterKeywords = [
    'Unemployment',
    'Jobless Claims',
    'Inflation',
    'Deficit',
    'Debt',
    'Trade Balance',
    'Inventory',
    'Claims',
    'Rate',
  ];

  const higherBetterKeywords = [
    'GDP',
    'Payrolls',
    'Employment',
    'Sales',
    'Earnings',
    'PMI',
    'Sentiment',
    'Confidence',
    'Production',
    'Orders',
    'Housing Starts',
    'Permits',
    'Spending',
    'Output',
    'Income',
    'Exports',
  ];

  for (const keyword of lowerBetterKeywords) {
    if (eventName.toLowerCase().includes(keyword.toLowerCase())) {
      return false;
    }
  }

  for (const keyword of higherBetterKeywords) {
    if (eventName.toLowerCase().includes(keyword.toLowerCase())) {
      return true;
    }
  }

  return true;
};

/**
 * Determines if the actual value is good compared to the estimate.
 * @param event The economic event data.
 * @returns True if the actual value is good, false otherwise.
 */
export const isActualGood = (
  event: Pick<EconomicCalendarItem, 'actual' | 'estimate' | 'event'>,
) => {
  const { actual, estimate, event: eventName } = event;

  if (!actual || !estimate) {
    return false;
  }

  const higherIsBetter = isHigherBetter(eventName);
  return higherIsBetter ? actual >= estimate : actual <= estimate;
};
