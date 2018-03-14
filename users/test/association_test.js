const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
    let joe, blogPost, comment;

    beforeEach((done) => {
        joe = new User({ 
            name: 'Joe' 
        });
        blogPost = new BlogPost({ 
            title:'JS is Great', 
            content: 'Yep it really is!'
        });
        comment = new Comment({
            content: 'Congrats on great post'
        });
        // push entile model to set up association
        joe.blogPosts.push(blogPost);
        blogPost.comments.push(comment);
        comment.user = joe;     //joe is the only user to publish comment

        Promise.all([joe.save(), blogPost.save(), comment.save()])
            .then(() => done());
    })

    it('save a relation between a user and a blogpost', (done) => {
        User.findOne({ name: 'Joe'})
            .populate('blogPosts')
            .then((user) => {
                assert(user.blogPosts[0].title === 'JS is Great');
                done();
            });
    });

    it('save a full relation graph', (done) => {
        User.findOne({ name: 'Joe'})
            .populate({
                path: 'blogPosts',
                populate: {
                    path: 'comments',
                    model: 'comment',
                    populate: {
                        path: 'user',
                        model: 'user'
                    }
                }
            })
            .then((user) => {
                // console.log(user.blogPosts[0].comments[0]);
                assert(user.name === 'Joe');
                assert(user.blogPosts[0].title === 'JS is Great')
                assert(user.blogPosts[0].content === 'Yep it really is!')
                assert(user.blogPosts[0].comments[0].user.name === 'Joe');
                done();
            });
    });
});