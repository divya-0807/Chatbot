const User = require('../models/User');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/sendEmail");

exports.signup = async(req,res) => {
   try {
     const {email,password} = req.body;
     const user = await User.findOne({email});
     if(user){
        return res.status(200).json({
            message : 'User already exists'
        })
     }
    const hashed = await bcrypt.hash(password,10);
    await User.create({email,password:hashed});
    res.status(201).json({message : 'Registered Successfully'});
    
   } catch (error) {
    res.status(400).json({
        message :'Registration Unsuccessfull'
    })
   }
};

exports.login = async(req,res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: 'User does not exist'
            })
        }
        const hashed = await bcrypt.compare(password,user.password);
        if(!hashed){
            return res.status(400).json({
                message: 'Invalid Credentials'
            })            
        }

        const token = jwt.sign({userId: user._id},process.env.JWT_SECRET,{ expiresIn: '7d' });
        res.cookie('jwt', token, {
  httpOnly: true,
  secure: true,         // ✅ Required for HTTPS (Render uses HTTPS)
  sameSite: 'None',     // ✅ Required for cross-origin cookies
  maxAge: 7 * 24 * 60 * 60 * 1000, // Optional: 7 days
});

        res.json({message: 'Login Successful'});
        
    } catch (error) {
         res.status(400).json({
        message :'Login Unsuccessful'
    })
    }
};

exports.forgotPassword = async(req,res) =>{
    const {email} = req.body;
    const user = await User.findOne({email});
     if(!user) return res.status(400).json({message: 'User not found'});

     const otp = Math.floor(100000 + Math.random() * 90000).toString();
     const expires = new Date(Date.now() + 10*60*1000);

     user.otp = otp;
     user.otpExpires = expires;
     await user.save();

     await sendEmail(user.email,'Your OTP Code for ChatBot', `Your OTP is ${otp}`);
     res.json({message: 'OTP has been sent successfully to your email'});
};

exports.verifyOTP = async(req,res) => {
    const {email,otp,newPassword} = req.body;
    const user =  await User.findOne({email});

    if (!user || user.otp !== otp || user.otpExpires < Date.now())
    return res.status(400).json({ message: 'Invalid or expired OTP' });

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successfully' });
}

exports.myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error while fetching profile",
    });
  }
};

exports.logout = async (req, res) => {
  try {
    console.log("🔐 Logout hit");
    console.log("Cookies before clearing:", req.cookies);

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("🔥 Logout error:", error);
    res.status(500).json({ message: error.message || "Logout failed" });
  }
};
