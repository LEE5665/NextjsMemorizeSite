/*
  Warnings:

  - You are about to drop the column `originalCreatorId` on the `QuizSet` table. All the data in the column will be lost.
  - You are about to drop the `_FolderToQuizSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `QuizSet` DROP FOREIGN KEY `QuizSet_originalCreatorId_fkey`;

-- DropForeignKey
ALTER TABLE `_FolderToQuizSet` DROP FOREIGN KEY `_FolderToQuizSet_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FolderToQuizSet` DROP FOREIGN KEY `_FolderToQuizSet_B_fkey`;

-- DropIndex
DROP INDEX `QuizSet_originalCreatorId_fkey` ON `QuizSet`;

-- AlterTable
ALTER TABLE `QuizSet` DROP COLUMN `originalCreatorId`,
    ADD COLUMN `folderId` INTEGER NULL;

-- DropTable
DROP TABLE `_FolderToQuizSet`;

-- AddForeignKey
ALTER TABLE `QuizSet` ADD CONSTRAINT `QuizSet_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
