-- CreateTable
CREATE TABLE "lead_activity_comments" (
    "id" TEXT NOT NULL,
    "leadActivityId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "commentById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lead_activity_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_activity_comments_leadActivityId_idx" ON "lead_activity_comments"("leadActivityId");

-- CreateIndex
CREATE INDEX "lead_activity_comments_commentById_idx" ON "lead_activity_comments"("commentById");

-- CreateIndex
CREATE INDEX "lead_activity_comments_createdAt_idx" ON "lead_activity_comments"("createdAt");

-- AddForeignKey
ALTER TABLE "lead_activity_comments" ADD CONSTRAINT "lead_activity_comments_leadActivityId_fkey" FOREIGN KEY ("leadActivityId") REFERENCES "LeadActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_activity_comments" ADD CONSTRAINT "lead_activity_comments_commentById_fkey" FOREIGN KEY ("commentById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
