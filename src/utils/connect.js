const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect(process.env.CONNECTION_URI, {});
    console.log('DB connected');
  } catch (error) {
    console.error('Could not connect to db');
    process.exit(1);
  }
}

module.exports = connect;
