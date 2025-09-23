const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");

// endpoint for signing up
router.post("/signup", signup);
// endpoint for logging in
router.post("/login", login);

module.exports = router;
