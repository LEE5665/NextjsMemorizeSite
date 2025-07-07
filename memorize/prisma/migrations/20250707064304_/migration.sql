-- AlterTable
ALTER TABLE `SharedQuizSet` ADD COLUMN `folderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `SharedQuizSet` ADD CONSTRAINT `SharedQuizSet_folderId_fkey` FOREIGN KEY (`folderId`) REFERENCES `Folder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
