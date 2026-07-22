/*
  Warnings:

  - You are about to drop the column `buyerId` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `sellerId` on the `trades` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."trades" DROP CONSTRAINT "trades_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."trades" DROP CONSTRAINT "trades_sellerId_fkey";

-- DropIndex
DROP INDEX "public"."trades_buyerId_idx";

-- DropIndex
DROP INDEX "public"."trades_sellerId_idx";

-- AlterTable
ALTER TABLE "public"."trades" DROP COLUMN "buyerId",
DROP COLUMN "sellerId";
