/*
  Warnings:

  - The `chatHistory` column on the `VoiceMentor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "VoiceMentor" DROP COLUMN "chatHistory",
ADD COLUMN     "chatHistory" JSONB NOT NULL DEFAULT '[]';
