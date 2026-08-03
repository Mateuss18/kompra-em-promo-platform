CREATE TYPE "PromotionStore" AS ENUM ('AMAZON', 'MERCADO_LIVRE', 'SHOPEE');
CREATE TYPE "PromotionStatus" AS ENUM ('APPROVED', 'DRAFT', 'FAILED', 'PROCESSING', 'PUBLISHED', 'PUBLISHING', 'READY_FOR_REVIEW', 'REJECTED');
CREATE TYPE "PromotionWorkflowAction" AS ENUM ('APPROVE', 'PUBLISH', 'REJECT', 'SUBMIT_FOR_REVIEW');
CREATE TYPE "PromotionIngestionSource" AS ENUM ('TELEGRAM', 'WEB');

CREATE TABLE "promotions" (
  "id" TEXT NOT NULL,
  "sourceUrl" TEXT NOT NULL,
  "affiliateUrl" TEXT NOT NULL,
  "store" "PromotionStore" NOT NULL,
  "status" "PromotionStatus" NOT NULL DEFAULT 'DRAFT',
  "ingestionSource" "PromotionIngestionSource" NOT NULL,
  "sourceReference" TEXT,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "originalPriceInCents" INTEGER,
  "priceInCents" INTEGER NOT NULL,
  "couponCode" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "promotion_events" (
  "id" TEXT NOT NULL,
  "promotionId" TEXT NOT NULL,
  "action" "PromotionWorkflowAction" NOT NULL,
  "actor" "Role" NOT NULL DEFAULT 'ADMIN',
  "fromStatus" "PromotionStatus" NOT NULL,
  "toStatus" "PromotionStatus" NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "promotion_events_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "promotions_sourceReference_key" ON "promotions"("sourceReference");
CREATE INDEX "promotions_createdAt_idx" ON "promotions"("createdAt");
CREATE INDEX "promotions_status_idx" ON "promotions"("status");
CREATE INDEX "promotions_store_idx" ON "promotions"("store");
CREATE INDEX "promotion_events_promotionId_createdAt_idx" ON "promotion_events"("promotionId", "createdAt");

ALTER TABLE "promotion_events"
ADD CONSTRAINT "promotion_events_promotionId_fkey"
FOREIGN KEY ("promotionId") REFERENCES "promotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
