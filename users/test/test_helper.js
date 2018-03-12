const mongoose = require('mongoose');

// "/users_test" to specify the database insiede Mongo instance
mongoose.connect('mongodb://localhost/users_test');
mongoose.connection
    .once('open', () => console.log('Good to go!'))
    .on('error', (error) => {
        console.warn('Warning', error );
    });

beforeEach((done) => {
    mongoose.connection.collections.users.drop(()=>{
        // Reaady to run the next test!
        done();
    });
});