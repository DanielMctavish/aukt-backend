/*
  Warnings:

  - Added the required column `product_timer_seconds` to the `Auct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Auct` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuctStatus" AS ENUM ('cataloged', 'live', 'canceld');

-- AlterTable
ALTER TABLE "Auct" ADD COLUMN     "product_timer_seconds" INTEGER NOT NULL,
ADD COLUMN     "status" "AuctStatus" NOT NULL;
