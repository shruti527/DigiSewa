const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// helper to sign JWT
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * POST /api/auth/register
 * body: { name, email, phone, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone: phone || "",
      passwordHash,
      role: "citizen",
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    const token = signToken(user);
    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/auth/admin-login
 * body: { email, password, adminCode }
 * - OPTIONAL: require an ADMIN_CODE from .env
 */
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password, adminCode } = req.body;
    const requiredCode = process.env.ADMIN_CODE || "";

    if (requiredCode && adminCode !== requiredCode) {
      return res.status(401).json({ message: "Invalid admin code" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password" });

    // ensure role
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Not an admin account" });
    }

    const token = signToken(user);
    return res.json({
      message: "Admin login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("admin-login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/auth/me
 * header: Authorization: Bearer <token>
 */
router.get("/me", auth(), async (req, res) => {
  const user = await User.findById(req.user.id).select("name email role createdAt");
  return res.json({ user });
});

module.exports = router;
