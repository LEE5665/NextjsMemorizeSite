/*
  Warnings:

  - You are about to drop the column `parentId` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `QuizSet` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `QuizSet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Folder` DROP FOREIGN KEY `Folder_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `QuizSet` DROP FOREIGN KEY `QuizSet_folderId_fkey`;

-- DropIndex
DROP INDEX `Folder_parentId_fkey` ON `Folder`;

-- DropIndex
DROP INDEX `QuizSet_folderId_fkey` ON `QuizSet`;

-- AlterTable
ALTER TABLE `Folder` DROP COLUMN `parentId`;

-- AlterTable
ALTER TABLE `QuizSet` DROP COLUMN `folderId`,
    DROP COLUMN `order`;

-- CreateTable
CREATE TABLE `_FolderQuizSets` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FolderQuizSets_AB_unique`(`A`, `B`),
    INDEX `_FolderQuizSets_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FolderQuizSets` ADD CONSTRAINT `_FolderQuizSets_A_fkey` FOREIGN KEY (`A`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FolderQuizSets` ADD CONSTRAINT `_FolderQuizSets_B_fkey` FOREIGN KEY (`B`) REFERENCES `QuizSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
