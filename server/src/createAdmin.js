const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Bhavani Admin";

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be set in server/.env"
      );
    }

    if (adminPassword.length < 6) {
      throw new Error(
        "ADMIN_PASSWORD must contain at least 6 characters"
      );
    }

    const normalizedEmail = adminEmail.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log(
          `Admin account already exists: ${normalizedEmail}`
        );
        process.exit(0);
      }

      existingUser.role = "admin";
      existingUser.isActive = true;

      await existingUser.save();

      console.log(
        `Existing user promoted to admin: ${normalizedEmail}`
      );

      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      12
    );

    const admin = await User.create({
      name: adminName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
    });

    console.log("Admin account created successfully.");
    console.log(`Name: ${admin.name}`);
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error(
      "Admin creation failed:",
      error.message
    );

    process.exit(1);
  }
};

createAdmin();