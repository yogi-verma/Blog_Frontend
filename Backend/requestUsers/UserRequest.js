const mongoose = require("mongoose");

const userRequestSchema = new mongoose.Schema({
  email: { type: String, required: true,unique: true },
  fullName: { type: String, required: true },
  reason: { type: String, required: true },
  otp: { type: String },               // Temporary OTP
  otpExpiresAt: { type: Date },        // Expiry (e.g., 10 mins)
  isVerified: { type: Boolean, default: false } // Email verified or not
}, { timestamps: true });


const UserRequest = mongoose.model("UserRequest", userRequestSchema);

module.exports = UserRequest;
