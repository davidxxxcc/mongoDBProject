const mongoose = require('mongoose');

//global.Promise ES6 standard
mongoose.Promise = global.Promise;

// before only execute one time
before((done) => {
    // "/users_test" to specify the database insiede Mongo instance
    mongoose.connect('mongodb://localhost/users_test');
    mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error) => {
            console.warn('Warning', error );
        });
});


beforeEach((done) => {
    const { users, comments, blogposts } = mongoose.connection.collections;     //mongoDB normalize from "blogPosts" into "blogposts"
    // Delete users data in DB
    // No mutli drops at same time in mongoDB
    users.drop(()=>{
        comments.drop(() => {
            blogposts.drop(() => {
                done();
            });
        });
    });
});