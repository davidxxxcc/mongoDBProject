const assert = require('assert');
const User = require('../src/user');

describe('Virtual types', () => {
    it('postCount returns number of posts', (done) => {
        const joe = new User({ 
            name: 'Joe',
            posts: [{ title: 'PostTitle' }]
        });
        // joe.postCount // 0 null undefined
        joe.save()
            .then(() => User.findOne({ name: 'Joe' }))
            .then((user) => {
                assert(joe.postCount === 1);
                done();
            })
    });
})