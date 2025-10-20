/*
  Warnings:

  - You are about to drop the column `maxStorage` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tier` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "maxStorage",
DROP COLUMN "tier";
