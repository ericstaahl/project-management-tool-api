/*
  Warnings:

  - You are about to drop the column `reply_to_id` on the `project_comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `project_comment` DROP FOREIGN KEY `project_comment_reply_to_id_fkey`;

-- AlterTable
ALTER TABLE `project_comment` DROP COLUMN `reply_to_id`;
