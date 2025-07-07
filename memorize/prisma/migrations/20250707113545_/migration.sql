/*
  Warnings:

  - You are about to drop the column `originalCreatorName` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `originalCreatorName` on the `QuizSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Folder` DROP COLUMN `originalCreatorName`;

-- AlterTable
ALTER TABLE `QuizSet` DROP COLUMN `originalCreatorName`,
    ADD COLUMN `originalCreatorId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `QuizSet` ADD CONSTRAINT `QuizSet_originalCreatorId_fkey` FOREIGN KEY (`originalCreatorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
