/*
  Warnings:

  - You are about to alter the column `date` on the `Financials` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.
  - You are about to alter the column `read` on the `Notification` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `DateTime`.
  - You are about to alter the column `isPublic` on the `Portfolio` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `DateTime`.
  - You are about to alter the column `deleted` on the `PortfolioOrder` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `DateTime`.
  - You are about to alter the column `publicProfile` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Boolean` to `DateTime`.

*/
-- CreateTable
CREATE TABLE "PasswordResetRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TwoFactorEmailToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "TwoFactorEmailConfirmation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TwoFactorEmailConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TwoFactorTotpConfirmation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "secret" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TwoFactorTotpConfirmation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Financials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "calendarYear" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "currentRatio" REAL,
    "quickRatio" REAL,
    "cashRatio" REAL,
    "daysOfSalesOutstanding" REAL,
    "daysOfInventoryOutstanding" REAL,
    "operatingCycle" REAL,
    "daysOfPayablesOutstanding" REAL,
    "cashConversionCycle" REAL,
    "grossProfitMargin" REAL,
    "operatingProfitMargin" REAL,
    "pretaxProfitMargin" REAL,
    "netProfitMargin" REAL,
    "effectiveTaxRate" REAL,
    "returnOnAssets" REAL,
    "returnOnEquity" REAL,
    "returnOnCapitalEmployed" REAL,
    "netIncomePerEBT" REAL,
    "ebtPerEbit" REAL,
    "ebitPerRevenue" REAL,
    "debtRatio" REAL,
    "debtEquityRatio" REAL,
    "longTermDebtToCapitalization" REAL,
    "totalDebtToCapitalization" REAL,
    "interestCoverage" REAL,
    "cashFlowToDebtRatio" REAL,
    "companyEquityMultiplier" REAL,
    "receivablesTurnover" REAL,
    "payablesTurnover" REAL,
    "inventoryTurnover" REAL,
    "fixedAssetTurnover" REAL,
    "assetTurnover" REAL,
    "operatingCashFlowPerShare" REAL,
    "freeCashFlowPerShare" REAL,
    "cashPerShare" REAL,
    "payoutRatio" REAL,
    "operatingCashFlowSalesRatio" REAL,
    "freeCashFlowOperatingCashFlowRatio" REAL,
    "cashFlowCoverageRatios" REAL,
    "shortTermCoverageRatios" REAL,
    "capitalExpenditureCoverageRatio" REAL,
    "dividendPaidAndCapexCoverageRatio" REAL,
    "dividendPayoutRatio" REAL,
    "priceToBookRatio" REAL,
    "priceToSalesRatio" REAL,
    "priceEarningsRatio" REAL,
    "priceToFreeCashFlowsRatio" REAL,
    "priceCashFlowRatio" REAL,
    "priceEarningsToGrowthRatio" REAL,
    "dividendYield" REAL,
    "enterpriseValueMultiple" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "stockId" INTEGER NOT NULL,
    CONSTRAINT "Financials_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Financials" ("assetTurnover", "calendarYear", "capitalExpenditureCoverageRatio", "cashConversionCycle", "cashFlowCoverageRatios", "cashFlowToDebtRatio", "cashPerShare", "cashRatio", "companyEquityMultiplier", "createdAt", "currentRatio", "date", "daysOfInventoryOutstanding", "daysOfPayablesOutstanding", "daysOfSalesOutstanding", "debtEquityRatio", "debtRatio", "dividendPaidAndCapexCoverageRatio", "dividendPayoutRatio", "dividendYield", "ebitPerRevenue", "ebtPerEbit", "effectiveTaxRate", "enterpriseValueMultiple", "fixedAssetTurnover", "freeCashFlowOperatingCashFlowRatio", "freeCashFlowPerShare", "grossProfitMargin", "id", "interestCoverage", "inventoryTurnover", "longTermDebtToCapitalization", "netIncomePerEBT", "netProfitMargin", "operatingCashFlowPerShare", "operatingCashFlowSalesRatio", "operatingCycle", "operatingProfitMargin", "payablesTurnover", "payoutRatio", "period", "pretaxProfitMargin", "priceCashFlowRatio", "priceEarningsRatio", "priceEarningsToGrowthRatio", "priceToBookRatio", "priceToFreeCashFlowsRatio", "priceToSalesRatio", "quickRatio", "receivablesTurnover", "returnOnAssets", "returnOnCapitalEmployed", "returnOnEquity", "shortTermCoverageRatios", "stockId", "symbol", "totalDebtToCapitalization", "updatedAt") SELECT "assetTurnover", "calendarYear", "capitalExpenditureCoverageRatio", "cashConversionCycle", "cashFlowCoverageRatios", "cashFlowToDebtRatio", "cashPerShare", "cashRatio", "companyEquityMultiplier", "createdAt", "currentRatio", "date", "daysOfInventoryOutstanding", "daysOfPayablesOutstanding", "daysOfSalesOutstanding", "debtEquityRatio", "debtRatio", "dividendPaidAndCapexCoverageRatio", "dividendPayoutRatio", "dividendYield", "ebitPerRevenue", "ebtPerEbit", "effectiveTaxRate", "enterpriseValueMultiple", "fixedAssetTurnover", "freeCashFlowOperatingCashFlowRatio", "freeCashFlowPerShare", "grossProfitMargin", "id", "interestCoverage", "inventoryTurnover", "longTermDebtToCapitalization", "netIncomePerEBT", "netProfitMargin", "operatingCashFlowPerShare", "operatingCashFlowSalesRatio", "operatingCycle", "operatingProfitMargin", "payablesTurnover", "payoutRatio", "period", "pretaxProfitMargin", "priceCashFlowRatio", "priceEarningsRatio", "priceEarningsToGrowthRatio", "priceToBookRatio", "priceToFreeCashFlowsRatio", "priceToSalesRatio", "quickRatio", "receivablesTurnover", "returnOnAssets", "returnOnCapitalEmployed", "returnOnEquity", "shortTermCoverageRatios", "stockId", "symbol", "totalDebtToCapitalization", "updatedAt" FROM "Financials";
DROP TABLE "Financials";
ALTER TABLE "new_Financials" RENAME TO "Financials";
CREATE INDEX "Financials_stockId_idx" ON "Financials"("stockId");
CREATE INDEX "Financials_stockId_date_idx" ON "Financials"("stockId", "date");
CREATE UNIQUE INDEX "Financials_stockId_calendarYear_key" ON "Financials"("stockId", "calendarYear");
CREATE TABLE "new_Notification" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Notification" ("createdAt", "id", "message", "read", "type", "updatedAt", "userId") SELECT "createdAt", "id", "message", "read", "type", "updatedAt", "userId" FROM "Notification";
DROP TABLE "Notification";
ALTER TABLE "new_Notification" RENAME TO "Notification";
CREATE INDEX "Notification_userId_read_createdAt_idx" ON "Notification"("userId", "read", "createdAt");
CREATE TABLE "new_Portfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "isPublic" DATETIME,
    "color" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Portfolio" ("color", "createdAt", "id", "isPublic", "title", "updatedAt", "userId") SELECT "color", "createdAt", "id", "isPublic", "title", "updatedAt", "userId" FROM "Portfolio";
DROP TABLE "Portfolio";
ALTER TABLE "new_Portfolio" RENAME TO "Portfolio";
CREATE INDEX "Portfolio_userId_idx" ON "Portfolio"("userId");
CREATE INDEX "Portfolio_userId_createdAt_idx" ON "Portfolio"("userId", "createdAt");
CREATE TABLE "new_PortfolioOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "deleted" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "stockId" INTEGER NOT NULL,
    CONSTRAINT "PortfolioOrder_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioOrder_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_PortfolioOrder" ("createdAt", "date", "deleted", "id", "portfolioId", "price", "quantity", "stockId", "type", "updatedAt") SELECT "createdAt", "date", "deleted", "id", "portfolioId", "price", "quantity", "stockId", "type", "updatedAt" FROM "PortfolioOrder";
DROP TABLE "PortfolioOrder";
ALTER TABLE "new_PortfolioOrder" RENAME TO "PortfolioOrder";
CREATE INDEX "PortfolioOrder_stockId_idx" ON "PortfolioOrder"("stockId");
CREATE INDEX "PortfolioOrder_portfolioId_date_idx" ON "PortfolioOrder"("portfolioId", "date");
CREATE INDEX "PortfolioOrder_portfolioId_deleted_idx" ON "PortfolioOrder"("portfolioId", "deleted");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "hashedPassword" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "biography" TEXT NOT NULL DEFAULT 'My beautiful biography.',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "twoFactor" TEXT,
    "publicProfile" DATETIME,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" DATETIME
);
INSERT INTO "new_User" ("biography", "createdAt", "email", "emailVerified", "hashedPassword", "id", "image", "name", "publicProfile", "role", "stripe_current_period_end", "stripe_customer_id", "stripe_price_id", "stripe_subscription_id", "updatedAt") SELECT "biography", "createdAt", "email", "emailVerified", "hashedPassword", "id", "image", "name", "publicProfile", "role", "stripe_current_period_end", "stripe_customer_id", "stripe_price_id", "stripe_subscription_id", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripe_customer_id_key" ON "User"("stripe_customer_id");
CREATE UNIQUE INDEX "User_stripe_subscription_id_key" ON "User"("stripe_subscription_id");
CREATE INDEX "User_email_idx" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_token_key" ON "PasswordResetRequest"("token");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_email_idx" ON "PasswordResetRequest"("email");

-- CreateIndex
CREATE INDEX "PasswordResetRequest_token_idx" ON "PasswordResetRequest"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetRequest_email_token_key" ON "PasswordResetRequest"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorEmailToken_token_key" ON "TwoFactorEmailToken"("token");

-- CreateIndex
CREATE INDEX "TwoFactorEmailToken_email_idx" ON "TwoFactorEmailToken"("email");

-- CreateIndex
CREATE INDEX "TwoFactorEmailToken_token_idx" ON "TwoFactorEmailToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorEmailToken_email_token_key" ON "TwoFactorEmailToken"("email", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorEmailConfirmation_userId_key" ON "TwoFactorEmailConfirmation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorTotpConfirmation_userId_key" ON "TwoFactorTotpConfirmation"("userId");
