/*
  Warnings:

  - Added the required column `voiceId` to the `VoiceMentor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VoiceMentor" ADD COLUMN     "voiceId" TEXT NOT NULL;
