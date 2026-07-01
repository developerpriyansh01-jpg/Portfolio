const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use Google & Cloudflare DNS servers
// This fixes 'querySrv ECONNREFUSED' errors when the local network DNS
// (e.g. mobile hotspot) cannot resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // Force IPv4
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn(`⚠️ The backend server is running, but database API calls will fail until you provide a valid MONGODB_URI in server/.env`);
    // Removed process.exit(1) to prevent 502 Bad Gateway proxy crashes
  }
};

module.exports = connectDB;
