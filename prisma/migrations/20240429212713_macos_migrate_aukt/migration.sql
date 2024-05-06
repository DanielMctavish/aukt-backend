/*
  Warnings:

  - Added the required column `hour` to the `AuctDateGroups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuctDateGroups" ADD COLUMN     "hour" TEXT NOT NULL;
