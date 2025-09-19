const express = require("express");
const bcrypt = require("bcryptjs");
const Tenant = require("../models/Tenant");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Upgrade tenant to Pro (Admin only)
router.post("/:slug/upgrade", authMiddleware, async (req, res) => {
  try {
    const slug = req.params.slug;
    // Only admins can upgrade their own tenant
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can upgrade subscription" });
    }
    if (!req.user.tenant || req.user.tenant.slug !== slug) {
      return res.status(403).json({ message: "Cannot upgrade other tenants" });
    }

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    tenant.plan = "PRO";
    await tenant.save();

    return res.json({ message: `Tenant ${tenant.name} upgraded to PRO`, tenant: { slug: tenant.slug, plan: tenant.plan } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin-only: invite / create user in the same tenant
router.post("/:slug/users", authMiddleware, async (req, res) => {
  try {
    const slug = req.params.slug;
    const { email, role = "MEMBER", password = "password" } = req.body;

    // Only admins of this tenant can invite users
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can invite users" });
    }
    if (!req.user.tenant || req.user.tenant.slug !== slug) {
      return res.status(403).json({ message: "Cannot invite users to other tenants" });
    }

    const tenant = await Tenant.findOne({ slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    const normalizedEmail = (email || "").trim().toLowerCase();
    if (!normalizedEmail) return res.status(400).json({ message: "Email is required" });

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const created = await User.create({
      email: normalizedEmail,
      password: hashed,
      role: role === "ADMIN" ? "ADMIN" : "MEMBER",
      tenant: tenant._id
    });

    // return non-sensitive info
    res.status(201).json({
      id: created._id,
      email: created.email,
      role: created.role,
      tenant: tenant.slug
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
