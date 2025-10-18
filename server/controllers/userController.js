const User = require("../models/User");

// Get all users
const getAllUsers = async (req, res) => {
try {
    const { search } = req.query;

    const query = {};
    if (search) {
        query.$or = [
        { name: { $regex: search, $options: "i" } },
        { surname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { nationalId: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
    ];
    }

    const users = await User.find(query);
    res.json(users);
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
//create users

const createUser = async (req, res) => {
try {
    const { name, surname, email, dateOfBirth, nationalId, message, password } = req.body;

    // Validate if the required fields are present
    if (!name || !surname || !email || !dateOfBirth || !nationalId || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Check if a user with the same email or document already exists
    const existingUser = await User.findOne({
        $or: [{ email }, { nationalId }]
    });
    if (existingUser) {
        return res.status(409).json({ error: "User already exists with that email or document" });
    }

    // Create new user
    const newUser = new User({
        name,
        surname,
        email,
        dateOfBirth,
        nationalId,
        message,
        password
    });

    // Save to the database
    await newUser.save();

    res.status(201).json({
        message: "User created successfully",
        user: newUser
    });

} catch (err) {
    res.status(500).json({ error: err.message });
    }
};


// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const options = { new: true }; // return the updated document
        const updatedUser = await User.findByIdAndUpdate(id, updates, options);
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
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };