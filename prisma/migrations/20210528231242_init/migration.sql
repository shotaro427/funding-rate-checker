-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fundingRate` DOUBLE NOT NULL,
    `symble` ENUM('btcusd', 'ethusd', 'eosusd', 'xrpusd') NOT NULL,
    `side` VARCHAR(255) NOT NULL,
    `size` DOUBLE NOT NULL,
    `execFee` DOUBLE NOT NULL,
    `execAt` DATETIME NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
