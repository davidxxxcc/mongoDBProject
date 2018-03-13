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
    // Delete users data in DB
    mongoose.connection.collections.users.drop(()=>{
        // Reaady to run the next test!
        done();
    });
});