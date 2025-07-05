const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

async function hashPasswords() {
  await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const users = await User.find();
  let updated = 0;
  for (const user of users) {
    // If the password is not a bcrypt hash (doesn't start with $2), hash it
    if (!user.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      updated++;
      console.log(`Updated user: ${user.email}`);
    }
  }
  console.log(`Done. Updated ${updated} users.`);
  mongoose.disconnect();
}

hashPasswords().catch(err => {
  console.error('Error hashing passwords:', err);
  mongoose.disconnect();
}); 