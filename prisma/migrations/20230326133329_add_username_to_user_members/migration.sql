/*
  Warnings:

  - A unique constraint covering the columns `[user_id,username]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `users_members` DROP FOREIGN KEY `users_members_user_id_fkey`;

-- AlterTable
ALTER TABLE `users_members` ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_user_id_username_key` ON `user`(`user_id`, `username`);

-- AddForeignKey
ALTER TABLE `users_members` ADD CONSTRAINT `users_members_user_id_username_fkey` FOREIGN KEY (`user_id`, `username`) REFERENCES `user`(`user_id`, `username`) ON DELETE RESTRICT ON UPDATE CASCADE;
