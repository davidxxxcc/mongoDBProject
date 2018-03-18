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


describe('Middleware', () => {
    let joe, blogPost;

    beforeEach((done) => {
        joe = new User({ 
            name: 'Joe' 
        });
        blogPost = new BlogPost({ 
            title:'JS is Great', 
            content: 'Yep it really is!'
        });

        // push entile model to set up association
        joe.blogPosts.push(blogPost);

        Promise.all([joe.save(), blogPost.save()])
            .then(() => done());
    });

    test('users clean up dangling blogposts on remove', (done) => {
        joe.remove()
            .then(() => BlogPost.count())
            .then((count) => {
                expect(count).toEqual(0);
                done();
            })
    });

});