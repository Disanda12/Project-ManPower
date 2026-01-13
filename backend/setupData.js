const db = require('./db');

async function setupData() {
  try {
    console.log('🚀 Starting database data setup...');

    // Insert admin_settings
    console.log('⚙️ Inserting admin settings...');
    const adminSettings = [
      { setting_key: 'default_advance_percentage', setting_value: '25', description: 'Default advance payment percentage for all services' },
      { setting_key: 'booking_notification_email', setting_value: 'admin@jaannetwork.com', description: 'Email to send new booking notifications' },
      { setting_key: 'support_phone', setting_value: '0112345678', description: 'Customer support phone number' },
      { setting_key: 'company_address', setting_value: 'No.46, Hudson Rd, Colombo 03', description: 'Company physical address' }
    ];

    for (const setting of adminSettings) {
      await db.query(
        'INSERT INTO admin_settings (setting_key, setting_value, description) VALUES (?, ?, ?)',
        [setting.setting_key, setting.setting_value, setting.description]
      );
    }

    // Insert services
    console.log('🛠️ Inserting services...');
    const services = [
      { service_name: 'Mason', description: null, daily_rate_lkr: 1500.00, advance_percentage: 25.00, is_available: 1 },
      { service_name: 'Painter', description: null, daily_rate_lkr: 2000.00, advance_percentage: 25.00, is_available: 1 },
      { service_name: 'Carpenter', description: null, daily_rate_lkr: 1800.00, advance_percentage: 25.00, is_available: 1 },
      { service_name: 'Electrician', description: null, daily_rate_lkr: 2200.00, advance_percentage: 25.00, is_available: 1 },
      { service_name: 'Plumber', description: null, daily_rate_lkr: 1700.00, advance_percentage: 25.00, is_available: 1 }
    ];

    for (const service of services) {
      await db.query(
        'INSERT INTO services (service_name, description, daily_rate_lkr, advance_percentage, is_available) VALUES (?, ?, ?, ?, ?)',
        [service.service_name, service.description, service.daily_rate_lkr, service.advance_percentage, service.is_available]
      );
    }

    // Insert users
    console.log('👤 Inserting users...');
    const users = [
      { email: 'admin@jaannetwork.com', password_hash: '$2y$10$YourHashedPasswordHere', first_name: 'Admin', last_name: 'System', phone: '0112345678', address: null, user_type: 'admin', profile_image: '', is_active: 1 },
      { email: 'Test@gmail.com', password_hash: '$2b$10$F4Go1gNgMLYIyz.cgvdEWurUwOPeHIk39zpehu.zujurzeRQQ5hXW', first_name: 'Test', last_name: 'Admin', phone: '0771234567', address: 'No. 123, Main Street, Colombo 03', user_type: 'customer', profile_image: '', is_active: 1 },
      { email: 'Test2@gmail.com', password_hash: '$2b$10$J3xYwJbm6gaXWrJv3PQcmet8Cy0s7svG0lB4x2IQFV5SxELq3XHQO', first_name: 'Test', last_name: 'Admin', phone: '0771234567', address: 'No. 123, Main Street, Colombo 03', user_type: 'customer', profile_image: '', is_active: 1 },
      { email: 'Test1@gmail.com', password_hash: '$2b$10$lqy7mpdFHxo1NbNOsPRhaOQvF0uVUwMg4ieGiHqhAF4wDXOFkDjvq', first_name: 'Test', last_name: 'User', phone: '0772010642', address: '02,Main street,Colombo', user_type: 'customer', profile_image: '/uploads/profiles/USER-1768202919727.jpg', is_active: 1 },
      { email: 'admin1@example.com', password_hash: '$2b$10$Zv4CI/CQgXS2IScrYNN2SeTYErxeF9z/XKM7bH65vFnpnCDZt7AgO', first_name: 'TestAdmin', last_name: 'admin', phone: '0772010642', address: '02, Alubogahawatta Mawath,Jamburaliya, Madapatha, Piliyandala', user_type: 'admin', profile_image: '', is_active: 1 }
    ];

    for (const user of users) {
      await db.query(
        'INSERT INTO users (email, password_hash, first_name, last_name, phone, address, user_type, profile_image, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [user.email, user.password_hash, user.first_name, user.last_name, user.phone, user.address, user.user_type, user.profile_image, user.is_active]
      );
    }

    // Insert bookings
    console.log('📅 Inserting bookings...');
    const bookings = [
      { customer_id: 1, service_id: 2, number_of_workers: 3, work_description: 'Office renovation and painting. Contact person: John. Address: 123 Main St, Colombo.', start_date: '2024-06-01', end_date: '2024-06-05', total_amount_lkr: 45000.00, advance_amount_lkr: 9000.00, booking_status: 'pending', payment_status: 'advance_paid' },
      { customer_id: 8, service_id: 3, number_of_workers: 2, work_description: 'Address: 02, Alubogahawatta Mawath,Jamburaliya, Madapatha, Piliyandala | Note: test', start_date: '2026-01-11', end_date: '2026-01-17', total_amount_lkr: 25200.00, advance_amount_lkr: 6300.00, booking_status: 'pending', payment_status: 'fully_paid' },
      { customer_id: 8, service_id: 4, number_of_workers: 1, work_description: 'Address: 04,main street,Matara  | Note: Example', start_date: '2026-01-12', end_date: '2026-01-16', total_amount_lkr: 11000.00, advance_amount_lkr: 2750.00, booking_status: 'completed', payment_status: 'pending' }
    ];

    for (const booking of bookings) {
      await db.query(
        'INSERT INTO bookings (customer_id, service_id, number_of_workers, work_description, start_date, end_date, total_amount_lkr, advance_amount_lkr, booking_status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [booking.customer_id, booking.service_id, booking.number_of_workers, booking.work_description, booking.start_date, booking.end_date, booking.total_amount_lkr, booking.advance_amount_lkr, booking.booking_status, booking.payment_status]
      );
    }

    // Insert feedbacks
    console.log('💬 Inserting feedbacks...');
    const feedbacks = [
      { booking_id: 11, customer_id: 8, rating: 4, comment: 'Excellent service' }
    ];

    for (const feedback of feedbacks) {
      await db.query(
        'INSERT INTO feedbacks (booking_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)',
        [feedback.booking_id, feedback.customer_id, feedback.rating, feedback.comment]
      );
    }

    console.log('✅ Database data setup completed successfully!');
  } catch (error) {
    console.error('❌ Error setting up data:', error);
  } finally {
    process.exit();
  }
}

setupData();