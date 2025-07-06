/*
  Warnings:

  - You are about to drop the column `description` on the `QuizSet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `QuizSet` DROP COLUMN `description`,
    ADD COLUMN `progress` JSON NULL;
