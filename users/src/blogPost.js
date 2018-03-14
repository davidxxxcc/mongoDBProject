const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema({
    title: String,
    content: String,
    comments: [{ 
        type: Schema.Types.ObjectId,
        ref: 'comment'      //const Comment = mongoose.model('comment', CommentSchema);
    }]
});

const BlogPost = mongoose.model('blogPost', BlogPostSchema);

module.exports = BlogPost;