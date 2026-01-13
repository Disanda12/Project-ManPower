const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
  multipleStatements: true
});

async function initDatabase() {
  try {
    console.log('🔧 Initializing database from SQL file...');

    const sql = fs.readFileSync('./manpower_booking.sql', 'utf8');

    await connection.promise().query(sql);

    console.log('✅ Database initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    connection.end();
  }
}

initDatabase();