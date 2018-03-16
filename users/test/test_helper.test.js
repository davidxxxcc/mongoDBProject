const mongoose = require('mongoose');

//global.Promise ES6 standard
mongoose.Promise = global.Promise;

// before only execute one time
beforeAll((done) => {
    // "/users_test" to specify the database insiede Mongo instance
    mongoose.connect('mongodb://localhost/users_jest_test');
    mongoose.connection
        .once('open', () => {
            done();
        })
        .on('error', (error) => {
            console.warn('Warning', error);
        });
});


beforeEach((done) => {
    const { users, comments, blogposts } = mongoose.connection.collections;
    // Delete users data in DB, No mutli drops at same time in mongoDB
    users.drop(() => {
        done();
        // comments.drop( () => {
        //     blogposts.drop(() => {
        //         done();
        //     });
        // });
    });
});




// afterAll((done) => {
//     connection.close();
//     db.close();
//     done();
// });



require('./create_test');
require('./reading_test');