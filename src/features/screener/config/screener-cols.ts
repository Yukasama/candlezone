import { ScreenerTableColumns } from '../types/screener';

export const SCREENER_TABLE_COLUMNS: ScreenerTableColumns = {
  general: [
    {
      label: 'Market Cap',
      sortable: true,
      accessor: 'mktCap',
    },
    {
      label: 'Sector',
      sortable: true,
      accessor: 'sector',
    },
    {
      label: 'Net Margin',
      sortable: true,
      accessor: 'netProfitMarginTTM',
    },
    {
      label: 'P/E Ratio',
      sortable: true,
      accessor: 'peRatioTTM',
    },
  ],
  valuation: [
    {
      label: 'P/E Ratio',
      sortable: true,
      accessor: 'peRatioTTM',
    },
    {
      label: 'P/B Ratio',
      sortable: true,
      accessor: 'pbRatioTTM',
    },
    {
      label: 'Price/Sales',
      sortable: true,
      accessor: 'psRatioTTM',
    },
  ],
  performance: [
    {
      label: '1-Day Change',
      sortable: true,
      accessor: 'dayChange',
    },
    {
      label: '1-Week Change',
      sortable: true,
      accessor: 'weekChange',
    },
    {
      label: '1-Month Change',
      sortable: true,
      accessor: 'monthChange',
    },
  ],
  financials: [
    {
      label: 'Revenue',
      sortable: true,
      accessor: 'revenueTTM',
    },
    {
      label: 'Gross Profit',
      sortable: true,
      accessor: 'grossProfitTTM',
    },
    {
      label: 'Net Income',
      sortable: true,
      accessor: 'netIncomeTTM',
    },
  ],
  insiders: [
    {
      label: 'Insider Ownership',
      sortable: true,
      accessor: 'insiderOwnership',
    },
    {
      label: 'Insider Transactions',
      sortable: true,
      accessor: 'insiderTransactions',
    },
    {
      label: 'Institutional Ownership',
      sortable: true,
      accessor: 'institutionalOwnership',
    },
  ],
};
