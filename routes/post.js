//import Post, { findById, deleteOne, updateOne } from '../models/Post';
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
// we're creating a router, and body shape for posts queries
router.post('/', async (req, res) => {
    const newPost = new Post({ 
        name: req.body.name, 
        age: req.body.age,
        enroll: req.body.enroll
    }); 
    // saving the post in the database, handling errors and sending the response
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    } 
});

//getting all the posts from the database
router.get('/', async (_req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//determining the route to get specific posts by id
router.get('/:postId', async (req, res) => {
    try {
        const posts = await Post.findById(req.params.postId);
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }

});

// definging the route to delete a post by id
router.delete('/:postId', async (req, res) => {
    try {
        const removedPost = await Post.deleteOne({ _id: req.params.postId });
        res.json(removedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//updating a post by id
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            { $set: { name: req.body.name, age: req.body.age, enroll: req.body.enroll } }
        );
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }  
});

module.exports = router;
//export default router;
//import { Router } from 'express';
//const router = Router();
