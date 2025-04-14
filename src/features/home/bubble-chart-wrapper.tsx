import { getBubbleData } from './actions/get-bubble-data';
import { StockBubbleChart } from './bubble-chart';

export const StockBubbleChartWrapper = async () => {
  const stocks = await getBubbleData();

  return <StockBubbleChart stocks={stocks} />;
};
