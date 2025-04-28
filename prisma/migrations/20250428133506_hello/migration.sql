-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "clientId" TEXT,
ADD COLUMN     "freelancerId" TEXT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_freelancerId_fkey" FOREIGN KEY ("freelancerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
