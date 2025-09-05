// Importing necessary modules and setting up environment variables
const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require('../models/Post');
require('dotenv').config();


const router = express.Router();


// ------------------ Middleware to verify token ------------------
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token required' });

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'invalid format' });
    }

    const token = parts[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token invalid or has expired' });
        req.user = decoded; // payload del token
    next();
    });
}


//determining the route to get specific posts by id
router.get('/id/:postId', async (req, res) => {
    try {
        const posts = await Post.findById(req.params.postId);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

//getting all the posts from the database
router.get('/', async (_req, res) => {
    try {
        const students = await Post.find().select('-password'); // no devolver password
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



// we're creating a router, and body shape for posts queries
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Please fill all fields' });

    // verify if alreay exists
        const exists = await Post.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email alrady exists' });

        const hashed = await bcrypt.hash(password, 10);
        const student = new Post({ name, email, password: hashed });
        await student.save();

        res.status(201).json({ message: 'signed up succesfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// login route: here we generate a token for the user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Please fill all the fields' });

        const student = await Post.findOne({ email });
        if (!student) return res.status(404).json({ message: 'User not found' });

        const ok = await bcrypt.compare(password, student.password);
        if (!ok) return res.status(401).json({ message: 'invalid password' });

        // minimun payload  
        const payload = { id: student._id, email: student.email, name: student.name };

        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '5m' });

        res.json({ message: 'logged in', token });
    } catch (err) {
    res.status(500).json({ message: err.message });
    }
});



// protected route to acces with token
router.get('/protected', verifyToken, async (req, res) => {
  // req.user viene del token
  res.json({ message: 'allowed access', user: req.user });
});



// definging the route to delete a post by id
router.delete('/id/:id', async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'not found' });
        res.json({ message: 'student deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//updating a post by id
router.patch('/id/:id', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const update = {};
    if (name) update.name = name;
    if (email) update.email = email;
    if (password) update.password = await bcrypt.hash(password, 10);

    const updated = await Post.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: 'student not found' });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
//export default router;
//import { Router } from 'express';
//const router = Router();
