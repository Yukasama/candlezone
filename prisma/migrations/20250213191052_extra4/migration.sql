/*
  Warnings:

  - You are about to drop the column `updateFromDate` on the `Earnings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Earnings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "epsActual" REAL,
    "epsEstimated" REAL,
    "revenueActual" REAL,
    "revenueEstimated" REAL,
    "fiscalDateEnding" DATETIME,
    "updatedFromDate" DATETIME,
    "time" TEXT,
    "summarizedTranscript" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "stockId" INTEGER NOT NULL,
    CONSTRAINT "Earnings_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Earnings" ("createdAt", "date", "epsActual", "epsEstimated", "fiscalDateEnding", "id", "revenueActual", "revenueEstimated", "stockId", "summarizedTranscript", "time", "updatedAt") SELECT "createdAt", "date", "epsActual", "epsEstimated", "fiscalDateEnding", "id", "revenueActual", "revenueEstimated", "stockId", "summarizedTranscript", "time", "updatedAt" FROM "Earnings";
DROP TABLE "Earnings";
ALTER TABLE "new_Earnings" RENAME TO "Earnings";
CREATE INDEX "Earnings_stockId_idx" ON "Earnings"("stockId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
