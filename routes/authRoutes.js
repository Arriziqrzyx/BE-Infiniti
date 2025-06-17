const express = require("express");
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Username atau password salah" });
    }
  } catch (err) {
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
});

module.exports = router; // ✅ fix
