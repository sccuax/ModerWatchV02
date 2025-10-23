const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscamos al usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Verificamos la contraseña
        const validPass = await user.comparePassword(password);
        if (!validPass) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // AQUÍ ES DONDE VERIFICAMOS EL STATUS
        if (user.status === 'pending') {
            return res.status(403).json({ 
                error: "Your account is pending approval",
                message: "Please wait for an administrator to approve your registration"
            });
        }

        if (user.status === 'rejected') {
            return res.status(403).json({ 
                error: "Your registration request was rejected",
                message: "Please contact an administrator for more information"
            });
        }

        // Solo si status === 'approved' llegamos aquí
        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "3h" }
        );

        res.json({ 
            token,
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { login };