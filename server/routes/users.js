const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");

// Get all users
router.get("/", getAllUsers);

// Get user by ID
router.get("/:id/userId", getUserById);

// Update user
router.patch("/:id/userId", updateUser);

// Delete user
router.delete("/:id/userId", deleteUser);

module.exports = router;