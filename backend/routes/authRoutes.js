const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tenant = require("../models/Tenant");

const router = express.Router();

// Login
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    email = email.trim().toLowerCase();

    const user = await User.findOne({ email }).populate("tenant");
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    // token payload: id, role, tenantId, tenantSlug
    const payload = {
      id: user._id,
      role: user.role,
      tenantId: user.tenant ? user.tenant._id : null,
      tenantSlug: user.tenant ? user.tenant.slug : null
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: user.tenant ? user.tenant.slug : null,
        tenantPlan: user.tenant ? user.tenant.plan : null
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/check", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).populate("tenant");
    console.log("hit", user);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: user.tenant ? user.tenant.slug : null,
        tenantPlan: user.tenant ? user.tenant.plan : null
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
})

module.exports = router;
