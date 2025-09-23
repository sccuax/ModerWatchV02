const User = require("../models/User");
const bcrypt = require("bcrypt");

// Sign up (registro)
exports.signup = async (req, res) => {
    try {
    const { name, surname, email, dateOfBirth, nationalId, password } = req.body;

    // Validar que no exista el usuario
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = new User({
        name,
        surname,
        email,
        dateOfBirth,
        nationalId,
        password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });

    } catch (err) {
        res.status(500).json({ error: "Error en el registro", details: err.message });
    }
};
