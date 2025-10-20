-- CreateTable
CREATE TABLE "VoiceMentor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "chatHistory" JSONB[],
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VoiceMentor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VoiceMentor_userId_idx" ON "VoiceMentor"("userId");

-- AddForeignKey
ALTER TABLE "VoiceMentor" ADD CONSTRAINT "VoiceMentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
