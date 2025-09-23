const User = require("../models/User");
const bcrypt = require("bcrypt");

// Sign up (registro)
 const signup = async (req, res) => {
    try {
    const { name, surname, email, dateOfBirth, nationalId, password } = req.body;

    // Here we're validatin if the user alreasy exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    // Encoding password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
        name,
        surname,
        email,
        dateOfBirth,
        nationalId,
        password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Signed up successfuly" });

    } catch (err) {
        res.status(500).json({ error: "Error signing up", details: err.message });
    }
};

//login
const login = async (req, res) => {
    try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "invalid password" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "3h" }
    );

    res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { signup, login };