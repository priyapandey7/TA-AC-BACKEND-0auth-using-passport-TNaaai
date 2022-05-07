const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content : {
        type : String,
        required : true
    },
    comment_author : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    likes : {
        type : Number,
        default : 0
    },
    dislikes : {
        type : Number,
        default : 0
    },
    articleId : {
        type : Schema.Types.ObjectId,
        ref : "Article"
    }
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;