const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/userController");

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/userId/:id", getUserById);

// Create user
router.post("/", createUser);

// Update user
router.patch("/userId/:id", updateUser);

// Delete user
router.delete("/userId/:id", deleteUser);

module.exports = router;