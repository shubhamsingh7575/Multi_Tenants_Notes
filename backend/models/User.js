const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true }
});

module.exports = mongoose.model("User", userSchema);
