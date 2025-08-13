const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, unique: true, index: true },
    phone: { type: String, default: "" },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["citizen", "admin"], default: "citizen" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
