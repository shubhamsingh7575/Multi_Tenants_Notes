const express = require("express");
const Tenant = require("../models/Tenant");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Upgrade tenant to Pro (Admin only)
router.post("/:slug/upgrade", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Only admins can upgrade subscription" });
    }

    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

    tenant.plan = "PRO";
    await tenant.save();

    res.json({ message: `Tenant ${tenant.name} upgraded to PRO` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
