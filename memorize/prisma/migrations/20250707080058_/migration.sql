/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SharedQuizSet` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `SharedQuizSet` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `SharedQuizSet` DROP FOREIGN KEY `SharedQuizSet_folderId_fkey`;

-- DropIndex
DROP INDEX `SharedQuizSet_folderId_fkey` ON `SharedQuizSet`;

-- AlterTable
ALTER TABLE `Folder` ADD COLUMN `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `QuizSet` ADD COLUMN `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `SharedQuizSet` DROP COLUMN `createdAt`,
    DROP COLUMN `folderId`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `_FolderSharedQuizSets` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FolderSharedQuizSets_AB_unique`(`A`, `B`),
    INDEX `_FolderSharedQuizSets_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_FolderSharedQuizSets` ADD CONSTRAINT `_FolderSharedQuizSets_A_fkey` FOREIGN KEY (`A`) REFERENCES `Folder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FolderSharedQuizSets` ADD CONSTRAINT `_FolderSharedQuizSets_B_fkey` FOREIGN KEY (`B`) REFERENCES `SharedQuizSet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
