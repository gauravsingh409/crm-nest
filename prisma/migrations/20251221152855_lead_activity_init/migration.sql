/*
  Warnings:

  - The values [SPAN_TEST_LEAD] on the enum `LeadCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [DONAR_PROGRAM_SPERM] on the enum `LeadService` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `owner` on the `leads` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `leads` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('CALL');

-- CreateEnum
CREATE TYPE "CallOutcome" AS ENUM ('SUCCESS', 'BUSY', 'NO_RESPONSE', 'FAILED', 'WRONG_NUMBER', 'RECEIVED_BY_FAMILY');

-- AlterEnum
BEGIN;
CREATE TYPE "LeadCategory_new" AS ENUM ('FERTILITY_PATIENT', 'NOT_FERTILITY_PATIENT', 'SPAM_TEST_LEAD', 'GYANEA_PATIENT');
ALTER TABLE "leads" ALTER COLUMN "categories" TYPE "LeadCategory_new" USING ("categories"::text::"LeadCategory_new");
ALTER TYPE "LeadCategory" RENAME TO "LeadCategory_old";
ALTER TYPE "LeadCategory_new" RENAME TO "LeadCategory";
DROP TYPE "public"."LeadCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "LeadService_new" AS ENUM ('IVF', 'IUI', 'EGG_FREEZING', 'EMBRYO_FREEZING', 'DONOR_PROGRAM_EGG', 'DONOR_PROGRAM_SPERM', 'PGT_PGD', 'TESA_PESA', 'ANTENATAL_CHECKUP', 'INFERTILITY_DIAGNOSIS_GENERAL_COUNSELLING', 'GYANEA', 'FERTILITY_PRESERVATION');
ALTER TABLE "leads" ALTER COLUMN "service" TYPE "LeadService_new" USING ("service"::text::"LeadService_new");
ALTER TYPE "LeadService" RENAME TO "LeadService_old";
ALTER TYPE "LeadService_new" RENAME TO "LeadService";
DROP TYPE "public"."LeadService_old";
COMMIT;

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "owner",
ADD COLUMN     "ownerId" TEXT,
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "callOutcome" "CallOutcome",
    "durationSec" INTEGER,
    "notes" TEXT,
    "performedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_idx" ON "LeadActivity"("leadId");

-- CreateIndex
CREATE INDEX "LeadActivity_type_idx" ON "LeadActivity"("type");

-- CreateIndex
CREATE INDEX "LeadActivity_callOutcome_idx" ON "LeadActivity"("callOutcome");

-- CreateIndex
CREATE INDEX "LeadActivity_performedById_idx" ON "LeadActivity"("performedById");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");

-- CreateIndex
CREATE INDEX "leads_ownerId_idx" ON "leads"("ownerId");

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
