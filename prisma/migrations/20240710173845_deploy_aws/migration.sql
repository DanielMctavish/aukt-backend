/*
  Warnings:

  - You are about to drop the column `product_id` on the `Bid` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bid" DROP CONSTRAINT "Bid_product_id_fkey";

-- AlterTable
ALTER TABLE "Bid" DROP COLUMN "product_id";

-- CreateTable
CREATE TABLE "_BidToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BidToProduct_AB_unique" ON "_BidToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_BidToProduct_B_index" ON "_BidToProduct"("B");

-- AddForeignKey
ALTER TABLE "_BidToProduct" ADD CONSTRAINT "_BidToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Bid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BidToProduct" ADD CONSTRAINT "_BidToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
