const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otpHash: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["VERIFY_EMAIL", "RESET_PASSWORD"],
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("otp", OTPSchema);