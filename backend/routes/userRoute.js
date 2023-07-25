const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  logout,
  getUserById,
  getUser,
  logginStatus,
  updateUserMethodOne,
  updateUserMethodTwoZ,
  changePasswordMethodOne,
  changePasswordMethodTwoZ,
  forgotPassword
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser/:id", getUserById);
router.get("/getuser", protect, getUser);
router.get("/loggedin", logginStatus);
router.patch("/updateuserMethodOne", protect, updateUserMethodOne);
router.patch("/updateuserMethodTwo", protect, updateUserMethodTwoZ);
router.put("/changepasswordMethodOne", protect, changePasswordMethodOne);
router.put("/changepasswordMethodTwo", protect, changePasswordMethodTwoZ);
router.post("/forgotpassword", forgotPassword);


module.exports = router;