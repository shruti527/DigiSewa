// models/User.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, default: "" },
  address: { type: String, default: "" },
  dob: { type: Date, default: null },
  governmentId: { type: String, default: "" },
  isVerified: { type: Boolean, default: false },
  role: { type: String, default: "citizen", enum: ["citizen", "admin"] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);