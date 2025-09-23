const user = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await user.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await user.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Update user
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;
        const options = { new: true }; // return the updated document
        const updatedUser = await user.findByIdAndUpdate(userId, updates, options);
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// Delete user
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const deletedUser = await user.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };