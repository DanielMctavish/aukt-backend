/*
  Warnings:

  - You are about to drop the column `creditCardId` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `creditCardId` on the `Advertiser` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Auct` table. All the data in the column will be lost.
  - The `csv_list` column on the `Auct` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `creditCardId` on the `Client` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Advertiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creator_id` to the `Auct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Auct` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Client` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `CreditCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "creditCardId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Advertiser" DROP COLUMN "creditCardId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Auct" DROP COLUMN "productId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creator_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "csv_list",
ADD COLUMN     "csv_list" TEXT[];

-- AlterTable
ALTER TABLE "Client" DROP COLUMN "creditCardId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "CreditCard" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
