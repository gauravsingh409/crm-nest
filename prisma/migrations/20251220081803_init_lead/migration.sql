-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('FACEBOOK', 'INSTAGRAM', 'YOUTUBE', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "LeadCategory" AS ENUM ('FERTILITY_PATIENT', 'NOT_FERTILITY_PATIENT');

-- CreateEnum
CREATE TYPE "LeadService" AS ENUM ('ANTENATAL_CHECKUP', 'FERTILITY_PRESERVATION', 'INFERTILITY_TREATMENT', 'INFERTILITY_DIAGNOSIS');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "categories" "LeadCategory" NOT NULL,
    "service" "LeadService" NOT NULL,
    "source" "LeadSource" NOT NULL,
    "owner" TEXT,
    "address" TEXT,
    "dob" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_source_idx" ON "leads"("source");

-- CreateIndex
CREATE INDEX "leads_categories_idx" ON "leads"("categories");

-- CreateIndex
CREATE INDEX "leads_service_idx" ON "leads"("service");
