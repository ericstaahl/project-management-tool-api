-- AlterTable
ALTER TABLE `todo` ADD COLUMN `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'NOT_STARTED';
