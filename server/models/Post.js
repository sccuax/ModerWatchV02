//importing mongoose to define the schema
const mongoose = require('mongoose');

//structure to define a post
const postSchema  = mongoose.Schema ({
    //here we're typing the data we want to store in each post
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }

}); 

module.exports = mongoose.model('students', postSchema );