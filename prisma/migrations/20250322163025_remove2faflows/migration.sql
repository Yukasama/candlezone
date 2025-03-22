/*
  Warnings:

  - You are about to drop the `TwoFactorEmailConfirmation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwoFactorEmailToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TwoFactorFlow` table. If the table is not empty, all the data it contains will be lost.
  - You are about to alter the column `twoFactor` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- DropIndex
DROP INDEX "TwoFactorEmailConfirmation_userId_key";

-- DropIndex
DROP INDEX "TwoFactorEmailToken_email_token_key";

-- DropIndex
DROP INDEX "TwoFactorEmailToken_token_idx";

-- DropIndex
DROP INDEX "TwoFactorEmailToken_email_idx";

-- DropIndex
DROP INDEX "TwoFactorEmailToken_token_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwoFactorEmailConfirmation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwoFactorEmailToken";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "TwoFactorFlow";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    "twoFactor" DATETIME,
    "publicProfile" DATETIME,
    "stripe_customer_id" TEXT,
    "stripe_subscription_id" TEXT,
    "stripe_price_id" TEXT,
    "stripe_current_period_end" DATETIME
);
INSERT INTO "new_User" ("biography", "createdAt", "email", "emailVerified", "hashedPassword", "id", "image", "name", "publicProfile", "role", "stripe_current_period_end", "stripe_customer_id", "stripe_price_id", "stripe_subscription_id", "twoFactor", "updatedAt") SELECT "biography", "createdAt", "email", "emailVerified", "hashedPassword", "id", "image", "name", "publicProfile", "role", "stripe_current_period_end", "stripe_customer_id", "stripe_price_id", "stripe_subscription_id", "twoFactor", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_stripe_customer_id_key" ON "User"("stripe_customer_id");
CREATE UNIQUE INDEX "User_stripe_subscription_id_key" ON "User"("stripe_subscription_id");
CREATE INDEX "User_email_idx" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
