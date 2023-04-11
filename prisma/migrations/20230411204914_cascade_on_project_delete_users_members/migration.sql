-- DropForeignKey
ALTER TABLE `users_members` DROP FOREIGN KEY `users_members_project_id_fkey`;

-- AddForeignKey
ALTER TABLE `users_members` ADD CONSTRAINT `users_members_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;
