-- AlterTable
ALTER TABLE `events` ADD COLUMN `usersId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
