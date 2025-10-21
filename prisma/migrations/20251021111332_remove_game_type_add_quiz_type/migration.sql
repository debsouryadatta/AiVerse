/*
  Warnings:

  - You are about to drop the column `gameType` on the `GameScore` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."GameScore_gameType_idx";

-- AlterTable
ALTER TABLE "GameScore" DROP COLUMN "gameType",
ADD COLUMN     "quizType" TEXT NOT NULL DEFAULT 'quick-solo';

-- CreateIndex
CREATE INDEX "GameScore_quizType_idx" ON "GameScore"("quizType");
