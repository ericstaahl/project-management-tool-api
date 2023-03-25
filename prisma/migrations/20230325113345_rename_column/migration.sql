/*
  Warnings:

  - You are about to drop the column `finished` on the `project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `finished`,
    ADD COLUMN `complete` BOOLEAN NOT NULL DEFAULT false;
