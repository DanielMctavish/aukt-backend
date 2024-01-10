/*
  Warnings:

  - You are about to drop the column `csv_list` on the `Auct` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `advertiserId` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `CreditCard` table. All the data in the column will be lost.
  - You are about to drop the `_AuctToProduct` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Advertiser` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `CPF` to the `Advertiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Advertiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url_fake_cover` to the `Advertiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url_profile_cover` to the `Advertiser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_adminId_fkey";

-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_advertiserId_fkey";

-- DropForeignKey
ALTER TABLE "CreditCard" DROP CONSTRAINT "CreditCard_clientId_fkey";

-- DropForeignKey
ALTER TABLE "_AuctToProduct" DROP CONSTRAINT "_AuctToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_AuctToProduct" DROP CONSTRAINT "_AuctToProduct_B_fkey";

-- AlterTable
ALTER TABLE "Advertiser" ADD COLUMN     "CPF" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "url_fake_cover" TEXT NOT NULL,
ADD COLUMN     "url_profile_cover" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Auct" DROP COLUMN "csv_list",
ADD COLUMN     "advertiser_id" TEXT,
ADD COLUMN     "client_id" TEXT,
ADD COLUMN     "winner_id" TEXT;

-- AlterTable
ALTER TABLE "CreditCard" DROP COLUMN "adminId",
DROP COLUMN "advertiserId",
DROP COLUMN "clientId",
ADD COLUMN     "admin_id" TEXT,
ADD COLUMN     "advertiser_id" TEXT,
ADD COLUMN     "client_id" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "advertiser_id" TEXT,
ADD COLUMN     "auct_id" TEXT;

-- DropTable
DROP TABLE "_AuctToProduct";

-- CreateTable
CREATE TABLE "Bid" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "client_id" TEXT,
    "auct_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuctToClient" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AuctToClient_AB_unique" ON "_AuctToClient"("A", "B");

-- CreateIndex
CREATE INDEX "_AuctToClient_B_index" ON "_AuctToClient"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Advertiser_email_key" ON "Advertiser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");

-- AddForeignKey
ALTER TABLE "Auct" ADD CONSTRAINT "Auct_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "Advertiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "Advertiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_advertiser_id_fkey" FOREIGN KEY ("advertiser_id") REFERENCES "Advertiser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_auct_id_fkey" FOREIGN KEY ("auct_id") REFERENCES "Auct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_auct_id_fkey" FOREIGN KEY ("auct_id") REFERENCES "Auct"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuctToClient" ADD CONSTRAINT "_AuctToClient_A_fkey" FOREIGN KEY ("A") REFERENCES "Auct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuctToClient" ADD CONSTRAINT "_AuctToClient_B_fkey" FOREIGN KEY ("B") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
