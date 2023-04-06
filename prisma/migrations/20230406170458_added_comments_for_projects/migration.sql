-- CreateTable
CREATE TABLE `project_comment` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `reply_to_id` INTEGER NULL,

    UNIQUE INDEX `project_comment_comment_id_key`(`comment_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project_comment` ADD CONSTRAINT `project_comment_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`project_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_comment` ADD CONSTRAINT `project_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_comment` ADD CONSTRAINT `project_comment_reply_to_id_fkey` FOREIGN KEY (`reply_to_id`) REFERENCES `project_comment`(`comment_id`) ON DELETE SET NULL ON UPDATE CASCADE;
