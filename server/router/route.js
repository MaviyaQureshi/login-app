const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  verifyUser,
} = require("../controllers/controller");
const { Auth, variable } = require("../middleware/auth");
const { mail } = require("../controllers/mailer");

router.route("/register").post(register); // register user
router.route("/registerMail").post(mail); // send the email
router.route("/authenticate").post(verifyUser, (req, res) => res.end()); // authenticate user
router.route("/login").post(verifyUser, login); // login in app

/** GET Methods */
router.route("/user/:username").get(getUser); // user with username
router.route("/generateOTP").get(verifyUser, variable, generateOTP); // generate random OTP
router.route("/verifyOTP").get(verifyUser, verifyOTP); // verify generated OTP
router.route("/createResetSession").get(createResetSession); // reset all the variables

/** PUT Methods */
router.route("/updateuser").put(Auth, updateUser); // is use to update the user profile
router.route("/resetPassword").put(verifyUser, resetPassword); // use to reset password

module.exports = router;
