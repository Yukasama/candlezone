export interface Profile {
  address: string;
  beta: number;
  ceo: string;
  changes: number;
  cik: string;
  city: string;
  companyName: string;
  country: string;
  currency: string;
  cusip: string;
  dcf: number;
  dcfDiff: number;
  defaultImage: boolean;
  description: string;
  exchange: string;
  exchangeShortName: string;
  fullTimeEmployees: string;
  image: string;
  industry: string;
  ipoDate: string;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isEtf: boolean;
  isFund: boolean;
  isin: string;
  lastDiv: number;
  mktCap: number;
  phone: string;
  price: number;
  range: string;
  sector: string;
  state: string;
  symbol: string;
  volAvg: number;
  website: string;
  zip: string;
}

export interface Ratios {
  assetTurnoverTTM?: number;
  capitalExpenditureCoverageRatioTTM?: number;
  cashConversionCycleTTM?: number;
  cashFlowCoverageRatiosTTM?: number;
  cashFlowToDebtRatioTTM?: number;
  cashPerShareTTM?: number;
  cashRatioTTM?: number;
  companyEquityMultiplierTTM?: number;
  currentRatioTTM?: number;
  daysOfInventoryOutstandingTTM?: number;
  daysOfPayablesOutstandingTTM?: number;
  daysOfSalesOutstandingTTM?: number;
  debtEquityRatioTTM?: number;
  debtRatioTTM?: number;
  dividendPaidAndCapexCoverageRatioTTM?: number;
  dividendPerShareTTM?: number;
  dividendYielPercentageTTM?: number;
  dividendYielTTM?: number;
  ebitPerRevenueTTM?: number;
  ebtPerEbitTTM?: number;
  effectiveTaxRateTTM?: number;
  enterpriseValueMultipleTTM?: number;
  fixedAssetTurnoverTTM?: number;
  freeCashFlowOperatingCashFlowRatioTTM?: number;
  freeCashFlowPerShareTTM?: number;
  grossProfitMarginTTM?: number;
  interestCoverageTTM?: number;
  inventoryTurnoverTTM?: number;
  longTermDebtToCapitalizationTTM?: number;
  netIncomePerEBTTTM?: number;
  netProfitMarginTTM?: number;
  operatingCashFlowPerShareTTM?: number;
  operatingCashFlowSalesRatioTTM?: number;
  operatingCycleTTM?: number;
  operatingProfitMarginTTM?: number;
  payablesTurnoverTTM?: number;
  payoutRatioTTM?: number;
  pegRatioTTM?: number;
  peRatioTTM?: number;
  pretaxProfitMarginTTM?: number;
  priceBookValueRatioTTM?: number;
  priceCashFlowRatioTTM?: number;
  priceEarningsRatioTTM?: number;
  priceEarningsToGrowthRatioTTM?: number;
  priceFairValueTTM?: number;
  priceSalesRatioTTM?: number;
  priceToBookRatioTTM?: number;
  priceToFreeCashFlowsRatioTTM?: number;
  priceToOperatingCashFlowsRatioTTM?: number;
  priceToSalesRatioTTM?: number;
  quickRatioTTM?: number;
  receivablesTurnoverTTM?: number;
  returnOnAssetsTTM?: number;
  returnOnCapitalEmployedTTM?: number;
  returnOnEquityTTM?: number;
  shortTermCoverageRatiosTTM?: number;
  totalDebtToCapitalizationTTM?: number;
}

export interface StockData {
  financialsAnnual: Financials;
  financialsQuarter: Financials;
  insideTrades: InsideTrade[];
  keyExecutives: KeyExecutive[];
  metrics: Metrics;
  profile: Profile;
  rating: Rating[];
  ratios: Ratios[];
  splitsHistory: SplitHistory[];
  stockDividend: StockDividend[];
  stockNews: StockNews[];
}

interface BalanceSheet {
  acceptedDate: string;
  accountPayables: number;
  accumulatedOtherComprehensiveIncomeLoss: number;
  calendarYear: string;
  capitalLeaseObligations: number;
  cashAndCashEquivalents: number;
  cashAndShortTermInvestments: number;
  cik: string;
  commonStock: number;
  date: string;
  deferredRevenue: number;
  deferredRevenueNonCurrent: number;
  deferredTaxLiabilitiesNonCurrent: number;
  fillingDate: string;
  finalLink: string;
  goodwill: number;
  goodwillAndIntangibleAssets: number;
  intangibleAssets: number;
  inventory: number;
  link: string;
  longTermDebt: number;
  longTermInvestments: number;
  minorityInterest: number;
  netDebt: number;
  netReceivables: number;
  otherAssets: number;
  otherCurrentAssets: number;
  otherCurrentLiabilities: number;
  otherLiabilities: number;
  otherNonCurrentAssets: number;
  otherNonCurrentLiabilities: number;
  othertotalStockholdersEquity: number;
  period: string;
  preferredStock: number;
  propertyPlantEquipmentNet: number;
  reportedCurrency: string;
  retainedEarnings: number;
  shortTermDebt: number;
  shortTermInvestments: number;
  symbol: string;
  taxAssets: number;
  taxPayables: number;
  totalAssets: number;
  totalCurrentAssets: number;
  totalCurrentLiabilities: number;
  totalDebt: number;
  totalEquity: number;
  totalInvestments: number;
  totalLiabilities: number;
  totalLiabilitiesAndStockholdersEquity: number;
  totalLiabilitiesAndTotalEquity: number;
  totalNonCurrentAssets: number;
  totalNonCurrentLiabilities: number;
  totalStockholdersEquity: number;
}

interface CashFlowStatement {
  acceptedDate: string;
  accountsPayables: number;
  accountsReceivables: number;
  acquisitionsNet: number;
  calendarYear: string;
  capitalExpenditure: number;
  cashAtBeginningOfPeriod: number;
  cashAtEndOfPeriod: number;
  changeInWorkingCapital: number;
  cik: string;
  commonStockIssued: number;
  commonStockRepurchased: number;
  date: string;
  debtRepayment: number;
  deferredIncomeTax: number;
  depreciationAndAmortization: number;
  dividendsPaid: number;
  effectOfForexChangesOnCash: number;
  fillingDate: string;
  finalLink: string;
  freeCashFlow: number;
  inventory: number;
  investmentsInPropertyPlantAndEquipment: number;
  link: string;
  netCashProvidedByOperatingActivities: number;
  netCashUsedForInvestingActivites: number;
  netCashUsedProvidedByFinancingActivities: number;
  netChangeInCash: number;
  netIncome: number;
  operatingCashFlow: number;
  otherFinancingActivites: number;
  otherInvestingActivites: number;
  otherNonCashItems: number;
  otherWorkingCapital: number;
  period: string;
  purchasesOfInvestments: number;
  reportedCurrency: string;
  salesMaturitiesOfInvestments: number;
  stockBasedCompensation: number;
  symbol: string;
}

interface Financials {
  balance: BalanceSheet[];
  cash: CashFlowStatement[];
  income: IncomeStatement[];
}

interface IncomeStatement {
  acceptedDate: string;
  calendarYear: string;
  cik: string;
  costAndExpenses: number;
  costOfRevenue: number;
  date: string;
  depreciationAndAmortization: number;
  ebitda: number;
  ebitdaratio: number;
  eps: number;
  epsdiluted: number;
  fillingDate: string;
  finalLink: string;
  generalAndAdministrativeExpenses: number;
  grossProfit: number;
  grossProfitRatio: number;
  incomeBeforeTax: number;
  incomeBeforeTaxRatio: number;
  incomeTaxExpense: number;
  interestExpense: number;
  interestIncome: number;
  link: string;
  netIncome: number;
  netIncomeRatio: number;
  operatingExpenses: number;
  operatingIncome: number;
  operatingIncomeRatio: number;
  otherExpenses: number;
  period: string;
  reportedCurrency: string;
  researchAndDevelopmentExpenses: number;
  revenue: number;
  sellingAndMarketingExpenses: number;
  sellingGeneralAndAdministrativeExpenses: number;
  symbol: string;
  totalOtherIncomeExpensesNet: number;
  weightedAverageShsOut: number;
  weightedAverageShsOutDil: number;
}

interface InsideTrade {
  acquistionOrDisposition: string;
  companyCik: string;
  filingDate: string;
  formType: string;
  link: string;
  price: number;
  reportingCik: string;
  reportingName: string;
  securitiesOwned: number;
  securitiesTransacted: number;
  securityName: string;
  symbol: string;
  transactionDate: string;
  transactionType: string;
  typeOfOwner: string;
}

interface KeyExecutive {
  currencyPay: string;
  gender: string;
  name: string;
  pay: null | number;
  title: string;
  titleSince: null | string;
  yearBorn: null | number;
}

interface Metrics {
  dividendYielTTM: number;
  volume: number;
  yearHigh: number;
  yearLow: number;
}

interface Rating {
  date: string;
  rating: string;
  ratingDetailsDCFRecommendation: string;
  ratingDetailsDCFScore: number;
  ratingDetailsDERecommendation: string;
  ratingDetailsDEScore: number;
  ratingDetailsPBRecommendation: string;
  ratingDetailsPBScore: number;
  ratingDetailsPERecommendation: string;
  ratingDetailsPEScore: number;
  ratingDetailsROARecommendation: string;
  ratingDetailsROAScore: number;
  ratingDetailsROERecommendation: string;
  ratingDetailsROEScore: number;
  ratingRecommendation: string;
  ratingScore: number;
  symbol: string;
}

interface SplitHistory {
  date: string;
  denominator: number;
  label: string;
  numerator: number;
}

interface StockDividend {
  adjDividend: number;
  date: string;
  declarationDate: string;
  dividend: number;
  label: string;
  paymentDate: string;
  recordDate: string;
}

interface StockNews {
  image: string;
  publishedDate: string;
  site: string;
  symbol: string;
  text: string;
  title: string;
  url: string;
}
