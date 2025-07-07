/*
  Warnings:

  - You are about to drop the `SharedQuizSet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FolderQuizSets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FolderSharedQuizSets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SharedQuizSet` DROP FOREIGN KEY `SharedQuizSet_quizSetId_fkey`;

-- DropForeignKey
ALTER TABLE `SharedQuizSet` DROP FOREIGN KEY `SharedQuizSet_userId_fkey`;

-- DropForeignKey
ALTER TABLE `_FolderQuizSets` DROP FOREIGN KEY `_FolderQuizSets_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FolderQuizSets` DROP FOREIGN KEY `_FolderQuizSets_B_fkey`;

-- DropForeignKey
ALTER TABLE `_FolderSharedQuizSets` DROP FOREIGN KEY `_FolderSharedQuizSets_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FolderSharedQuizSets` DROP FOREIGN KEY `_FolderSharedQuizSets_B_fkey`;

-- AlterTable
ALTER TABLE `Folder` ADD COLUMN `originalCreatorName` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `QuizSet` ADD COLUMN `originalCreatorName` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `SharedQuizSet`;

-- DropTable
DROP TABLE `_FolderQuizSets`;

-- DropTable
DROP TABLE `_FolderSharedQuizSets`;

-- CreateTable
CREATE TABLE `_FolderToQuizSet` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FolderToQuizSet_AB_unique`(`A`, `B`),
    INDEX `_FolderToQuizSet_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FolderToQuizSet` ADD CONSTRAINT `_FolderToQuizSet_A_fkey` FOREIGN KEY (`A`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FolderToQuizSet` ADD CONSTRAINT `_FolderToQuizSet_B_fkey` FOREIGN KEY (`B`) REFERENCES `QuizSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
