-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
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
    "publicProfile" BOOLEAN NOT NULL DEFAULT false,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" DATETIME
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Portfolio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PortfolioOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "quantity" REAL NOT NULL DEFAULT 1,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    CONSTRAINT "PortfolioOrder_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PortfolioOrder_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserRecentStocks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    CONSTRAINT "UserRecentStocks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRecentStocks_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stock" (
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
    "exchange" TEXT,
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
    "earningsDate" TEXT,
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

-- CreateTable
CREATE TABLE "Financials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "symbol" TEXT NOT NULL,
    "date" TEXT NOT NULL,
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
    "errorMsg" TEXT,
    "stockId" TEXT NOT NULL,
    CONSTRAINT "Financials_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripe_customer_id_key" ON "User"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripe_subscription_id_key" ON "User"("stripe_subscription_id");

-- CreateIndex
CREATE INDEX "Portfolio_userId_idx" ON "Portfolio"("userId");

-- CreateIndex
CREATE INDEX "PortfolioOrder_portfolioId_idx" ON "PortfolioOrder"("portfolioId");

-- CreateIndex
CREATE INDEX "PortfolioOrder_stockId_idx" ON "PortfolioOrder"("stockId");

-- CreateIndex
CREATE INDEX "UserRecentStocks_userId_idx" ON "UserRecentStocks"("userId");

-- CreateIndex
CREATE INDEX "UserRecentStocks_stockId_idx" ON "UserRecentStocks"("stockId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRecentStocks_userId_stockId_createdAt_key" ON "UserRecentStocks"("userId", "stockId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_key" ON "Stock"("symbol");

-- CreateIndex
CREATE INDEX "Financials_stockId_idx" ON "Financials"("stockId");

-- CreateIndex
CREATE INDEX "Financials_calendarYear_idx" ON "Financials"("calendarYear");

-- CreateIndex
CREATE UNIQUE INDEX "Financials_stockId_calendarYear_key" ON "Financials"("stockId", "calendarYear");
