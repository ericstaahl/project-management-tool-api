/*
  Warnings:

  - A unique constraint covering the columns `[project_id,user_id]` on the table `project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `users_members` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `project_id` INTEGER NULL,
    `role` VARCHAR(191) NULL DEFAULT 'member',

    UNIQUE INDEX `users_members_id_key`(`id`),
    UNIQUE INDEX `users_members_project_id_user_id_key`(`project_id`, `user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `project_project_id_user_id_key` ON `project`(`project_id`, `user_id`);

-- AddForeignKey
ALTER TABLE `users_members` ADD CONSTRAINT `users_members_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_members` ADD CONSTRAINT `users_members_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
