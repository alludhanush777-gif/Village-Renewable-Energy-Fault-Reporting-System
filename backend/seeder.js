const mongoose = require('dotenv').config() && require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Sentinel Seeder: Connection Established');

    // Clear existing users
    await User.deleteMany();

    const users = [
      {
        name: 'Naveena Sandhi',
        phone: '+91 9063218875',
        email: 'naveena.sandhi@sentinel.com',
        password: 'technician_password_2026',
        role: 'TECHNICIAN',
        village: 'Turkana North'
      },
      {
        name: 'Jyothsna',
        phone: '+91 8888888888',
        email: 'jyothsna@sentinel.com',
        password: 'reporter_password_2026',
        role: 'REPORTER',
        village: 'Omo Valley'
      },
      {
        name: 'Sentinel Admin',
        phone: '+91 9999999999',
        email: 'admin@sentinel.com',
        password: 'admin_password_2026',
        role: 'ADMIN',
        village: 'Command Center'
      }
    ];

    for (let u of users) {
      await User.create(u);
    }

    console.log('Sentinel Seeder: Data Transmission Complete');
    process.exit();
  } catch (err) {
    console.error('Seeder Breach:', err);
    process.exit(1);
  }
};

seedData();
