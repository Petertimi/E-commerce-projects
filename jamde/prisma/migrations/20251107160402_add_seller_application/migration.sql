-- CreateTable
CREATE TABLE "seller_applications" (
    "id" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "craftType" TEXT NOT NULL,
    "businessDescription" TEXT NOT NULL,
    "yearsExperience" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seller_applications_email_idx" ON "seller_applications"("email");

-- CreateIndex
CREATE INDEX "seller_applications_status_idx" ON "seller_applications"("status");

-- CreateIndex
CREATE INDEX "seller_applications_createdAt_idx" ON "seller_applications"("createdAt");
