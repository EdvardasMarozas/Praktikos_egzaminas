-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 19, 2024 at 02:27 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `miesto_renginiai`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Doloremque dolore qu'),
(2, 'Commodi sed vel rati'),
(3, 'Commodi sed vel rati'),
(4, 'Commodi sed vel rati'),
(5, 'Commodi sed vel rati'),
(6, 'Commodi sed vel rati'),
(7, 'Soluta aliquam offic'),
(8, 'Soluta aliquam offic'),
(9, 'Qui ea labore non se');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `name` varchar(191) NOT NULL,
  `date` datetime(3) NOT NULL,
  `location` varchar(191) NOT NULL,
  `photo` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL,
  `confirmed` tinyint(1) NOT NULL,
  `categoriesId` int(11) DEFAULT NULL,
  `usersId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `date`, `location`, `photo`, `rating`, `confirmed`, `categoriesId`, `usersId`) VALUES
(1, 'Leonard Silva', '1991-09-27 23:11:00.000', 'Suscipit excepteur N', 'default.jpg', 0, 0, 1, NULL),
(2, 'Cathleen Morse', '2006-10-14 02:27:00.000', 'Rerum consequatur ea', 'default.jpg', 0, 0, 6, NULL),
(3, 'Ethan Georgeee', '2016-10-10 10:19:00.000', 'Ex velit voluptate ', '', 0, 0, 8, 1),
(4, 'Ulysses Bender', '1995-04-08 15:25:00.000', 'In duis ipsam quasi ', 'default.jpg', 0, 0, 9, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `blocked` tinyint(1) NOT NULL DEFAULT 0,
  `role` enum('USER','ADMIN') NOT NULL DEFAULT 'USER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `blocked`, `role`) VALUES
(1, 'test123', '$2a$10$kICcbrXKy7m2B06x/oTg6.4bWZg2Spbg32uNG9CvdsWYrUkIIyTRi', 1, 'USER'),
(2, 'admin', '$2a$10$5lN.dhePrT8KWUa4jljxSOtfyB0r.yTzmE1AVfW8./iGERVJ1eCM.', 0, 'ADMIN');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('95a919d0-5b33-413f-8936-eb695c2918f2', '00f125cb9a491d9014c90146bce7889e73bab9f46fb146f88e0c9c2716a4f2ed', '2024-06-19 11:16:02.795', '20240619100939_init4', NULL, NULL, '2024-06-19 11:16:02.743', 1),
('9f71a920-1530-45e6-85a9-2baa7cf6d2d2', 'ea641c66ecd60df79d3de3568d64d2445b8e9fd84d6154a829bf67b0e7f25351', '2024-06-19 11:16:03.334', '20240619111603_init5', NULL, NULL, '2024-06-19 11:16:03.272', 1),
('b74f2b09-366a-439d-a1ff-1eb0517ef5ab', '7fcaa1421903f01dbefb500a3ec8bedb1dd37cfc250d5658d9bfde2444e58381', '2024-06-19 11:16:02.742', '20240619081301_init3', NULL, NULL, '2024-06-19 11:16:02.731', 1),
('c3eed4d7-2cf2-4d94-9dad-d7320e5f951a', 'e056a2012588506186890f6ee173477cf9e09c0d5e55e88810736b32b9fd7a91', '2024-06-19 11:16:02.722', '20240619063019_init', NULL, NULL, '2024-06-19 11:16:02.594', 1),
('f79a0ad0-8bc7-465b-a276-ced25931b2c3', '381ea67300b4187248085157bd478a3c3191bf3d0f976bbaa51b62cc5b2d3bd5', '2024-06-19 11:16:02.730', '20240619080857_init', NULL, NULL, '2024-06-19 11:16:02.724', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Events_categoriesId_fkey` (`categoriesId`),
  ADD KEY `Events_usersId_fkey` (`usersId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Users_username_key` (`username`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `Events_categoriesId_fkey` FOREIGN KEY (`categoriesId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Events_usersId_fkey` FOREIGN KEY (`usersId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
