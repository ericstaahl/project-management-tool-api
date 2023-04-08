-- CreateTable
CREATE TABLE `todo_comment` (
    `comment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `todo_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `time_posted` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `todo_comment_comment_id_key`(`comment_id`),
    PRIMARY KEY (`comment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `todo_comment` ADD CONSTRAINT `todo_comment_todo_id_fkey` FOREIGN KEY (`todo_id`) REFERENCES `todo`(`todo_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `todo_comment` ADD CONSTRAINT `todo_comment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
