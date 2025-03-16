-- CreateTable
CREATE TABLE "TwoFactorFlow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "confirmed" DATETIME,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "TwoFactorFlow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TwoFactorFlow_userId_key" ON "TwoFactorFlow"("userId");
