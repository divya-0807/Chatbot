const express  = require("express");
const { signup, login, forgotPassword, verifyOTP, myProfile, logout } = require("../controllers/authController");
const { isAuth } = require("../middleware/isAuth");
const router = express.Router();



router.post('/signup',signup);
router.post('/login',login);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password', verifyOTP);
router.post('/logout',logout);

router.get('/me',isAuth,myProfile);

router.get('/check-auth', isAuth, (req, res) => {
  res.status(200).json({ success: true, userId: req.user.userId });
});
module.exports = router;