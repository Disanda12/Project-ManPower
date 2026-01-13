-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 13, 2026 at 07:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
(1, 'default_advance_percentage', '25', 'Default advance payment percentage for all services', '2026-01-08 15:23:24'),
(2, 'booking_notification_email', 'admin@jaannetwork.com', 'Email to send new booking notifications', '2026-01-08 15:23:24'),
(3, 'support_phone', '0112345678', 'Customer support phone number', '2026-01-08 15:23:24'),
(4, 'company_address', 'No.46, Hudson Rd, Colombo 03', 'Company physical address', '2026-01-08 15:23:24');

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

INSERT INTO `bookings` (`booking_id`, `customer_id`, `service_id`, `number_of_workers`, `work_description`, `start_date`, `end_date`, `total_amount_lkr`, `advance_amount_lkr`, `booking_status`, `payment_status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 3, 'Office renovation and painting. Contact person: John. Address: 123 Main St, Colombo.', '2024-06-01', '2024-06-05', 45000.00, 9000.00, 'pending', 'advance_paid', '2026-01-09 09:30:34', '2026-01-09 09:31:06'),
(10, 8, 3, 2, 'Address: 02, Alubogahawatta Mawath,Jamburaliya, Madapatha, Piliyandala | Note: test', '2026-01-11', '2026-01-17', 25200.00, 6300.00, 'pending', 'fully_paid', '2026-01-09 10:26:02', '2026-01-12 03:11:02'),
(11, 8, 4, 1, 'Address: 04,main street,Matara  | Note: Example', '2026-01-12', '2026-01-16', 11000.00, 2750.00, 'completed', 'pending', '2026-01-12 03:39:02', '2026-01-12 04:20:19');

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
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedbacks`
--

INSERT INTO `feedbacks` (`feedback_id`, `booking_id`, `customer_id`, `rating`, `comment`, `submitted_at`) VALUES
(5, 11, 8, 4, 'Excellent service', '2026-01-12 05:24:01');

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
(1, 'Mason', NULL, 1500.00, 25.00, 1, '2026-01-08 15:23:24'),
(2, 'Painter', NULL, 2000.00, 25.00, 1, '2026-01-08 15:23:24'),
(3, 'Carpenter', NULL, 1800.00, 25.00, 1, '2026-01-08 15:23:24'),
(4, 'Electrician', NULL, 2200.00, 25.00, 1, '2026-01-08 15:23:24'),
(5, 'Plumber', NULL, 1700.00, 25.00, 1, '2026-01-08 15:23:24');

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
  `profile_image` varchar(256) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `email`, `password_hash`, `first_name`, `last_name`, `phone`, `address`, `user_type`, `profile_image`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin@jaannetwork.com', '$2y$10$YourHashedPasswordHere', 'Admin', 'System', '0112345678', NULL, 'admin', '', 1, '2026-01-08 15:23:24', '2026-01-08 15:23:24'),
(6, 'Test@gmail.com', '$2b$10$F4Go1gNgMLYIyz.cgvdEWurUwOPeHIk39zpehu.zujurzeRQQ5hXW', 'Test', 'Admin', '0771234567', 'No. 123, Main Street, Colombo 03', 'customer', '', 1, '2026-01-09 03:30:02', '2026-01-09 03:30:02'),
(7, 'Test2@gmail.com', '$2b$10$J3xYwJbm6gaXWrJv3PQcmet8Cy0s7svG0lB4x2IQFV5SxELq3XHQO', 'Test', 'Admin', '0771234567', 'No. 123, Main Street, Colombo 03', 'customer', '', 1, '2026-01-09 05:25:12', '2026-01-09 05:25:12'),
(8, 'Test1@gmail.com', '$2b$10$lqy7mpdFHxo1NbNOsPRhaOQvF0uVUwMg4ieGiHqhAF4wDXOFkDjvq', 'Test', 'User', '0772010642', '02,Main street,Colombo', 'customer', '/uploads/profiles/USER-1768202919727.jpg', 1, '2026-01-09 05:32:51', '2026-01-12 07:28:39'),
(9, 'admin1@example.com', '$2b$10$Zv4CI/CQgXS2IScrYNN2SeTYErxeF9z/XKM7bH65vFnpnCDZt7AgO', 'TestAdmin', 'admin', '0772010642', '02, Alubogahawatta Mawath,Jamburaliya, Madapatha, Piliyandala', 'admin', '', 1, '2026-01-09 07:38:53', '2026-01-09 07:38:53');

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
  MODIFY `booking_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `booking_workers`
--
ALTER TABLE `booking_workers`
  MODIFY `booking_worker_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedbacks`
--
ALTER TABLE `feedbacks`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `worker_profiles`
--
ALTER TABLE `worker_profiles`
  MODIFY `worker_id` int(11) NOT NULL AUTO_INCREMENT;

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
