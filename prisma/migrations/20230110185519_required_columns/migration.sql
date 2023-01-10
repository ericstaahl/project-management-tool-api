/*
  Warnings:

  - Made the column `title` on table `project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_date` on table `project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `due_date` on table `project` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `project` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `start_date` DATE NOT NULL,
    MODIFY `due_date` DATE NOT NULL;
