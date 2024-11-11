/*
  Warnings:

  - You are about to drop the `Log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `exchange` on the `Stock` table. All the data in the column will be lost.
  - You are about to alter the column `earningsDate` on the `Stock` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Log";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "eye" INTEGER,
    "beta" REAL,
    "mktCap" REAL,
    "range" TEXT,
    "companyName" TEXT NOT NULL,
    "currency" TEXT,
    "cik" TEXT,
    "isin" TEXT,
    "cusip" TEXT,
    "exchangeShortName" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "description" TEXT,
    "ceo" TEXT,
    "sector" TEXT,
    "country" TEXT,
    "fullTimeEmployees" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "dcfDiff" REAL,
    "dcf" REAL,
    "image" TEXT NOT NULL,
    "isEtf" BOOLEAN,
    "isActivelyTrading" BOOLEAN,
    "isFund" BOOLEAN,
    "earningsDate" DATETIME,
    "earningsEps" REAL,
    "earningsEpsEstimated" REAL,
    "earningsTime" TEXT,
    "earningsRevenue" REAL,
    "earningsRevenueEstimated" REAL,
    "dividendYielTTM" REAL,
    "dividendYielPercentageTTM" REAL,
    "peRatioTTM" REAL,
    "pegRatioTTM" REAL,
    "payoutRatioTTM" REAL,
    "currentRatioTTM" REAL,
    "quickRatioTTM" REAL,
    "cashRatioTTM" REAL,
    "daysOfSalesOutstandingTTM" REAL,
    "daysOfInventoryOutstandingTTM" REAL,
    "operatingCycleTTM" REAL,
    "daysOfPayablesOutstandingTTM" REAL,
    "cashConversionCycleTTM" REAL,
    "grossProfitMarginTTM" REAL,
    "operatingProfitMarginTTM" REAL,
    "pretaxProfitMarginTTM" REAL,
    "netProfitMarginTTM" REAL,
    "effectiveTaxRateTTM" REAL,
    "returnOnAssetsTTM" REAL,
    "returnOnEquityTTM" REAL,
    "returnOnCapitalEmployedTTM" REAL,
    "netIncomePerEBTTTM" REAL,
    "ebtPerEbitTTM" REAL,
    "ebitPerRevenueTTM" REAL,
    "debtRatioTTM" REAL,
    "debtEquityRatioTTM" REAL,
    "longTermDebtToCapitalizationTTM" REAL,
    "totalDebtToCapitalizationTTM" REAL,
    "interestCoverageTTM" REAL,
    "cashFlowToDebtRatioTTM" REAL,
    "companyEquityMultiplierTTM" REAL,
    "receivablesTurnoverTTM" REAL,
    "payablesTurnoverTTM" REAL,
    "inventoryTurnoverTTM" REAL,
    "fixedAssetTurnoverTTM" REAL,
    "assetTurnoverTTM" REAL,
    "operatingCashFlowPerShareTTM" REAL,
    "freeCashFlowPerShareTTM" REAL,
    "cashPerShareTTM" REAL,
    "operatingCashFlowSalesRatioTTM" REAL,
    "freeCashFlowOperatingCashFlowRatioTTM" REAL,
    "cashFlowCoverageRatiosTTM" REAL,
    "shortTermCoverageRatiosTTM" REAL,
    "capitalExpenditureCoverageRatioTTM" REAL,
    "dividendPaidAndCapexCoverageRatioTTM" REAL,
    "priceToBookRatioTTM" REAL,
    "priceToSalesRatioTTM" REAL,
    "priceEarningsRatioTTM" REAL,
    "priceToFreeCashFlowsRatioTTM" REAL,
    "priceCashFlowRatioTTM" REAL,
    "priceEarningsToGrowthRatioTTM" REAL,
    "enterpriseValueMultipleTTM" REAL,
    "dividendPerShareTTM" REAL,
    "targetHigh" REAL,
    "targetLow" REAL,
    "targetConsensus" REAL,
    "targetMedian" REAL,
    "peersList" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "errorMsg" TEXT
);
INSERT INTO "new_Stock" ("address", "assetTurnoverTTM", "beta", "capitalExpenditureCoverageRatioTTM", "cashConversionCycleTTM", "cashFlowCoverageRatiosTTM", "cashFlowToDebtRatioTTM", "cashPerShareTTM", "cashRatioTTM", "ceo", "cik", "city", "companyEquityMultiplierTTM", "companyName", "country", "createdAt", "currency", "currentRatioTTM", "cusip", "daysOfInventoryOutstandingTTM", "daysOfPayablesOutstandingTTM", "daysOfSalesOutstandingTTM", "dcf", "dcfDiff", "debtEquityRatioTTM", "debtRatioTTM", "description", "dividendPaidAndCapexCoverageRatioTTM", "dividendPerShareTTM", "dividendYielPercentageTTM", "dividendYielTTM", "earningsDate", "earningsEps", "earningsEpsEstimated", "earningsRevenue", "earningsRevenueEstimated", "earningsTime", "ebitPerRevenueTTM", "ebtPerEbitTTM", "effectiveTaxRateTTM", "enterpriseValueMultipleTTM", "errorMsg", "exchangeShortName", "eye", "fixedAssetTurnoverTTM", "freeCashFlowOperatingCashFlowRatioTTM", "freeCashFlowPerShareTTM", "fullTimeEmployees", "grossProfitMarginTTM", "id", "image", "industry", "interestCoverageTTM", "inventoryTurnoverTTM", "isActivelyTrading", "isEtf", "isFund", "isin", "longTermDebtToCapitalizationTTM", "mktCap", "netIncomePerEBTTTM", "netProfitMarginTTM", "operatingCashFlowPerShareTTM", "operatingCashFlowSalesRatioTTM", "operatingCycleTTM", "operatingProfitMarginTTM", "payablesTurnoverTTM", "payoutRatioTTM", "peRatioTTM", "peersList", "pegRatioTTM", "pretaxProfitMarginTTM", "priceCashFlowRatioTTM", "priceEarningsRatioTTM", "priceEarningsToGrowthRatioTTM", "priceToBookRatioTTM", "priceToFreeCashFlowsRatioTTM", "priceToSalesRatioTTM", "quickRatioTTM", "range", "receivablesTurnoverTTM", "returnOnAssetsTTM", "returnOnCapitalEmployedTTM", "returnOnEquityTTM", "sector", "shortTermCoverageRatiosTTM", "state", "symbol", "targetConsensus", "targetHigh", "targetLow", "targetMedian", "totalDebtToCapitalizationTTM", "updatedAt", "website", "zip") SELECT "address", "assetTurnoverTTM", "beta", "capitalExpenditureCoverageRatioTTM", "cashConversionCycleTTM", "cashFlowCoverageRatiosTTM", "cashFlowToDebtRatioTTM", "cashPerShareTTM", "cashRatioTTM", "ceo", "cik", "city", "companyEquityMultiplierTTM", "companyName", "country", "createdAt", "currency", "currentRatioTTM", "cusip", "daysOfInventoryOutstandingTTM", "daysOfPayablesOutstandingTTM", "daysOfSalesOutstandingTTM", "dcf", "dcfDiff", "debtEquityRatioTTM", "debtRatioTTM", "description", "dividendPaidAndCapexCoverageRatioTTM", "dividendPerShareTTM", "dividendYielPercentageTTM", "dividendYielTTM", "earningsDate", "earningsEps", "earningsEpsEstimated", "earningsRevenue", "earningsRevenueEstimated", "earningsTime", "ebitPerRevenueTTM", "ebtPerEbitTTM", "effectiveTaxRateTTM", "enterpriseValueMultipleTTM", "errorMsg", "exchangeShortName", "eye", "fixedAssetTurnoverTTM", "freeCashFlowOperatingCashFlowRatioTTM", "freeCashFlowPerShareTTM", "fullTimeEmployees", "grossProfitMarginTTM", "id", "image", "industry", "interestCoverageTTM", "inventoryTurnoverTTM", "isActivelyTrading", "isEtf", "isFund", "isin", "longTermDebtToCapitalizationTTM", "mktCap", "netIncomePerEBTTTM", "netProfitMarginTTM", "operatingCashFlowPerShareTTM", "operatingCashFlowSalesRatioTTM", "operatingCycleTTM", "operatingProfitMarginTTM", "payablesTurnoverTTM", "payoutRatioTTM", "peRatioTTM", "peersList", "pegRatioTTM", "pretaxProfitMarginTTM", "priceCashFlowRatioTTM", "priceEarningsRatioTTM", "priceEarningsToGrowthRatioTTM", "priceToBookRatioTTM", "priceToFreeCashFlowsRatioTTM", "priceToSalesRatioTTM", "quickRatioTTM", "range", "receivablesTurnoverTTM", "returnOnAssetsTTM", "returnOnCapitalEmployedTTM", "returnOnEquityTTM", "sector", "shortTermCoverageRatiosTTM", "state", "symbol", "targetConsensus", "targetHigh", "targetLow", "targetMedian", "totalDebtToCapitalizationTTM", "updatedAt", "website", "zip" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
CREATE UNIQUE INDEX "Stock_symbol_key" ON "Stock"("symbol");
CREATE INDEX "Stock_id_idx" ON "Stock"("id");
CREATE INDEX "Stock_symbol_idx" ON "Stock"("symbol");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Financials_date_idx" ON "Financials"("date");

-- CreateIndex
CREATE INDEX "Portfolio_id_idx" ON "Portfolio"("id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
