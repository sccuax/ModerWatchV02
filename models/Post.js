//importing mongoose to define the schema
const mongoose = require('mongoose');

//structure to define a post
const postSchema  = mongoose.Schema ({
    //here we're typing the data we want to store in each post
    name: { type: String, required: true },
    age: { type: Number, required: true },
    enroll: { type: Boolean, default: false }

}); 

module.exports = mongoose.model('students', postSchema );