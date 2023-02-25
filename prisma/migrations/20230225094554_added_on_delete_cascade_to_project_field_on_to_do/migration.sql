-- DropForeignKey
ALTER TABLE `todo` DROP FOREIGN KEY `todo_project_id_fkey`;

-- AddForeignKey
ALTER TABLE `todo` ADD CONSTRAINT `todo_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;
