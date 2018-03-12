const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// String is a key word in JavaScript
const UserSchema = new Schema({
    name: String
});

// User class
const User = mongoose.model('user', UserSchema);

module.exports = User;
