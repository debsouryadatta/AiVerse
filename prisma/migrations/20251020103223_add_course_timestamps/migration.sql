/*
  Warnings:

  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add columns with temporary defaults for existing records
ALTER TABLE "Course" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Course" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Update existing records to have the same timestamp
UPDATE "Course" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" = "createdAt";
