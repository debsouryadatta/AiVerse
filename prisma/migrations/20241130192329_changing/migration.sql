/*
  Warnings:

  - You are about to drop the `UserSubscription` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "maxStorage" TEXT NOT NULL DEFAULT '100MB',
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'hobby',
ALTER COLUMN "credits" SET DEFAULT 2000;

-- DropTable
DROP TABLE "UserSubscription";
