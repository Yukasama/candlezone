/*
  Warnings:

  - You are about to drop the column `accessToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Stock` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `VerificationRequest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("createdAt", "expires", "id", "sessionToken", "updatedAt", "userId") SELECT "createdAt", "expires", "id", "sessionToken", "updatedAt", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE TABLE "new_Stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "eye" INTEGER,
    "beta" REAL,
    "marketCap" REAL,
    "range" TEXT,
    "companyName" TEXT NOT NULL,
    "currency" TEXT,
    "cik" TEXT,
    "isin" TEXT,
    "cusip" TEXT,
    "exchange" TEXT,
    "industry" TEXT,
    "website" TEXT,
    "description" TEXT,
    "ceo" TEXT,
    "sector" TEXT,
    "country" TEXT,
    "fullTimeEmployees" INTEGER,
    "address" TEXT,
    "city" TEXT,
    "zip" TEXT,
    "averageVolume" REAL,
    "image" TEXT NOT NULL,
    "ipoDate" DATETIME,
    "isEtf" BOOLEAN,
    "isActivelyTrading" BOOLEAN,
    "isFund" BOOLEAN,
    "grossProfitMarginTTM" REAL,
    "ebitMarginTTM" REAL,
    "ebitdaMarginTTM" REAL,
    "operatingProfitMarginTTM" REAL,
    "pretaxProfitMarginTTM" REAL,
    "continuousOperationsProfitMarginTTM" REAL,
    "netProfitMarginTTM" REAL,
    "bottomLineProfitMarginTTM" REAL,
    "receivablesTurnoverTTM" REAL,
    "payablesTurnoverTTM" REAL,
    "inventoryTurnoverTTM" REAL,
    "fixedAssetTurnoverTTM" REAL,
    "assetTurnoverTTM" REAL,
    "currentRatioTTM" REAL,
    "quickRatioTTM" REAL,
    "solvencyRatioTTM" REAL,
    "cashRatioTTM" REAL,
    "priceToEarningsRatioTTM" REAL,
    "priceToEarningsGrowthRatioTTM" REAL,
    "forwardPriceToEarningsGrowthRatioTTM" REAL,
    "priceToBookRatioTTM" REAL,
    "priceToSalesRatioTTM" REAL,
    "priceToFreeCashFlowRatioTTM" REAL,
    "priceToOperatingCashFlowRatioTTM" REAL,
    "debtToAssetsRatioTTM" REAL,
    "debtToEquityRatioTTM" REAL,
    "debtToCapitalRatioTTM" REAL,
    "longTermDebtToCapitalRatioTTM" REAL,
    "financialLeverageRatioTTM" REAL,
    "workingCapitalTurnoverRatioTTM" REAL,
    "operatingCashFlowRatioTTM" REAL,
    "operatingCashFlowSalesRatioTTM" REAL,
    "freeCashFlowOperatingCashFlowRatioTTM" REAL,
    "debtServiceCoverageRatioTTM" REAL,
    "interestCoverageRatioTTM" REAL,
    "shortTermOperatingCashFlowCoverageRatioTTM" REAL,
    "operatingCashFlowCoverageRatioTTM" REAL,
    "capitalExpenditureCoverageRatioTTM" REAL,
    "dividendPaidAndCapexCoverageRatioTTM" REAL,
    "dividendPayoutRatioTTM" REAL,
    "dividendYieldTTM" REAL,
    "dividendYieldPercentageTTM" REAL,
    "revenuePerShareTTM" REAL,
    "netIncomePerShareTTM" REAL,
    "interestDebtPerShareTTM" REAL,
    "cashPerShareTTM" REAL,
    "bookValuePerShareTTM" REAL,
    "tangibleBookValuePerShareTTM" REAL,
    "shareholdersEquityPerShareTTM" REAL,
    "operatingCashFlowPerShareTTM" REAL,
    "capexPerShareTTM" REAL,
    "freeCashFlowPerShareTTM" REAL,
    "netIncomePerEBTTTM" REAL,
    "ebtPerEbitTTM" REAL,
    "priceToFairValueTTM" REAL,
    "debtToMarketCapTTM" REAL,
    "effectiveTaxRateTTM" REAL,
    "enterpriseValueMultipleTTM" REAL,
    "earningsDate" DATETIME,
    "discountedCashFlow" REAL,
    "dcfPercentDiff" REAL,
    "peersList" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Stock" ("address", "assetTurnoverTTM", "averageVolume", "beta", "bookValuePerShareTTM", "bottomLineProfitMarginTTM", "capexPerShareTTM", "capitalExpenditureCoverageRatioTTM", "cashPerShareTTM", "cashRatioTTM", "ceo", "cik", "city", "companyName", "continuousOperationsProfitMarginTTM", "country", "createdAt", "currency", "currentRatioTTM", "cusip", "dcfPercentDiff", "debtServiceCoverageRatioTTM", "debtToAssetsRatioTTM", "debtToCapitalRatioTTM", "debtToEquityRatioTTM", "debtToMarketCapTTM", "description", "discountedCashFlow", "dividendPaidAndCapexCoverageRatioTTM", "dividendPayoutRatioTTM", "dividendYieldPercentageTTM", "dividendYieldTTM", "earningsDate", "ebitMarginTTM", "ebitdaMarginTTM", "ebtPerEbitTTM", "effectiveTaxRateTTM", "enterpriseValueMultipleTTM", "exchange", "eye", "financialLeverageRatioTTM", "fixedAssetTurnoverTTM", "forwardPriceToEarningsGrowthRatioTTM", "freeCashFlowOperatingCashFlowRatioTTM", "freeCashFlowPerShareTTM", "fullTimeEmployees", "grossProfitMarginTTM", "id", "image", "industry", "interestCoverageRatioTTM", "interestDebtPerShareTTM", "inventoryTurnoverTTM", "ipoDate", "isActivelyTrading", "isEtf", "isFund", "isin", "longTermDebtToCapitalRatioTTM", "marketCap", "netIncomePerEBTTTM", "netIncomePerShareTTM", "netProfitMarginTTM", "operatingCashFlowCoverageRatioTTM", "operatingCashFlowPerShareTTM", "operatingCashFlowRatioTTM", "operatingCashFlowSalesRatioTTM", "operatingProfitMarginTTM", "payablesTurnoverTTM", "peersList", "pretaxProfitMarginTTM", "priceToBookRatioTTM", "priceToEarningsGrowthRatioTTM", "priceToEarningsRatioTTM", "priceToFairValueTTM", "priceToFreeCashFlowRatioTTM", "priceToOperatingCashFlowRatioTTM", "priceToSalesRatioTTM", "quickRatioTTM", "range", "receivablesTurnoverTTM", "revenuePerShareTTM", "sector", "shareholdersEquityPerShareTTM", "shortTermOperatingCashFlowCoverageRatioTTM", "solvencyRatioTTM", "symbol", "tangibleBookValuePerShareTTM", "updatedAt", "website", "workingCapitalTurnoverRatioTTM", "zip") SELECT "address", "assetTurnoverTTM", "averageVolume", "beta", "bookValuePerShareTTM", "bottomLineProfitMarginTTM", "capexPerShareTTM", "capitalExpenditureCoverageRatioTTM", "cashPerShareTTM", "cashRatioTTM", "ceo", "cik", "city", "companyName", "continuousOperationsProfitMarginTTM", "country", "createdAt", "currency", "currentRatioTTM", "cusip", "dcfPercentDiff", "debtServiceCoverageRatioTTM", "debtToAssetsRatioTTM", "debtToCapitalRatioTTM", "debtToEquityRatioTTM", "debtToMarketCapTTM", "description", "discountedCashFlow", "dividendPaidAndCapexCoverageRatioTTM", "dividendPayoutRatioTTM", "dividendYieldPercentageTTM", "dividendYieldTTM", "earningsDate", "ebitMarginTTM", "ebitdaMarginTTM", "ebtPerEbitTTM", "effectiveTaxRateTTM", "enterpriseValueMultipleTTM", "exchange", "eye", "financialLeverageRatioTTM", "fixedAssetTurnoverTTM", "forwardPriceToEarningsGrowthRatioTTM", "freeCashFlowOperatingCashFlowRatioTTM", "freeCashFlowPerShareTTM", "fullTimeEmployees", "grossProfitMarginTTM", "id", "image", "industry", "interestCoverageRatioTTM", "interestDebtPerShareTTM", "inventoryTurnoverTTM", "ipoDate", "isActivelyTrading", "isEtf", "isFund", "isin", "longTermDebtToCapitalRatioTTM", "marketCap", "netIncomePerEBTTTM", "netIncomePerShareTTM", "netProfitMarginTTM", "operatingCashFlowCoverageRatioTTM", "operatingCashFlowPerShareTTM", "operatingCashFlowRatioTTM", "operatingCashFlowSalesRatioTTM", "operatingProfitMarginTTM", "payablesTurnoverTTM", "peersList", "pretaxProfitMarginTTM", "priceToBookRatioTTM", "priceToEarningsGrowthRatioTTM", "priceToEarningsRatioTTM", "priceToFairValueTTM", "priceToFreeCashFlowRatioTTM", "priceToOperatingCashFlowRatioTTM", "priceToSalesRatioTTM", "quickRatioTTM", "range", "receivablesTurnoverTTM", "revenuePerShareTTM", "sector", "shareholdersEquityPerShareTTM", "shortTermOperatingCashFlowCoverageRatioTTM", "solvencyRatioTTM", "symbol", "tangibleBookValuePerShareTTM", "updatedAt", "website", "workingCapitalTurnoverRatioTTM", "zip" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
CREATE UNIQUE INDEX "Stock_symbol_key" ON "Stock"("symbol");
CREATE INDEX "Stock_marketCap_idx" ON "Stock"("marketCap");
CREATE TABLE "new_VerificationRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_VerificationRequest" ("createdAt", "expires", "id", "identifier", "token") SELECT "createdAt", "expires", "id", "identifier", "token" FROM "VerificationRequest";
DROP TABLE "VerificationRequest";
ALTER TABLE "new_VerificationRequest" RENAME TO "VerificationRequest";
CREATE UNIQUE INDEX "VerificationRequest_token_key" ON "VerificationRequest"("token");
CREATE INDEX "VerificationRequest_identifier_idx" ON "VerificationRequest"("identifier");
CREATE INDEX "VerificationRequest_token_idx" ON "VerificationRequest"("token");
CREATE UNIQUE INDEX "VerificationRequest_identifier_token_key" ON "VerificationRequest"("identifier", "token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
