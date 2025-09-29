const User = require("../models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/OtpSchema");
const { generateOtp, hashText } = require("../utils/otp");
const { sendEmail } = require("../utils/mailSender");

const OTP_EXPIRE_MIN = 5;

// ---------------- SIGNUP ----------------
exports.signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, courses } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      courses,
      isVerified: false
    });

    const otp = generateOtp();
    const otpHash = hashText(otp);

    await Otp.create({
      userId: newUser._id,
      email,
      otpHash,
      purpose: "VERIFY_EMAIL",
      expiresAt: new Date(Date.now() + OTP_EXPIRE_MIN * 60 * 1000),
      attempts: 0
    });

    await sendEmail(email, "Your verification OTP", `OTP: ${otp}. Expires in ${OTP_EXPIRE_MIN} minutes.`);

    return res.status(201).json({ message: "Signup success — OTP sent to email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signup failed", error });
  }
};

// ---------------- LOGIN ----------------
exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Fill both email & password" });

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: "User not registered" });

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

    const otp = generateOtp();
    const otpHash = hashText(otp);

    await Otp.create({
      userId: existingUser._id,
      email,
      otpHash,
      purpose: "LOGIN",  // ✅ important fix
      expiresAt: new Date(Date.now() + OTP_EXPIRE_MIN * 60 * 1000),
      attempts: 0
    });

    await sendEmail(email, "Your login OTP", `OTP: ${otp}. Expires in ${OTP_EXPIRE_MIN} minutes.`);

    return res.status(200).json({ message: "Login success — OTP sent to email" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login failed", error });
  }
};

// ---------------- VERIFY OTP ----------------
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, purpose } = req.body;
    if (!email || !otp || !purpose) return res.status(400).json({ message: "Missing fields" });

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(400).json({ message: "Invalid request" });

    const otpRecord = await Otp.findOne({ userId: existingUser._id, purpose }).sort({ createdAt: -1 });
    if (!otpRecord) return res.status(400).json({ message: "No OTP found, request a new one" });

    if (otpRecord.expiresAt < new Date()) {
      await otpRecord.deleteOne();
      return res.status(400).json({ message: "OTP expired" });
    }

    if (otpRecord.attempts >= 5) {
      await otpRecord.deleteOne();
      return res.status(400).json({ message: "Too many attempts" });
    }

    if (hashText(otp) !== otpRecord.otpHash) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: "Wrong OTP" });
    }

    // OTP correct → delete
    await otpRecord.deleteOne();

    if (purpose === "VERIFY_EMAIL") {
      existingUser.isVerified = true;
      await existingUser.save();
      return res.json({ message: "Email verified successfully" });
    }

    if (purpose === "LOGIN") {
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id, role: existingUser.accountType },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          accountType: existingUser.accountType
        }
      });
    }

    return res.json({ message: "OTP verified" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "OTP verification failed", error });
  }
};
