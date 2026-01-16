-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 14, 2026 at 12:08 PM
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
-- Database: `manpower_booking_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_settings`
--

CREATE TABLE `admin_settings` (
  `setting_id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text NOT NULL,
  `description` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_settings`
--

INSERT INTO `admin_settings` (`setting_id`, `setting_key`, `setting_value`, `description`, `updated_at`) VALUES
(1, 'default_advance_percentage', '25', 'Default advance payment percentage for all services', '2026-01-09 07:25:49'),
(2, 'booking_notification_email', 'admin@jaannetwork.com', 'Email to send new booking notifications', '2026-01-09 07:25:49'),
(3, 'support_phone', '0112345678', 'Customer support phone number', '2026-01-09 07:25:49'),
(4, 'company_address', 'No.46, Hudson Rd, Colombo 03', 'Company physical address', '2026-01-09 07:25:49');

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `booking_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `number_of_workers` int(11) NOT NULL DEFAULT 1,
  `work_description` text DEFAULT NULL,
  `location` text NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `total_days` int(11) GENERATED ALWAYS AS (to_days(`end_date`) - to_days(`start_date`) + 1) STORED,
  `total_amount_lkr` decimal(12,2) NOT NULL,
  `advance_amount_lkr` decimal(12,2) NOT NULL,
  `remaining_amount_lkr` decimal(12,2) GENERATED ALWAYS AS (`total_amount_lkr` - `advance_amount_lkr`) STORED,
  `booking_status` enum('pending','confirmed','assigned','in_progress','completed','cancelled') DEFAULT 'pending',
  `payment_status` enum('pending','advance_paid','fully_paid','refunded') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `customer_id`, `service_id`, `number_of_workers`, `work_description`, `location`, `start_date`, `end_date`, `total_amount_lkr`, `advance_amount_lkr`, `booking_status`, `payment_status`, `created_at`, `updated_at`) VALUES
(6, 12, 8, 1, 'Garden maintenance and lawn mowing', '', '2026-01-17', '2026-01-17', 15000.00, 7500.00, 'pending', 'pending', '2026-01-09 10:41:01', '2026-01-09 10:41:01'),
(7, 13, 9, 1, 'Fix leaking pipes in kitchen', '', '2026-01-18', '2026-01-18', 20000.00, 10000.00, 'completed', 'pending', '2026-01-09 10:41:01', '2026-01-12 08:58:48'),
(10, 39, 2, 2, 'mm', 'mm', '2026-01-13', '2026-01-15', 12000.00, 3000.00, 'pending', 'pending', '2026-01-13 11:39:59', '2026-01-13 11:39:59'),
(11, 24, 7, 4, 'gggg', 'ggg', '2026-01-15', '2026-01-15', 0.00, 0.00, 'pending', 'pending', '2026-01-14 05:18:58', '2026-01-14 05:18:58'),
(12, 24, 2, 1, 'vv', 'vv', '2026-01-14', '2026-01-15', 4000.00, 1000.00, 'assigned', 'pending', '2026-01-14 05:20:10', '2026-01-14 07:58:19');

-- --------------------------------------------------------

--
-- Table structure for table `booking_workers`
--

CREATE TABLE `booking_workers` (
  `booking_worker_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `worker_id` int(11) NOT NULL,
  `assigned_by_admin_id` int(11) DEFAULT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `worker_status` enum('assigned','started','completed') DEFAULT 'assigned'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_workers`
--

INSERT INTO `booking_workers` (`booking_worker_id`, `booking_id`, `worker_id`, `assigned_by_admin_id`, `assigned_at`, `worker_status`) VALUES
(8, 7, 7, NULL, '2026-01-12 08:57:57', 'assigned'),
(9, 12, 1, NULL, '2026-01-14 07:58:19', 'assigned');

-- --------------------------------------------------------

--
-- Table structure for table `feedbacks`
--

CREATE TABLE `feedbacks` (
  `feedback_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `notification_type` enum('booking_confirm','assignment','payment','status_update','general') NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `booking_id` int(11) NOT NULL,
  `amount_lkr` decimal(12,2) NOT NULL,
  `payment_type` enum('advance','remaining','full') NOT NULL,
  `payment_method` enum('online','cash') DEFAULT 'online',
  `transaction_id` varchar(255) DEFAULT NULL,
  `payment_status` enum('pending','completed','failed') DEFAULT 'pending',
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `daily_rate_lkr` decimal(10,2) NOT NULL,
  `advance_percentage` decimal(5,2) DEFAULT 25.00,
  `is_available` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`service_id`, `service_name`, `description`, `daily_rate_lkr`, `advance_percentage`, `is_available`, `created_at`) VALUES
(1, 'Mason', NULL, 1500.00, 25.00, 1, '2026-01-09 07:25:49'),
(2, 'Painter', NULL, 2000.00, 25.00, 1, '2026-01-09 07:25:49'),
(3, 'Carpenter', NULL, 1800.00, 25.00, 1, '2026-01-09 07:25:49'),
(4, 'Electrician', NULL, 2200.00, 25.00, 1, '2026-01-09 07:25:49'),
(5, 'Plumber', NULL, 1700.00, 25.00, 1, '2026-01-09 07:25:49'),
(6, 'House Cleaning', 'Professional house cleaning services', 0.00, 25.00, 1, '2026-01-09 10:37:11'),
(7, 'Office Cleaning', 'Commercial office cleaning', 0.00, 25.00, 1, '2026-01-09 10:37:11'),
(8, 'Gardening', 'Garden maintenance and landscaping', 0.00, 25.00, 1, '2026-01-09 10:37:11'),
(9, 'Plumbing', 'Plumbing repair and installation', 0.00, 25.00, 1, '2026-01-09 10:37:11'),
(10, 'Electrical Work', 'Electrical repairs and installations', 0.00, 25.00, 1, '2026-01-09 10:37:11');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text DEFAULT NULL,
  `user_type` enum('customer','worker','admin') NOT NULL DEFAULT 'customer',
  `profile_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `address`, `user_type`, `profile_image`, `is_active`, `created_at`, `updated_at`) VALUES
(8, 'olivia.rodriguez@inbox.com', '$2b$10$NTL88548Us3QmQeTsmGXBOTWtGC3Q5usNn0SJIf9u1vXFhGmuY.va', 'Mark Rodriguez', 'Donald Robinson', '5556784321', '741 Ash Avenue', 'worker', '', 1, '2026-01-09 08:44:18', '2026-01-12 05:47:58'),
(9, 'test123@domain.com', '$2b$10$J6TcU66diEHDWoxg/8yPjuSoqZglBZQpu6BvpSrmY9hJQwLlQFrnK', 'Isabella Williams', 'Charles Lee', '5553698521', '543 Acacia Road', 'worker', '', 1, '2026-01-09 09:04:04', '2026-01-09 09:04:04'),
(12, 'mike.davis@email.com', '$2b$10$dummy.hash.for.testing', 'Mike', 'Davis', '0712345680', NULL, 'customer', '', 1, '2026-01-09 10:37:11', '2026-01-14 08:24:11'),
(13, 'emma.wilson@email.com', '$2b$10$dummy.hash.for.testing', 'Emma', 'Wilson', '0712345681', NULL, 'customer', '', 1, '2026-01-09 10:37:11', '2026-01-13 09:16:30'),
(14, 'david.brown@email.com', '$2b$10$dummy.hash.for.testing', 'David', 'Brown', '0712345682', NULL, 'worker', '', 1, '2026-01-09 10:37:11', '2026-01-09 10:37:11'),
(15, 'lisa.garcia@email.com', '$2b$10$dummy.hash.for.testing', 'Lisa', 'Garcia', '0712345683', NULL, 'worker', '', 1, '2026-01-09 10:37:11', '2026-01-09 10:37:11'),
(16, 'james.miller@email.com', '$2b$10$dummy.hash.for.testing', 'James', 'Miller', '0712345684', NULL, 'worker', '', 1, '2026-01-09 10:37:11', '2026-01-09 10:37:11'),
(17, 'anna.taylor@email.com', '$2b$10$dummy.hash.for.testing', 'Anna', 'Taylor', '0712345685', NULL, 'worker', '', 1, '2026-01-09 10:37:11', '2026-01-09 10:37:11'),
(18, 'robert.anderson@email.com', '$2b$10$dummy.hash.for.testing', 'Robert', 'Anderson', '0712345686', NULL, 'worker', '', 1, '2026-01-09 10:37:11', '2026-01-09 10:37:11'),
(19, 'maria.martinez@email.com', '$2b$10$dummy.hash.for.testing', 'Maria', 'Martinez', '0712345687', NULL, 'worker', '', 1, '2026-01-09 10:37:11', '2026-01-09 10:37:11'),
(20, 'chris.lee@email.com', '$2b$10$dummy.hash.for.testing', 'Chris', 'Lee', '0712345688', NULL, 'worker', '', 1, '2026-01-09 10:37:11', '2026-01-09 10:37:11'),
(24, 'admin@example.com', '$2b$10$2BjT0V5P.tSLsKUpdfDAoe4qe87RyFfmexTRTqDLwF0shSNrLtdRO', 'Kevin', 'paris', '0720815252', '120/G/I Mill Road\nThalwila', 'admin', '', 1, '2026-01-09 10:57:18', '2026-01-13 09:20:53'),
(27, 'brinslykevin@gmail.com', '$2b$10$sVt/mBglls.p5Jv0rfN3MOV4zYYbflLbAII2Fu9Fp2uAUIRGpLoly', 'Kevin', 'paris', '0720815252', '120/G/I Mill Road', 'customer', '', 1, '2026-01-12 06:16:06', '2026-01-14 08:21:29'),
(29, 'test@gmail.com', '$2b$10$6H/xxO1ZMcWGM85TpRKQMe27Ah/3oYJT2m4A0aqLlSex.p7Vmh6gi', 'test', 'test', '0303030303', 'mdmdmdmd', 'customer', '', 1, '2026-01-12 10:21:48', '2026-01-13 09:20:56'),
(30, 'test33@gmail.com', '$2b$10$MSx3VzG3/nEHGeMWqmgpROCDatoyZMVGoEi8Yj3nHKzDpTlwPHOSq', 'test33', 'test33', '232322323', 'ffrfr', 'customer', '', 1, '2026-01-12 10:22:38', '2026-01-13 09:20:58'),
(31, 'demo.account@test.net', '$2b$10$s.ibEEIY32woz0Fpsu/Pe.I2FocAy5Wbdnx0a1ie3H913CaKGB2g2', 'Sophia Martinez', 'James Johnson', '5556667788', '741 Ash Avenue', 'customer', '', 1, '2026-01-13 07:31:31', '2026-01-13 09:21:00'),
(34, 'ava.lopez@web.com', '$2b$10$ASphjDQoLkaWXp3o5u0pjuQIv1iNfgAAxuqpddbh6ZepE4D28ZCJi', 'Michael Jackson', 'Sarah Jackson', '5551237890', '573 Redwood St', 'customer', '', 1, '2026-01-13 07:52:39', '2026-01-13 09:21:02'),
(35, 'alpha.beta@service.com', '$2b$10$SKq8aEo1EMAMHgFj2/gJaej/A43R9UwhFEdJv5bmZYGplLLaFr55G', 'Ella White', 'David Thomas', '5552223344', '627 Chestnut Drive', 'customer', '', 1, '2026-01-13 09:05:20', '2026-01-13 09:21:10'),
(37, 'john.smith@email.com', '$2b$10$TYv0KGMhd3pHtMWtNVl/duOlv56V9NxWTmK2QCbnujSVie9EGTcrq', 'Elizabeth Allen', 'Robert Lopez', '5551112233', '486 Poplar Lane', 'worker', '', 1, '2026-01-13 09:24:12', '2026-01-13 09:24:12'),
(38, 'test5@gmail.com', '$2b$10$4E/8MdOMPTwCNL5Q2/UZjOZhnya7IgJiHl8WimSxvA9S5tSaV5ZB.', 'testtest', 'testest', '0720815252', '120/G/I Mill Road', 'customer', '', 1, '2026-01-13 09:29:00', '2026-01-14 08:21:34'),
(39, 'kevin@gmail.com', '$2b$10$./6agWa0kZd7bKncMAYFLef690A.RGWFWBqg8YMg4TY2HTBd8P4Qa', 'Kevin', 'paris', '0720815252', '120/G/I Mill Road', 'customer', '/uploads/profiles/USER-1768367793670.png', 1, '2026-01-13 11:38:06', '2026-01-14 05:16:33');

-- --------------------------------------------------------

--
-- Table structure for table `worker_profiles`
--

CREATE TABLE `worker_profiles` (
  `worker_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_jobs_completed` int(11) DEFAULT 0,
  `is_available` tinyint(1) DEFAULT 1,
  `bio` text DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `worker_profiles`
--

INSERT INTO `worker_profiles` (`worker_id`, `user_id`, `service_id`, `experience_years`, `rating`, `total_jobs_completed`, `is_available`, `bio`, `profile_image`, `created_at`) VALUES
(1, 8, 3, 0, 0.00, 0, 1, NULL, NULL, '2026-01-09 08:44:18'),
(2, 9, 5, 18, 0.00, 0, 1, 'This is sample text for testing purposes. Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'https://i.pinimg.com/1200x/2d/95/e5/2d95e5886fc4c65a6778b5fee94a7d59.jpg', '2026-01-09 09:04:04'),
(3, 14, 6, 3, 4.50, 25, 1, 'Experienced house cleaning professional', NULL, '2026-01-09 10:37:11'),
(4, 15, 6, 3, 4.50, 25, 1, 'Experienced house cleaning professional', NULL, '2026-01-09 10:37:11'),
(5, 16, 7, 3, 4.50, 25, 1, 'Experienced office cleaning professional', NULL, '2026-01-09 10:37:11'),
(6, 17, 8, 3, 4.50, 25, 1, 'Experienced gardening professional', NULL, '2026-01-09 10:37:11'),
(7, 18, 9, 3, 4.50, 25, 1, 'Experienced plumbing professional', NULL, '2026-01-09 10:37:11'),
(8, 19, 10, 3, 4.50, 25, 1, 'Experienced electrical work professional', NULL, '2026-01-09 10:37:11'),
(9, 20, 6, 3, 4.50, 25, 1, 'Experienced house cleaning professional', NULL, '2026-01-09 10:37:11'),
(14, 37, 1, 0, 0.00, 0, 1, NULL, NULL, '2026-01-13 09:24:12');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_settings`
--
ALTER TABLE `admin_settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `idx_bookings_status` (`booking_status`,`payment_status`),
  ADD KEY `idx_bookings_customer` (`customer_id`);

--
-- Indexes for table `booking_workers`
--
ALTER TABLE `booking_workers`
  ADD PRIMARY KEY (`booking_worker_id`),
  ADD KEY `booking_id` (`booking_id`),
  ADD KEY `worker_id` (`worker_id`),
  ADD KEY `assigned_by_admin_id` (`assigned_by_admin_id`);

--
-- Indexes for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD PRIMARY KEY (`feedback_id`),
  ADD UNIQUE KEY `booking_id` (`booking_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_notifications_user` (`user_id`,`is_read`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`service_id`),
  ADD UNIQUE KEY `service_name` (`service_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_type` (`user_type`,`is_active`);

--
-- Indexes for table `worker_profiles`
--
ALTER TABLE `worker_profiles`
  ADD PRIMARY KEY (`worker_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_worker_profiles_service` (`service_id`,`is_available`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_settings`
--
ALTER TABLE `admin_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `booking_workers`
--
ALTER TABLE `booking_workers`
  MODIFY `booking_worker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `worker_profiles`
--
ALTER TABLE `worker_profiles`
  MODIFY `worker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`);

--
-- Constraints for table `booking_workers`
--
ALTER TABLE `booking_workers`
  ADD CONSTRAINT `booking_workers_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_workers_ibfk_2` FOREIGN KEY (`worker_id`) REFERENCES `worker_profiles` (`worker_id`),
  ADD CONSTRAINT `booking_workers_ibfk_3` FOREIGN KEY (`assigned_by_admin_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `feedbacks`
--
ALTER TABLE `feedbacks`
  ADD CONSTRAINT `feedbacks_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`),
  ADD CONSTRAINT `feedbacks_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`);

--
-- Constraints for table `worker_profiles`
--
ALTER TABLE `worker_profiles`
  ADD CONSTRAINT `worker_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `worker_profiles_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`service_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
