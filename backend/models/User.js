const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
