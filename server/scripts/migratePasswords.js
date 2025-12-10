// scripts/migratePasswords.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const migratePasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Find users with unhashed passwords (assuming they're less than 60 chars)
    const users = await User.find({
      password: { $exists: true, $type: "string" },
      $expr: { $lt: [{ $strLenCP: "$password" }, 60] },
    });

    console.log(`Found ${users.length} users with potentially unhashed passwords`);

    for (const user of users) {
      console.log(`Migrating user: ${user.email}`);

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      // Update the user
      user.password = hashedPassword;
      await user.save();

      console.log(`✓ Updated password for ${user.email}`);
    }

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migratePasswords();
