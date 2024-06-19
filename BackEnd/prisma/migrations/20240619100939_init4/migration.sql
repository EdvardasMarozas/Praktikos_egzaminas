/*
  Warnings:

  - You are about to drop the `_categoriestoevents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_categoriestoevents` DROP FOREIGN KEY `_CategoriesToEvents_A_fkey`;

-- DropForeignKey
ALTER TABLE `_categoriestoevents` DROP FOREIGN KEY `_CategoriesToEvents_B_fkey`;

-- AlterTable
ALTER TABLE `events` ADD COLUMN `categoriesId` INTEGER NULL;

-- DropTable
DROP TABLE `_categoriestoevents`;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
