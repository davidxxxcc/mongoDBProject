console.log("=============================DB setup=============================");
const User = require('./src/user');
const BlogPost = require('./src/blogPost');
const Comment = require('./src/comment');
const mongoose = require('mongoose');


const startServer = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect('mongodb://localhost/users_jest_test');
        mongoose.connection
        .once('open', () => {
            resolve();
        })
        .on('error', (error) => {
            console.warn('Warning', error);
            reject();
        });
    });
}

startServer();