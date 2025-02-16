export interface Profile {
  address: string;
  averageVolume: number;
  beta: number;
  ceo: string;
  change: number;
  changePercentage: number;
  cik: string;
  city: string;
  companyName: string;
  country: string;
  currency: string;
  cusip: string;
  defaultImage: boolean;
  description: string;
  exchange: string;
  exchangeFullName: string;
  fullTimeEmployees: string;
  image: string;
  industry: string;
  ipoDate: string;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isEtf: boolean;
  isFund: boolean;
  isin: string;
  lastDividend: number;
  marketCap: number;
  phone: string;
  price: number;
  range: string;
  sector: string;
  state: string;
  symbol: string;
  volume: number;
  website: string;
  zip: string;
}

export interface RatiosTTM {
  assetTurnoverTTM: number;
  bookValuePerShareTTM: number;
  bottomLineProfitMarginTTM: number;
  capexPerShareTTM: number;
  capitalExpenditureCoverageRatioTTM: number;
  cashPerShareTTM: number;
  cashRatioTTM: number;
  continuousOperationsProfitMarginTTM: number;
  currentRatioTTM: number;
  debtServiceCoverageRatioTTM: number;
  debtToAssetsRatioTTM: number;
  debtToCapitalRatioTTM: number;
  debtToEquityRatioTTM: number;
  debtToMarketCapTTM: number;
  dividendPaidAndCapexCoverageRatioTTM: number;
  dividendPayoutRatioTTM: number;
  dividendYieldPercentageTTM: number;
  dividendYieldTTM: number;
  ebitdaMarginTTM: number;
  ebitMarginTTM: number;
  ebtPerEbitTTM: number;
  effectiveTaxRateTTM: number;
  enterpriseValueMultipleTTM: number;
  financialLeverageRatioTTM: number;
  fixedAssetTurnoverTTM: number;
  forwardPriceToEarningsGrowthRatioTTM: number;
  freeCashFlowOperatingCashFlowRatioTTM: number;
  freeCashFlowPerShareTTM: number;
  grossProfitMarginTTM: number;
  interestCoverageRatioTTM: number;
  interestDebtPerShareTTM: number;
  inventoryTurnoverTTM: number;
  longTermDebtToCapitalRatioTTM: number;
  netIncomePerEBTTTM: number;
  netIncomePerShareTTM: number;
  netProfitMarginTTM: number;
  operatingCashFlowCoverageRatioTTM: number;
  operatingCashFlowPerShareTTM: number;
  operatingCashFlowRatioTTM: number;
  operatingCashFlowSalesRatioTTM: number;
  operatingProfitMarginTTM: number;
  payablesTurnoverTTM: number;
  pretaxProfitMarginTTM: number;
  priceToBookRatioTTM: number;
  priceToEarningsGrowthRatioTTM: number;
  priceToEarningsRatioTTM: number;
  priceToFairValueTTM: number;
  priceToFreeCashFlowRatioTTM: number;
  priceToOperatingCashFlowRatioTTM: number;
  priceToSalesRatioTTM: number;
  quickRatioTTM: number;
  receivablesTurnoverTTM: number;
  revenuePerShareTTM: number;
  shareholdersEquityPerShareTTM: number;
  shortTermOperatingCashFlowCoverageRatioTTM: number;
  solvencyRatioTTM: number;
  symbol: string;
  tangibleBookValuePerShareTTM: number;
  workingCapitalTurnoverRatioTTM: number;
}

export interface StockDCF {
  date: string;
  dcfPercentDiff: number;
  discountedCashFlow: number;
  symbol: string;
}

export interface StockPeer {
  peers: string;
  symbol: string;
}
