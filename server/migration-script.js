// server/migration-script.js
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function migrateUsers() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // 2. Get all users
    const users = await User.find();
    console.log(`Found ${users.length} users to migrate`);

    // 3. Process each user
    for (const user of users) {
      console.log(`Migrating user ${user.email}`);
      
      let needsSave = false;

      // Migrate password to passwordHash
      if (user.password && !user.passwordHash) {
        console.log('-> Migrating password to passwordHash');
        user.passwordHash = await bcrypt.hash(user.password, 10);
        user.password = undefined;
        needsSave = true;
      }

      // Migrate fullName to name
      if (user.fullName && !user.name) {
        console.log('-> Migrating fullName to name');
        user.name = user.fullName;
        user.fullName = undefined;
        needsSave = true;
      }

      // Set default role
      if (!user.role) {
        console.log('-> Setting default role');
        user.role = 'citizen';
        needsSave = true;
      }

      // Save if changes were made
      if (needsSave) {
        await user.save();
        console.log('-> User migrated successfully');
      } else {
        console.log('-> No migration needed');
      }
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

// Run the migration
migrateUsers();