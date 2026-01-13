-- ============================================
-- Database: manpower_booking_db
-- ============================================

CREATE DATABASE IF NOT EXISTS `manpower_booking_db`;
USE `manpower_booking_db`;

-- ============================================
-- 1. USERS (Customers, Workers, Admin)
-- ============================================
CREATE TABLE `users` (
    `user_id` INT PRIMARY KEY AUTO_INCREMENT,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `address` TEXT,
    `user_type` ENUM('customer', 'worker', 'admin') NOT NULL DEFAULT 'customer',
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- 2. SERVICES (Mason, Painter, Electrician, etc.)
-- ============================================
CREATE TABLE `services` (
    `service_id` INT PRIMARY KEY AUTO_INCREMENT,
    `service_name` VARCHAR(100) UNIQUE NOT NULL,
    `description` TEXT,
    `daily_rate_lkr` DECIMAL(10,2) NOT NULL,
    `advance_percentage` DECIMAL(5,2) DEFAULT 25.00, -- Admin configurable
    `is_available` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. WORKER PROFILES (Linked to users table)
-- ============================================
CREATE TABLE `worker_profiles` (
    `worker_id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT UNIQUE NOT NULL,
    `service_id` INT NOT NULL,
    `experience_years` INT,
    `rating` DECIMAL(3,2) DEFAULT 0.00,
    `total_jobs_completed` INT DEFAULT 0,
    `is_available` BOOLEAN DEFAULT TRUE,
    `bio` TEXT,
    `profile_image` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE,
    FOREIGN KEY (`service_id`) REFERENCES `services`(`service_id`)
);

-- ============================================
-- 4. BOOKINGS
-- ============================================
CREATE TABLE `bookings` (
    `booking_id` INT PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT NOT NULL,
    `service_id` INT NOT NULL,
    `number_of_workers` INT NOT NULL DEFAULT 1,
    `work_description` TEXT,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `total_days` INT GENERATED ALWAYS AS (DATEDIFF(`end_date`, `start_date`) + 1) STORED,
    `total_amount_lkr` DECIMAL(12,2) NOT NULL,
    `advance_amount_lkr` DECIMAL(12,2) NOT NULL,
    `remaining_amount_lkr` DECIMAL(12,2) GENERATED ALWAYS AS (`total_amount_lkr` - `advance_amount_lkr`) STORED,
    `booking_status` ENUM('pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    `payment_status` ENUM('pending', 'advance_paid', 'fully_paid', 'refunded') DEFAULT 'pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`customer_id`) REFERENCES `users`(`user_id`),
    FOREIGN KEY (`service_id`) REFERENCES `services`(`service_id`)
);

-- ============================================
-- 5. BOOKING_WORKERS (Many-to-Many: Bookings ↔ Workers)
-- ============================================
CREATE TABLE `booking_workers` (
    `booking_worker_id` INT PRIMARY KEY AUTO_INCREMENT,
    `booking_id` INT NOT NULL,
    `worker_id` INT NOT NULL,
    `assigned_by_admin_id` INT, -- Admin who assigned the worker
    `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `worker_status` ENUM('assigned', 'started', 'completed') DEFAULT 'assigned',
    FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`) ON DELETE CASCADE,
    FOREIGN KEY (`worker_id`) REFERENCES `worker_profiles`(`worker_id`),
    FOREIGN KEY (`assigned_by_admin_id`) REFERENCES `users`(`user_id`)
);

-- ============================================
-- 6. PAYMENTS
-- ============================================
CREATE TABLE `payments` (
    `payment_id` INT PRIMARY KEY AUTO_INCREMENT,
    `booking_id` INT NOT NULL,
    `amount_lkr` DECIMAL(12,2) NOT NULL,
    `payment_type` ENUM('advance', 'remaining', 'full') NOT NULL,
    `payment_method` ENUM('online', 'cash') DEFAULT 'online',
    `transaction_id` VARCHAR(255), -- For online payments
    `payment_status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    `paid_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`)
);

-- ============================================
-- 7. FEEDBACK & RATINGS
-- ============================================
CREATE TABLE `feedbacks` (
    `feedback_id` INT PRIMARY KEY AUTO_INCREMENT,
    `booking_id` INT UNIQUE NOT NULL,
    `customer_id` INT NOT NULL,
    `rating` INT CHECK (`rating` BETWEEN 1 AND 5),
    `comment` TEXT,
    `photo_url` VARCHAR(255),
    `submitted_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`booking_id`) REFERENCES `bookings`(`booking_id`),
    FOREIGN KEY (`customer_id`) REFERENCES `users`(`user_id`)
);

-- ============================================
-- 8. NOTIFICATIONS
-- ============================================
CREATE TABLE `notifications` (
    `notification_id` INT PRIMARY KEY AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `notification_type` ENUM('booking_confirm', 'assignment', 'payment', 'status_update', 'general') NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`)
);

-- ============================================
-- 9. ADMIN_SETTINGS (Configurable parameters)
-- ============================================
CREATE TABLE `admin_settings` (
    `setting_id` INT PRIMARY KEY AUTO_INCREMENT,
    `setting_key` VARCHAR(100) UNIQUE NOT NULL,
    `setting_value` TEXT NOT NULL,
    `description` TEXT,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_users_email ON `users`(`email`);
CREATE INDEX idx_users_type ON `users`(`user_type`, `is_active`);
CREATE INDEX idx_bookings_status ON `bookings`(`booking_status`, `payment_status`);
CREATE INDEX idx_bookings_customer ON `bookings`(`customer_id`);
CREATE INDEX idx_worker_profiles_service ON `worker_profiles`(`service_id`, `is_available`);
CREATE INDEX idx_notifications_user ON `notifications`(`user_id`, `is_read`);

-- ============================================
-- INITIAL DATA (Sample Services)
-- ============================================
INSERT INTO `services` (`service_name`, `daily_rate_lkr`, `advance_percentage`) VALUES
('Mason', 1500.00, 25.00),
('Painter', 2000.00, 25.00),
('Carpenter', 1800.00, 25.00),
('Electrician', 2200.00, 25.00),
('Plumber', 1700.00, 25.00);

-- ============================================
-- INITIAL ADMIN USER (Default credentials should be changed)
-- ============================================
INSERT INTO `users` (`email`, `password_hash`, `first_name`, `last_name`, `phone`, `user_type`) VALUES
('admin@jaannetwork.com', '$2y$10$YourHashedPasswordHere', 'Admin', 'System', '0112345678', 'admin');

-- ============================================
-- SAMPLE ADMIN SETTINGS
-- ============================================
INSERT INTO `admin_settings` (`setting_key`, `setting_value`, `description`) VALUES
('default_advance_percentage', '25', 'Default advance payment percentage for all services'),
('booking_notification_email', 'admin@jaannetwork.com', 'Email to send new booking notifications'),
('support_phone', '0112345678', 'Customer support phone number'),
('company_address', 'No.46, Hudson Rd, Colombo 03', 'Company physical address');