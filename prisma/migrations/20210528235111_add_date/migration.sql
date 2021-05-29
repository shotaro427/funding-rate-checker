/*
  Warnings:

  - You are about to alter the column `execAt` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[fundingRateAt]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[execAt]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fundingRateAt` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `fundingRateAt` DATETIME NOT NULL,
    MODIFY `execAt` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `transactions.fundingRateAt_unique` ON `transactions`(`fundingRateAt`);

-- CreateIndex
CREATE UNIQUE INDEX `transactions.execAt_unique` ON `transactions`(`execAt`);
