/*
  Warnings:

  - You are about to drop the column `identifier` on the `VerificationRequest` table. All the data in the column will be lost.
  - Added the required column `email` to the `VerificationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VerificationRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_VerificationRequest" ("createdAt", "expires", "id", "token") SELECT "createdAt", "expires", "id", "token" FROM "VerificationRequest";
DROP TABLE "VerificationRequest";
ALTER TABLE "new_VerificationRequest" RENAME TO "VerificationRequest";
CREATE UNIQUE INDEX "VerificationRequest_token_key" ON "VerificationRequest"("token");
CREATE INDEX "VerificationRequest_email_idx" ON "VerificationRequest"("email");
CREATE INDEX "VerificationRequest_token_idx" ON "VerificationRequest"("token");
CREATE UNIQUE INDEX "VerificationRequest_email_token_key" ON "VerificationRequest"("email", "token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
