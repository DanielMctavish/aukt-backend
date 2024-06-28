/*
  Warnings:

  - The values [canceld] on the enum `AuctStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `winner_id` on the `Auct` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuctStatus_new" AS ENUM ('cataloged', 'live', 'canceled', 'finished', 'paused', 'pending');
ALTER TABLE "Auct" ALTER COLUMN "status" TYPE "AuctStatus_new" USING ("status"::text::"AuctStatus_new");
ALTER TYPE "AuctStatus" RENAME TO "AuctStatus_old";
ALTER TYPE "AuctStatus_new" RENAME TO "AuctStatus";
DROP TYPE "AuctStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Auct" DROP COLUMN "winner_id";

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "product_id" TEXT;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "client_avatar" INTEGER,
ADD COLUMN     "nickname" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "winner_id" TEXT;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
