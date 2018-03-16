const User = require('../src/user');


describe('Creating records', () => {

    test('saves a user', (done) => {
        const joe = new User({ name: 'Joe' });

        // Insert data to the database
        // It's asychronise call, use promise
        joe.save()
            .then(() => {
                // Has joe been saved successfully?
                // assert(!joe.isNew);
                expect(joe.isNew).toBe(false);
                done();
            });

    });
});

