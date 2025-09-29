const express = require("express");
const router = express.Router();
const { verifyOtp,signIn,signUp } = require("../Controllers/userController");


router.post("/verify-otp",verifyOtp)
router.post("/signup",signUp)
router.post("/login",signIn)
module.exports = router;