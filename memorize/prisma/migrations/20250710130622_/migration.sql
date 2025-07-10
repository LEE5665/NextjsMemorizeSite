/*
  Warnings:

  - You are about to drop the column `progress` on the `QuizSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `QuizSet` DROP COLUMN `progress`;

-- CreateTable
CREATE TABLE `QuizProgress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `quizSetId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `data` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `QuizProgress_userId_quizSetId_type_key`(`userId`, `quizSetId`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuizProgress` ADD CONSTRAINT `QuizProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizProgress` ADD CONSTRAINT `QuizProgress_quizSetId_fkey` FOREIGN KEY (`quizSetId`) REFERENCES `QuizSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
