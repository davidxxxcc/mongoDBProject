const mongoose = require('mongoose');
const User = require('./user');
const BlogPost = require('./blogPost');
const Comment = require('./comment');

// //global.Promise ES6 standard
// mongoose.Promise = global.Promise;

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

beforeEach((done) => {
    const { users, comments, blogposts } = mongoose.connection.collections;
    // Delete users data in DB, No mutli drops at same time in mongoDB
    users.drop(() => {
        comments.drop( () => {
            blogposts.drop(() => {
                done();
            });
        });
    });
});

// afterAll((done) => {
//     mongoose.disconnect();
//     done();
// });

describe('Subdocuments', () => {
    test('can create a subdocument', (done) => {
        const joe = new User({
            name: 'Joe',
            posts: [{ title: 'PostTitle' }]
        });
 
        joe.save()
            .then(() => {
                // Has joe been saved successfully?
                expect(joe.isNew).toEqual(false);
            })
            .then(() => {
                return User.findOne({ name: 'Joe' });           //equal to .then( () => User.findOne({ name: 'Joe' }))
            })
            .then((user) => {
                // console.log(user);
                expect(user.posts[0].title).toEqual('PostTitle');
                done();
            });
    });

    test('Can add subdocuments to an existing record', (done) => {
        const joe = new User( {
            name: 'Joe',
            posts: []
        });

        joe.save()
            .then(() => User.findOne({ name: 'Joe'}))
            .then((user) => {
                user.posts.push({ title: 'New Post' });
                return user.save();
            })
            .then(() => User.findOne({ name: 'Joe'}))
            .then((user) => {
                expect(user.posts[0].title).toEqual('New Post');
                done();
            });
    });

    test('Can remove subdocument to an existing record', (done) => {
        const joe = new User({ 
            name: 'Joe',
            posts:[{ title: 'New Title'}]
        });

        joe.save()
            .then(() => User.findOne({ name: 'Joe'}))
            .then((user) => {
                const post = user.posts[0];
                post.remove();
                return user.save();
            })
            .then(() => User.findOne({ name: 'Joe' }))      //=== .then( () => returnn User.findOne({name: 'Joe}) )
            .then((user) => {
                expect(user.posts.length).toEqual(0);
                done();
            });
    });
});

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
                expect(joe.postCount).toEqual(1);
                done();
            })
    });
})
