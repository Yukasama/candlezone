// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @eslint-community/eslint-comments/disable-enable-pair
/* eslint-disable sonarjs/no-unused-vars */

import { Profile, RatiosTTM, StockDCF } from '@/features/admin/types/upload';

interface StockFactoryParams {
  dcf?: StockDCF;
  earningsDate?: string;
  peersList?: string;
  profile: Profile;
  ratiosTTM?: RatiosTTM;
}

export const createStock = (params: StockFactoryParams) => {
  const { dcf, earningsDate, peersList, profile, ratiosTTM } = params;

  const {
    change: _change,
    changePercentage: _changePercentage,
    defaultImage: _defaultImage,
    exchangeFullName: _exchangeFullName,
    isAdr: _isAdr,
    lastDividend: _lastDividend,
    phone: _phone,
    price: _price,
    state: _state,
    volume: _volume,
    ...cleanProfile
  } = profile;

  return {
    ...normalizeRatios(ratiosTTM),
    ...normalizeDCF(dcf),
    ...cleanProfile,
    cik: String(profile.cik),
    cusip: String(profile.cusip),
    earningsDate: earningsDate ? new Date(earningsDate) : undefined,
    fullTimeEmployees: Number(profile.fullTimeEmployees),
    ipoDate: profile.ipoDate ? new Date(profile.ipoDate) : undefined,
    peersList,
    symbol: String(profile.symbol).toUpperCase(),
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

const normalizeRatios = (ratios?: RatiosTTM) => {
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
