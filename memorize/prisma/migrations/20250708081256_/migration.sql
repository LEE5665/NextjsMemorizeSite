-- DropForeignKey
ALTER TABLE `Folder` DROP FOREIGN KEY `Folder_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_quizSetId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizSet` DROP FOREIGN KEY `QuizSet_creatorId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizSet` DROP FOREIGN KEY `QuizSet_folderId_fkey`;

-- DropIndex
DROP INDEX `Folder_creatorId_fkey` ON `Folder`;

-- DropIndex
DROP INDEX `Question_quizSetId_fkey` ON `Question`;

-- DropIndex
DROP INDEX `QuizSet_creatorId_fkey` ON `QuizSet`;

-- DropIndex
DROP INDEX `QuizSet_folderId_fkey` ON `QuizSet`;

-- AddForeignKey
ALTER TABLE `Folder` ADD CONSTRAINT `Folder_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizSet` ADD CONSTRAINT `QuizSet_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuizSet` ADD CONSTRAINT `QuizSet_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_quizSetId_fkey` FOREIGN KEY (`quizSetId`) REFERENCES `QuizSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
