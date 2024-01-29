/*
  Warnings:

  - You are about to drop the column `nickname` on the `Advertiser` table. All the data in the column will be lost.
  - You are about to drop the column `url_fake_cover` on the `Advertiser` table. All the data in the column will be lost.
  - You are about to drop the column `img01_url` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `img02_url` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `img03_url` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `img04_url` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `img05_url` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `img06_url` on the `Product` table. All the data in the column will be lost.
  - Added the required column `company_adress` to the `Advertiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company_name` to the `Advertiser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reserve_value` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "admin_url_profile" TEXT;

-- AlterTable
ALTER TABLE "Advertiser" DROP COLUMN "nickname",
DROP COLUMN "url_fake_cover",
ADD COLUMN     "CNPJ" TEXT,
ADD COLUMN     "company_adress" TEXT NOT NULL,
ADD COLUMN     "company_name" TEXT NOT NULL,
ADD COLUMN     "url_profile_company_logo_cover" TEXT,
ALTER COLUMN "url_profile_cover" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "client_url_profile" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "img01_url",
DROP COLUMN "img02_url",
DROP COLUMN "img03_url",
DROP COLUMN "img04_url",
DROP COLUMN "img05_url",
DROP COLUMN "img06_url",
ADD COLUMN     "group_imgs_url" TEXT[],
ADD COLUMN     "reserve_value" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Moderator" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "moderator_url_profile" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Moderator_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Moderator_email_key" ON "Moderator"("email");
