const express = require("express");
const router = express.Router();

const { contactUs } = require("../controllers/contactController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, contactUs);

module.exports = router;
