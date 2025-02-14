-- AlterTable
ALTER TABLE "Stock" ADD COLUMN "averageVolume" REAL;

-- CreateTable
CREATE TABLE "Earnings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "epsActual" REAL,
    "epsEstimated" REAL,
    "revenueActual" REAL,
    "revenueEstimated" REAL,
    "fiscalDateEnding" DATETIME,
    "updateFromDate" DATETIME,
    "time" TEXT,
    "summarizedTranscript" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "stockId" INTEGER NOT NULL,
    CONSTRAINT "Earnings_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Earnings_stockId_idx" ON "Earnings"("stockId");
