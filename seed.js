const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await User.create({ username: "admin", password: "admin123" });
    console.log("✅ User admin berhasil dibuat");
  } catch (err) {
    console.error("❌ Gagal membuat user:", err.message);
  } finally {
    mongoose.disconnect();
  }
}

createUser();
