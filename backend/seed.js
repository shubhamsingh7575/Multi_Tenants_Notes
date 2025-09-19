const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Tenant = require("./models/Tenant");
const User = require("./models/User");

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Tenant.deleteMany();
    await User.deleteMany();

    const acme = await Tenant.create({ name: "Acme", slug: "acme", plan: "FREE" });
    const globex = await Tenant.create({ name: "Globex", slug: "globex", plan: "FREE" });

    const hashedPassword = await bcrypt.hash("password", 10);

    await User.create([
      { email: "admin@acme.test", password: hashedPassword, role: "ADMIN", tenant: acme._id },
      { email: "user@acme.test", password: hashedPassword, role: "MEMBER", tenant: acme._id },
      { email: "admin@globex.test", password: hashedPassword, role: "ADMIN", tenant: globex._id },
      { email: "user@globex.test", password: hashedPassword, role: "MEMBER", tenant: globex._id }
    ]);

    console.log("✅ Seed data inserted successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
