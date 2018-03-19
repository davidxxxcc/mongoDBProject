const User = require('./user');
const BlogPost = require('./blogPost');
const Comment = require('./comment');
const mongoose = require('mongoose');
const async  = require('async');


//global.Promise ES6 standard
mongoose.Promise = global.Promise;

// beforeAll((done) => {
//     mongoose.connect('mongodb://localhost/users_jest_test');
//     mongoose.connection
//         .once('open', () => {
//             done();
//         })
//         .on('error', (error) => {
//             console.warn('Warning', error);
//         });
// });

// beforeEach((done) => {
//     const { users, comments, blogposts } = mongoose.connection.collections;
//     // Delete users data in DB, No mutli drops at same time in mongoDB
//     users.drop(() => {
//         comments.drop( () => {
//             blogposts.drop(() => {
//                 done();
//             });
//         });
//     });
// });

// async.series([
//     function(callback) {
//         // do some stuff ...
//         callback(null, 'one');
//     },
//     function(callback) {
//         // do some more stuff ...
//         callback(null, 'two');
//     }
// ],
// // optional callback
// function(err, results) {
//     // results is now equal to ['one', 'two']
// });

beforeEach((done) => {
   const { users, comments, blogposts } = mongoose.connection.collections;
//    Delete users data in DB, No mutli drops at same time in mongoDB
    async.series([
        function (next) {
            users.drops();
            next(null, 'users collection drop done');
        },
        function (next) {
            comments.drops();
            next(null, 'comments collection drop done');
        },
        function (next) {
            blogposts.drops();
            next(null, 'blogposts collection drop done');
        }],
        function (err, results) {
            console.log(results);
            done();
        });
});

// afterAll((done) => {
//     mongoose.disconnect();
//     done();
// });



describe('Creating records', () => {

    test('saves a user', (done) => {
        const joe = new User({ name: 'Joe' });

        // Insert data to the database
        // It's asychronise call, use promise
        joe.save()
            .then(() => {
                // Has joe been saved successfully?
                expect(joe.isNew).toBe(false);
                done();
            });

    });
});

describe('Reading users out of the database', () => {
    let joe, maria, alex, zach;

    beforeEach((done) => {

        alex = new User({ name: 'Alex' });
        maria = new User({ name: 'Maria' });
        zach = new User({ name: 'Zach' });
        joe = new User({ name: 'Joe' });
        Promise.all([alex.save(), joe.save(), maria.save(), zach.save()])
            .then(() => done());
    });

    test('finds all users with a name of joe', (done) => {
        User.find({ name: 'Joe' })
            .then((users) => {
                // console.log(users.length);   // This is a object id
                expect(users[0]._id.toString()).toEqual(joe._id.toString());
                done();
            });
    });


    test('find a user with a particular id', (done) => {
        User.findOne({ _id: joe._id })
            .then((user) => {
                // console.log(user);
                expect(user.name).toEqual('Joe');
                done();
            });
    });

    test('can skip and limit the result set', (done) => {
        // -Alex- [Joe Maria] Zach
        User.find({})
            .sort({ name: 1 })
            .skip(1).limit(2)
            .then((users) => {
                expect(users.length).toEqual(2);
                expect(users[0].name).toEqual('Joe');
                expect(users[1].name).toEqual('Maria');
                done();
            });
    });
});

describe('Deleting a user', () => {

    beforeEach((done) => {
        joe = new User({ name: 'Joe' });
        joe.save()
            .then(() => done());
    });

    it('model instance remove', (done) => {
        joe.remove()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                expect(user).toEqual(null);
                done();
            });
    });

    it('model method remove', (done) => {
        // Remove a bunch of records with some given criteria
        User.remove({ name: 'Joe' })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                expect(user).toEqual(null);
                done();
            });
    });

    it('model method findAndRemove', (done) => {
        User.findOneAndRemove({ name: 'Joe' })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                expect(user).toEqual(null);
                done();
            });
    });

});

describe('Updating records', () => {
    let joe;

    beforeEach((done) => {
        joe = new User({ name: 'Joe', likes: 0 });
        joe.save()
            .then(() => done());

    });

    function assertName(operation, done) {
        operation
            .then(() => User.find({}))      //find({}) to list all of user[] in User class
            .then((users) => {
                expect(users.length).toEqual(1);
                expect(users[0].name).toEqual('Alex');
                done();
            });
    }

    test('instance type using set n save', (done) => {
        joe.set('name', 'Alex');
        assertName(joe.save(), done);
    });

    test('A model instance can update', (done) => {
        assertName(joe.update({ name: 'Alex' }), done);
    });

    test('A model class can update', (done) => {
        assertName(
            User.update({ name: 'Joe' }, { name: 'Alex' }),
            done
        );

    });


    test('A model class can update one record', (done) => {
        assertName(
            User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }),
            done
        );
    });


    test('A model class can find a record with an Id and update', (done) => {
        assertName(
            User.findByIdAndUpdate(joe.id, { name: 'Alex' }),
            done
        );
    });

    // xit is to suspend the test
    test('A user can have their postCount incremented by 1', (done) => {
        User.update({ name: 'Joe' }, { $inc: { likes: 10 } })
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                expect(user.likes).toEqual(10)
                done();
            })
    });

});


describe('Validating records', () => {

    test('requires a user name', () => {
        const user = new User({ name: undefined });
        const validationResult = user.validateSync();
        const { message } = validationResult.errors.name;
        // console.log(validationResult);

        expect(message).toEqual('Name is required');
    })

    it('requires a user\'s name longer than 2 characters', () => {
        const user = new User({ name: 'Al' });
        const validationResult = user.validateSync();
        const { message } = validationResult.errors.name;
        expect(message).toEqual('Name must be longer than 2 characters.');

    });

    it('disallows invalid records from being saved', (done) => {
        const user = new User({ name: 'Al' });
        user.save()
            .catch((validationResult) => {
                const { message } = validationResult.errors.name;
                expect(message).toEqual('Name must be longer than 2 characters.');
                done();
            })
    });
});