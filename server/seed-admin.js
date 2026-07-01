require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const User = require('./models/User');

dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const ADMIN = {
  name: 'Priyansh',
  email: 'priyansh@admin.com',
  password: 'Priyansh101112',
  role: 'super_admin',
};

async function seedAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB');

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${ADMIN.email}`);
      console.log('ℹ️  Use these credentials to login:');
      console.log(`   Email:    ${ADMIN.email}`);
      console.log(`   Password: ${ADMIN.password}`);
      process.exit(0);
    }

    const user = await User.create(ADMIN);
    console.log('\n🎉 Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Name:     ${user.name}`);
    console.log(`   Email:    ${ADMIN.email}`);
    console.log(`   Password: ${ADMIN.password}`);
    console.log(`   Role:     ${user.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ You can now login at http://localhost:5174/admin/login\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seedAdmin();
