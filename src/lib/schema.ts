import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import {
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import type { AdapterAccountType } from 'next-auth/adapters';

const client = createClient({
  url: 'DATABASE_URL',
  authToken: 'DATABASE_AUTH_TOKEN',
});
export const db = drizzle(client);

export const users = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
});

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
);

export const logs = sqliteTable('log', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  level: text('level').notNull(),
  message: text('message').notNull(),
  timestamp: integer('timestamp', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const portfolios = sqliteTable(
  'portfolio',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text('title').notNull(),
    isPublic: boolean('isPublic').notNull().default(false),
    color: text('color'),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (portfolios) => ({
    userIndex: index().on(portfolios.userId),
  }),
);

export const portfolioOrders = sqliteTable(
  'portfolioOrder',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    type: text('type').notNull(),
    price: real('price').notNull(),
    quantity: real('quantity').notNull().default(1),
    deleted: boolean('deleted').notNull().default(false),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    portfolioId: text('portfolioId')
      .notNull()
      .references(() => portfolios.id, { onDelete: 'cascade' }),
    stockId: text('stockId')
      .notNull()
      .references(() => stocks.id, { onDelete: 'cascade' }),
  },
  (portfolioOrders) => ({
    portfolioIndex: index().on(portfolioOrders.portfolioId),
    stockIndex: index().on(portfolioOrders.stockId),
  }),
);

// UserRecentStocks table
export const userRecentStocks = sqliteTable(
  'userRecentStocks',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    stockId: text('stockId')
      .notNull()
      .references(() => stocks.id, { onDelete: 'cascade' }),
  },
  (userRecentStocks) => ({
    uniqueUserStock: unique().on(
      userRecentStocks.userId,
      userRecentStocks.stockId,
      userRecentStocks.createdAt,
    ),
    userIndex: index().on(userRecentStocks.userId),
    stockIndex: index().on(userRecentStocks.stockId),
  }),
);

export const stocks = sqliteTable(
  'stock',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    symbol: text('symbol').notNull().unique(),
    eye: integer('eye'),
    beta: real('beta'),
    mktCap: real('mktCap'),
    range: text('range'),
    companyName: text('companyName').notNull(),
    currency: text('currency'),
    cik: text('cik'),
    isin: text('isin'),
    cusip: text('cusip'),
    exchange: text('exchange'),
    exchangeShortName: text('exchangeShortName'),
    industry: text('industry'),
    website: text('website'),
    description: text('description'),
    ceo: text('ceo'),
    sector: text('sector'),
    country: text('country'),
    fullTimeEmployees: text('fullTimeEmployees'),
    address: text('address'),
    city: text('city'),
    state: text('state'),
    zip: text('zip'),
    dcfDiff: real('dcfDiff'),
    dcf: real('dcf'),
    image: text('image').notNull(),
    isEtf: boolean('isEtf'),
    isActivelyTrading: boolean('isActivelyTrading'),
    isFund: boolean('isFund'),
    earningsDate: text('earningsDate'),
    earningsEps: real('earningsEps'),
    earningsEpsEstimated: real('earningsEpsEstimated'),
    earningsTime: text('earningsTime'),
    earningsRevenue: real('earningsRevenue'),
    earningsRevenueEstimated: real('earningsRevenueEstimated'),
    dividendYielTTM: real('dividendYielTTM'),
    dividendYielPercentageTTM: real('dividendYielPercentageTTM'),
    peRatioTTM: real('peRatioTTM'),
    pegRatioTTM: real('pegRatioTTM'),
    payoutRatioTTM: real('payoutRatioTTM'),
    currentRatioTTM: real('currentRatioTTM'),
    quickRatioTTM: real('quickRatioTTM'),
    cashRatioTTM: real('cashRatioTTM'),
    daysOfSalesOutstandingTTM: real('daysOfSalesOutstandingTTM'),
    daysOfInventoryOutstandingTTM: real('daysOfInventoryOutstandingTTM'),
    operatingCycleTTM: real('operatingCycleTTM'),
    daysOfPayablesOutstandingTTM: real('daysOfPayablesOutstandingTTM'),
    cashConversionCycleTTM: real('cashConversionCycleTTM'),
    grossProfitMarginTTM: real('grossProfitMarginTTM'),
    operatingProfitMarginTTM: real('operatingProfitMarginTTM'),
    pretaxProfitMarginTTM: real('pretaxProfitMarginTTM'),
    netProfitMarginTTM: real('netProfitMarginTTM'),
    effectiveTaxRateTTM: real('effectiveTaxRateTTM'),
    returnOnAssetsTTM: real('returnOnAssetsTTM'),
    returnOnEquityTTM: real('returnOnEquityTTM'),
    returnOnCapitalEmployedTTM: real('returnOnCapitalEmployedTTM'),
    netIncomePerEBTTTM: real('netIncomePerEBTTTM'),
    ebtPerEbitTTM: real('ebtPerEbitTTM'),
    ebitPerRevenueTTM: real('ebitPerRevenueTTM'),
    debtRatioTTM: real('debtRatioTTM'),
    debtEquityRatioTTM: real('debtEquityRatioTTM'),
    longTermDebtToCapitalizationTTM: real('longTermDebtToCapitalizationTTM'),
    totalDebtToCapitalizationTTM: real('totalDebtToCapitalizationTTM'),
    interestCoverageTTM: real('interestCoverageTTM'),
    cashFlowToDebtRatioTTM: real('cashFlowToDebtRatioTTM'),
    companyEquityMultiplierTTM: real('companyEquityMultiplierTTM'),
    receivablesTurnoverTTM: real('receivablesTurnoverTTM'),
    payablesTurnoverTTM: real('payablesTurnoverTTM'),
    inventoryTurnoverTTM: real('inventoryTurnoverTTM'),
    fixedAssetTurnoverTTM: real('fixedAssetTurnoverTTM'),
    assetTurnoverTTM: real('assetTurnoverTTM'),
    operatingCashFlowPerShareTTM: real('operatingCashFlowPerShareTTM'),
    freeCashFlowPerShareTTM: real('freeCashFlowPerShareTTM'),
    cashPerShareTTM: real('cashPerShareTTM'),
    operatingCashFlowSalesRatioTTM: real('operatingCashFlowSalesRatioTTM'),
    freeCashFlowOperatingCashFlowRatioTTM: real(
      'freeCashFlowOperatingCashFlowRatioTTM',
    ),
    cashFlowCoverageRatiosTTM: real('cashFlowCoverageRatiosTTM'),
    shortTermCoverageRatiosTTM: real('shortTermCoverageRatiosTTM'),
    capitalExpenditureCoverageRatioTTM: real(
      'capitalExpenditureCoverageRatioTTM',
    ),
    dividendPaidAndCapexCoverageRatioTTM: real(
      'dividendPaidAndCapexCoverageRatioTTM',
    ),
    priceToBookRatioTTM: real('priceToBookRatioTTM'),
    priceToSalesRatioTTM: real('priceToSalesRatioTTM'),
    priceEarningsRatioTTM: real('priceEarningsRatioTTM'),
    priceToFreeCashFlowsRatioTTM: real('priceToFreeCashFlowsRatioTTM'),
    priceCashFlowRatioTTM: real('priceCashFlowRatioTTM'),
    priceEarningsToGrowthRatioTTM: real('priceEarningsToGrowthRatioTTM'),
    enterpriseValueMultipleTTM: real('enterpriseValueMultipleTTM'),
    dividendPerShareTTM: real('dividendPerShareTTM'),
    targetHigh: real('targetHigh'),
    targetLow: real('targetLow'),
    targetConsensus: real('targetConsensus'),
    targetMedian: real('targetMedian'),
    peersList: text('peersList'),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    errorMsg: text('errorMsg'),
  },
  (stocks) => ({
    symbolIndex: index().on(stocks.symbol),
  }),
);

export const financials = sqliteTable(
  'financials',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    symbol: text('symbol').notNull(),
    date: text('date').notNull(),
    calendarYear: text('calendarYear').notNull(),
    period: text('period').notNull(),
    currentRatio: real('currentRatio'),
    quickRatio: real('quickRatio'),
    cashRatio: real('cashRatio'),
    daysOfSalesOutstanding: real('daysOfSalesOutstanding'),
    daysOfInventoryOutstanding: real('daysOfInventoryOutstanding'),
    operatingCycle: real('operatingCycle'),
    daysOfPayablesOutstanding: real('daysOfPayablesOutstanding'),
    cashConversionCycle: real('cashConversionCycle'),
    grossProfitMargin: real('grossProfitMargin'),
    operatingProfitMargin: real('operatingProfitMargin'),
    pretaxProfitMargin: real('pretaxProfitMargin'),
    netProfitMargin: real('netProfitMargin'),
    effectiveTaxRate: real('effectiveTaxRate'),
    returnOnAssets: real('returnOnAssets'),
    returnOnEquity: real('returnOnEquity'),
    returnOnCapitalEmployed: real('returnOnCapitalEmployed'),
    netIncomePerEBT: real('netIncomePerEBT'),
    ebtPerEbit: real('ebtPerEbit'),
    ebitPerRevenue: real('ebitPerRevenue'),
    debtRatio: real('debtRatio'),
    debtEquityRatio: real('debtEquityRatio'),
    longTermDebtToCapitalization: real('longTermDebtToCapitalization'),
    totalDebtToCapitalization: real('totalDebtToCapitalization'),
    interestCoverage: real('interestCoverage'),
    cashFlowToDebtRatio: real('cashFlowToDebtRatio'),
    companyEquityMultiplier: real('companyEquityMultiplier'),
    receivablesTurnover: real('receivablesTurnover'),
    payablesTurnover: real('payablesTurnover'),
    inventoryTurnover: real('inventoryTurnover'),
    fixedAssetTurnover: real('fixedAssetTurnover'),
    assetTurnover: real('assetTurnover'),
    operatingCashFlowPerShare: real('operatingCashFlowPerShare'),
    freeCashFlowPerShare: real('freeCashFlowPerShare'),
    cashPerShare: real('cashPerShare'),
    payoutRatio: real('payoutRatio'),
    operatingCashFlowSalesRatio: real('operatingCashFlowSalesRatio'),
    freeCashFlowOperatingCashFlowRatio: real(
      'freeCashFlowOperatingCashFlowRatio',
    ),
    cashFlowCoverageRatios: real('cashFlowCoverageRatios'),
    shortTermCoverageRatios: real('shortTermCoverageRatios'),
    capitalExpenditureCoverageRatio: real('capitalExpenditureCoverageRatio'),
    dividendPaidAndCapexCoverageRatio: real(
      'dividendPaidAndCapexCoverageRatio',
    ),
    dividendPayoutRatio: real('dividendPayoutRatio'),
    priceToBookRatio: real('priceToBookRatio'),
    priceToSalesRatio: real('priceToSalesRatio'),
    priceEarningsRatio: real('priceEarningsRatio'),
    priceToFreeCashFlowsRatio: real('priceToFreeCashFlowsRatio'),
    priceCashFlowRatio: real('priceCashFlowRatio'),
    priceEarningsToGrowthRatio: real('priceEarningsToGrowthRatio'),
    dividendYield: real('dividendYield'),
    enterpriseValueMultiple: real('enterpriseValueMultiple'),
    createdAt: integer('createdAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updatedAt', { mode: 'timestamp' })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    errorMsg: text('errorMsg'),
    stockId: text('stockId')
      .notNull()
      .references(() => stocks.id, { onDelete: 'cascade' }),
  },
  (financials) => ({
    uniqueStockYear: unique().on(financials.stockId, financials.calendarYear),
    stockIndex: index().on(financials.stockId),
    calendarYearIndex: index().on(financials.calendarYear),
  }),
);
