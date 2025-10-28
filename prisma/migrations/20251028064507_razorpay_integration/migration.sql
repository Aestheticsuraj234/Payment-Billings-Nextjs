-- CreateEnum
CREATE TYPE "razorpay_plan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "razorpayPlan" "razorpay_plan" NOT NULL DEFAULT 'FREE';

-- CreateTable
CREATE TABLE "razorpay_subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "razorpay_plan" NOT NULL,
    "razorpaySubscriptionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "razorpay_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "razorpay_subscription_userId_key" ON "razorpay_subscription"("userId");

-- AddForeignKey
ALTER TABLE "razorpay_subscription" ADD CONSTRAINT "razorpay_subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
