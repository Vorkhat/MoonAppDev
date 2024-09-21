/*
  Warnings:

  - Added the required column `reward` to the `TopSnapshot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TopSnapshot" ADD COLUMN     "reward" BIGINT NOT NULL;
