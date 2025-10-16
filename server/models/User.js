const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    nationalId: { type: String, required: true, unique: true }, // Nacional identification
    message: { type: String, required: false },
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
