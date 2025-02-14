import { StockDCF } from '@/features/admin/types/upload';
import type { Stock } from '@prisma/client';

interface StockFactoryParams {
  dcf?: StockDCF;
  earningsDate?: string;
  peersList?: string;
  profile: Stock;
  ratiosTTM?: Stock;
}

export const createStock = (params: StockFactoryParams) => {
  const { dcf, earningsDate, peersList, profile, ratiosTTM } = params;

  return {
    ...normalizeRatios(ratiosTTM),
    ...normalizeDCF(dcf),
    ...profile,
    change: undefined,
    changePercentage: undefined,
    cik: String(profile.cik),
    cusip: String(profile.cusip),
    date: undefined,
    defaultImage: undefined,
    earningsDate: earningsDate ? new Date(earningsDate) : undefined,
    exchangeFullName: undefined,
    fullTimeEmployees: Number(profile.fullTimeEmployees),
    ipoDate: undefined,
    isAdr: undefined,
    isFund: undefined,
    lastDividend: undefined,
    peersList,
    phone: undefined,
    price: undefined,
    volAvg: undefined,
    volume: undefined,
    zip: String(profile.zip),
  };
};

const normalizeDCF = (dcf?: StockDCF) => {
  if (!dcf) {
    return {};
  }

  return {
    dcfPercentDiff: Number(dcf.dcfPercentDiff),
    discountedCashFlow: Number(dcf.discountedCashFlow),
  };
};

const normalizeRatios = (ratios?: Stock) => {
  if (!ratios) {
    return {};
  }

  return {
    assetTurnoverTTM: Number(ratios.assetTurnoverTTM),
    bookValuePerShareTTM: Number(ratios.bookValuePerShareTTM),
    bottomLineProfitMarginTTM: Number(ratios.bottomLineProfitMarginTTM),
    capexPerShareTTM: Number(ratios.capexPerShareTTM),
    capitalExpenditureCoverageRatioTTM: Number(
      ratios.capitalExpenditureCoverageRatioTTM,
    ),
    cashPerShareTTM: Number(ratios.cashPerShareTTM),
    cashRatioTTM: Number(ratios.cashRatioTTM),
    continuousOperationsProfitMarginTTM: Number(
      ratios.continuousOperationsProfitMarginTTM,
    ),
    currentRatioTTM: Number(ratios.currentRatioTTM),
    debtServiceCoverageRatioTTM: Number(ratios.debtServiceCoverageRatioTTM),
    debtToAssetsRatioTTM: Number(ratios.debtToAssetsRatioTTM),
    debtToCapitalRatioTTM: Number(ratios.debtToCapitalRatioTTM),
    debtToEquityRatioTTM: Number(ratios.debtToEquityRatioTTM),
    debtToMarketCapTTM: Number(ratios.debtToMarketCapTTM),
    dividendPaidAndCapexCoverageRatioTTM: Number(
      ratios.dividendPaidAndCapexCoverageRatioTTM,
    ),
    dividendPayoutRatioTTM: Number(ratios.dividendPayoutRatioTTM),
    dividendYieldPercentageTTM: Number(ratios.dividendYieldPercentageTTM),
    dividendYieldTTM: Number(ratios.dividendYieldTTM),
    ebitdaMarginTTM: Number(ratios.ebitdaMarginTTM),
    ebitMarginTTM: Number(ratios.ebitMarginTTM),
    ebtPerEbitTTM: Number(ratios.ebtPerEbitTTM),
    effectiveTaxRateTTM: Number(ratios.effectiveTaxRateTTM),
    enterpriseValueMultipleTTM: Number(ratios.enterpriseValueMultipleTTM),
    financialLeverageRatioTTM: Number(ratios.financialLeverageRatioTTM),
    fixedAssetTurnoverTTM: Number(ratios.fixedAssetTurnoverTTM),
    forwardPriceToEarningsGrowthRatioTTM: Number(
      ratios.forwardPriceToEarningsGrowthRatioTTM,
    ),
    freeCashFlowOperatingCashFlowRatioTTM: Number(
      ratios.freeCashFlowOperatingCashFlowRatioTTM,
    ),
    freeCashFlowPerShareTTM: Number(ratios.freeCashFlowPerShareTTM),
    grossProfitMarginTTM: Number(ratios.grossProfitMarginTTM),
    interestCoverageRatioTTM: Number(ratios.interestCoverageRatioTTM),
    interestDebtPerShareTTM: Number(ratios.interestDebtPerShareTTM),
    inventoryTurnoverTTM: Number(ratios.inventoryTurnoverTTM),
    longTermDebtToCapitalRatioTTM: Number(ratios.longTermDebtToCapitalRatioTTM),
    netIncomePerEBTTTM: Number(ratios.netIncomePerEBTTTM),
    netIncomePerShareTTM: Number(ratios.netIncomePerShareTTM),
    netProfitMarginTTM: Number(ratios.netProfitMarginTTM),
    operatingCashFlowCoverageRatioTTM: Number(
      ratios.operatingCashFlowCoverageRatioTTM,
    ),
    operatingCashFlowPerShareTTM: Number(ratios.operatingCashFlowPerShareTTM),
    operatingCashFlowRatioTTM: Number(ratios.operatingCashFlowRatioTTM),
    operatingCashFlowSalesRatioTTM: Number(
      ratios.operatingCashFlowSalesRatioTTM,
    ),
    operatingProfitMarginTTM: Number(ratios.operatingProfitMarginTTM),
    payablesTurnoverTTM: Number(ratios.payablesTurnoverTTM),
    pretaxProfitMarginTTM: Number(ratios.pretaxProfitMarginTTM),
    priceToBookRatioTTM: Number(ratios.priceToBookRatioTTM),
    priceToEarningsGrowthRatioTTM: Number(ratios.priceToEarningsGrowthRatioTTM),
    priceToEarningsRatioTTM: Number(ratios.priceToEarningsRatioTTM),
    priceToFairValueTTM: Number(ratios.priceToFairValueTTM),
    priceToFreeCashFlowRatioTTM: Number(ratios.priceToFreeCashFlowRatioTTM),
    priceToOperatingCashFlowRatioTTM: Number(
      ratios.priceToOperatingCashFlowRatioTTM,
    ),
    priceToSalesRatioTTM: Number(ratios.priceToSalesRatioTTM),
    quickRatioTTM: Number(ratios.quickRatioTTM),
    receivablesTurnoverTTM: Number(ratios.receivablesTurnoverTTM),
    revenuePerShareTTM: Number(ratios.revenuePerShareTTM),
    shareholdersEquityPerShareTTM: Number(ratios.shareholdersEquityPerShareTTM),
    shortTermOperatingCashFlowCoverageRatioTTM: Number(
      ratios.shortTermOperatingCashFlowCoverageRatioTTM,
    ),
    solvencyRatioTTM: Number(ratios.solvencyRatioTTM),
    tangibleBookValuePerShareTTM: Number(ratios.tangibleBookValuePerShareTTM),
    workingCapitalTurnoverRatioTTM: Number(
      ratios.workingCapitalTurnoverRatioTTM,
    ),
  };
};
