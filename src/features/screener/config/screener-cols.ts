import { ScreenerTableColumns } from '../types/screener';

export const SCREENER_TABLE_COLUMNS: ScreenerTableColumns = {
  financials: [
    {
      accessor: 'revenueTTM',
      label: 'Revenue',
      sortable: true,
    },
    {
      accessor: 'grossProfitTTM',
      label: 'Gross Profit',
      sortable: true,
    },
    {
      accessor: 'netIncomeTTM',
      label: 'Net Income',
      sortable: true,
    },
  ],
  general: [
    {
      accessor: 'marketCap',
      label: 'Market Cap',
      sortable: true,
    },
    {
      accessor: 'sector',
      label: 'Sector',
      sortable: true,
    },
    {
      accessor: 'netProfitMarginTTM',
      label: 'Net Margin',
      sortable: true,
    },
    {
      accessor: 'priceToEarningsRatioTTM',
      label: 'P/E Ratio',
      sortable: true,
    },
  ],
  insiders: [
    {
      accessor: 'insiderOwnership',
      label: 'Insider Ownership',
      sortable: true,
    },
    {
      accessor: 'insiderTransactions',
      label: 'Insider Transactions',
      sortable: true,
    },
    {
      accessor: 'institutionalOwnership',
      label: 'Institutional Ownership',
      sortable: true,
    },
  ],
  performance: [
    {
      accessor: 'dayChange',
      label: '1-Day Change',
      sortable: true,
    },
    {
      accessor: 'weekChange',
      label: '1-Week Change',
      sortable: true,
    },
    {
      accessor: 'monthChange',
      label: '1-Month Change',
      sortable: true,
    },
  ],
  valuation: [
    {
      accessor: 'priceToEarningsRatioTTM',
      label: 'P/E Ratio',
      sortable: true,
    },
    {
      accessor: 'pbRatioTTM',
      label: 'P/B Ratio',
      sortable: true,
    },
    {
      accessor: 'psRatioTTM',
      label: 'Price/Sales',
      sortable: true,
    },
  ],
};
