const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = require('./post');

// String is a key word in JavaScript
const UserSchema = new Schema({
    name: { 
        type: String,
        validate: {
            validator: (name) => name.length > 2 ,
            message: 'Name must be longer than 2 characters.'
            
        },
        required: [true, 'Name is required']  // show info user friendly string, will showup in at validationResult.errors.name
    },
    postCount: Number,
    posts:[PostSchema]  
});

// User class
const User = mongoose.model('user', UserSchema);

module.exports = User;
