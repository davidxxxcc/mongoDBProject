const User = require('../src/user');

describe('Reading users out of the database', () => {
    let joe, maria,alex, zach;

    
    beforeAll((done) => {

        alex = new User({ name: 'Alex'});
        maria = new User({ name: 'Maria'});
        zach = new User({ name: 'Zach'});
        joe = new User({ name: 'Joe'});
        Promise.all([alex.save(), joe.save(), maria.save(), zach.save()])
            .then(()=> done());
    });

    test('finds all users with a name of joe', (done) => {
        User.find({ name: 'Joe' })
            .then((users) => {
                console.log(users.length);   // This is a object id
                expect(users[0]._id.toString()).toEqual(joe._id.toString());
                done();
            });
    });  


    // it('find a user with a particular id', (done) => {
    //     User.findOne( { _id: joe._id} )
    //         .then((user) => {
    //             // console.log(user);
    //             assert(user.name === 'Joe')
    //             done();
    //         });
    // });

    // it('can skip and limit the result set', (done) => {
    //     // -Alex- [Joe Maria] Zach
    //     User.find({})
    //         .sort({ name: 1})
    //         .skip(1).limit(2)
    //         .then((users) => {
    //             assert(users.length === 2);
    //             assert(users[0].name === 'Joe');
    //             assert(users[1].name === 'Maria');
    //             done();
    //         });

    // });
});