const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const db = pool.promise();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // First, ensure we have services
    console.log('📋 Checking/creating services...');
    const services = [
      { service_name: 'House Cleaning', description: 'Professional house cleaning services' },
      { service_name: 'Office Cleaning', description: 'Commercial office cleaning' },
      { service_name: 'Gardening', description: 'Garden maintenance and landscaping' },
      { service_name: 'Plumbing', description: 'Plumbing repair and installation' },
      { service_name: 'Electrical Work', description: 'Electrical repairs and installations' }
    ];

    for (const service of services) {
      await db.query(
        'INSERT IGNORE INTO services (service_name, description) VALUES (?, ?)',
        [service.service_name, service.description]
      );
    }

    // Get service IDs
    const [serviceRows] = await db.query('SELECT service_id, service_name FROM services');
    const serviceMap = {};
    serviceRows.forEach(service => {
      serviceMap[service.service_name] = service.service_id;
    });

    // Create customer users
    console.log('👥 Creating customer users...');
    const customers = [
      { first_name: 'John', last_name: 'Smith', email: 'john.smith@email.com', phone: '0712345678' },
      { first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@email.com', phone: '0712345679' },
      { first_name: 'Mike', last_name: 'Davis', email: 'mike.davis@email.com', phone: '0712345680' },
      { first_name: 'Emma', last_name: 'Wilson', email: 'emma.wilson@email.com', phone: '0712345681' }
    ];

    const customerIds = [];
    for (const customer of customers) {
      // Check if user already exists
      const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [customer.email]);
      if (existing.length > 0) {
        customerIds.push(existing[0].user_id);
        console.log(`   - Customer ${customer.email} already exists, skipping...`);
      } else {
        const [result] = await db.query(
          'INSERT INTO users (first_name, last_name, email, phone, user_type, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
          [customer.first_name, customer.last_name, customer.email, customer.phone, 'customer', '$2b$10$dummy.hash.for.testing']
        );
        customerIds.push(result.insertId);
      }
    }

    // Create worker users
    console.log('👷 Creating worker users...');
    const workers = [
      { first_name: 'David', last_name: 'Brown', email: 'david.brown@email.com', phone: '0712345682', service: 'House Cleaning' },
      { first_name: 'Lisa', last_name: 'Garcia', email: 'lisa.garcia@email.com', phone: '0712345683', service: 'House Cleaning' },
      { first_name: 'James', last_name: 'Miller', email: 'james.miller@email.com', phone: '0712345684', service: 'Office Cleaning' },
      { first_name: 'Anna', last_name: 'Taylor', email: 'anna.taylor@email.com', phone: '0712345685', service: 'Gardening' },
      { first_name: 'Robert', last_name: 'Anderson', email: 'robert.anderson@email.com', phone: '0712345686', service: 'Plumbing' },
      { first_name: 'Maria', last_name: 'Martinez', email: 'maria.martinez@email.com', phone: '0712345687', service: 'Electrical Work' },
      { first_name: 'Chris', last_name: 'Lee', email: 'chris.lee@email.com', phone: '0712345688', service: 'House Cleaning' },
      { first_name: 'Jennifer', last_name: 'White', email: 'jennifer.white@email.com', phone: '0712345689', service: 'Office Cleaning' }
    ];

    const workerIds = [];
    for (const worker of workers) {
      // Check if user already exists
      const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [worker.email]);
      if (existing.length > 0) {
        workerIds.push(existing[0].user_id);
        console.log(`   - Worker ${worker.email} already exists, skipping...`);
      } else {
        const [result] = await db.query(
          'INSERT INTO users (first_name, last_name, email, phone, user_type, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
          [worker.first_name, worker.last_name, worker.email, worker.phone, 'worker', '$2b$10$dummy.hash.for.testing']
        );
        workerIds.push(result.insertId);

        // Create worker profile
        await db.query(
          'INSERT INTO worker_profiles (user_id, service_id, experience_years, rating, total_jobs_completed, is_available, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [result.insertId, serviceMap[worker.service], 3, 4.5, 25, 1, `Experienced ${worker.service.toLowerCase()} professional`]
        );
      }
    }

    // Create admin user
    console.log('👑 Creating admin user...');
    const [adminExists] = await db.query('SELECT user_id FROM users WHERE email = ?', ['admin@jaan.com']);
    if (adminExists.length === 0) {
      await db.query(
        'INSERT INTO users (first_name, last_name, email, phone, user_type, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
        ['Admin', 'User', 'admin@jaan.com', '0712345690', 'admin', '$2b$10$dummy.hash.for.testing']
      );
    } else {
      console.log('   - Admin user already exists, skipping...');
    }

    // Create bookings
    console.log('📅 Creating test bookings...');
    const bookings = [
      {
        customer_id: customerIds[0],
        service_id: serviceMap['House Cleaning'],
        number_of_workers: 2,
        work_description: 'Deep cleaning of 3-bedroom house',
        start_date: '2026-01-15',
        end_date: '2026-01-15',
        total_amount_lkr: 25000,
        advance_amount_lkr: 12500,
        status: 'pending'
      },
      {
        customer_id: customerIds[1],
        service_id: serviceMap['Office Cleaning'],
        number_of_workers: 3,
        work_description: 'Weekly office cleaning for 5 floors',
        start_date: '2026-01-16',
        end_date: '2026-01-16',
        total_amount_lkr: 45000,
        advance_amount_lkr: 22500,
        status: 'confirmed'
      },
      {
        customer_id: customerIds[2],
        service_id: serviceMap['Gardening'],
        number_of_workers: 1,
        work_description: 'Garden maintenance and lawn mowing',
        start_date: '2026-01-17',
        end_date: '2026-01-17',
        total_amount_lkr: 15000,
        advance_amount_lkr: 7500,
        status: 'pending'
      },
      {
        customer_id: customerIds[3],
        service_id: serviceMap['Plumbing'],
        number_of_workers: 1,
        work_description: 'Fix leaking pipes in kitchen',
        start_date: '2026-01-18',
        end_date: '2026-01-18',
        total_amount_lkr: 20000,
        advance_amount_lkr: 10000,
        status: 'confirmed'
      },
      {
        customer_id: customerIds[0],
        service_id: serviceMap['Electrical Work'],
        number_of_workers: 2,
        work_description: 'Install new electrical outlets',
        start_date: '2026-01-19',
        end_date: '2026-01-19',
        total_amount_lkr: 35000,
        advance_amount_lkr: 17500,
        status: 'pending'
      },
      {
        customer_id: customerIds[1],
        service_id: serviceMap['House Cleaning'],
        number_of_workers: 1,
        work_description: 'Regular house cleaning',
        start_date: '2026-01-20',
        end_date: '2026-01-20',
        total_amount_lkr: 12000,
        advance_amount_lkr: 6000,
        status: 'completed'
      },
      {
        customer_id: customerIds[2],
        service_id: serviceMap['Gardening'],
        number_of_workers: 1,
        work_description: 'Garden maintenance and lawn mowing',
        start_date: '2026-01-10',
        end_date: '2026-01-10',
        total_amount_lkr: 15000,
        advance_amount_lkr: 7500,
        status: 'completed'
      },
      {
        customer_id: customerIds[0],
        service_id: serviceMap['Plumbing'],
        number_of_workers: 1,
        work_description: 'Fix leaking pipes in kitchen',
        start_date: '2026-01-05',
        end_date: '2026-01-05',
        total_amount_lkr: 20000,
        advance_amount_lkr: 10000,
        status: 'cancelled'
      }
    ];

    const [existingBookings] = await db.query('SELECT COUNT(*) as count FROM bookings');
    if (existingBookings[0].count > 0) {
      console.log(`   - ${existingBookings[0].count} bookings already exist, skipping booking creation...`);
    } else {
      for (const booking of bookings) {
        await db.query(
          `INSERT INTO bookings (
            customer_id, service_id, number_of_workers, work_description,
            start_date, end_date, total_amount_lkr, advance_amount_lkr, booking_status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            booking.customer_id,
            booking.service_id,
            booking.number_of_workers,
            booking.work_description,
            booking.start_date,
            booking.end_date,
            booking.total_amount_lkr,
            booking.advance_amount_lkr,
            booking.status
          ]
        );
      }
      console.log(`   - Created ${bookings.length} test bookings`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${customers.length} customers processed`);
    console.log(`   - ${workers.length} workers processed`);
    console.log(`   - ${services.length} services available`);
    console.log(`   - ${existingBookings[0].count} existing bookings found`);

    console.log('\n🔑 Admin login:');
    console.log('   Email: admin@jaan.com');
    console.log('   Password: (use any password - dummy hash)');

    console.log('\n🧪 Test the worker assignment feature with the pending bookings!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    pool.end();
  }
}

seedDatabase();