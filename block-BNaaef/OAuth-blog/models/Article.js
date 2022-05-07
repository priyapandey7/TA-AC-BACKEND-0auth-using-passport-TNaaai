const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var slug = require('slug')


const articleSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type: String,
        required : true,
    },
    likes: {
        type : Number,
        default : 0,
    },
    comments : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Comment'
        }
    ],
    author : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    slug : {
        type : String,
        unique : true
    }
})

// articleSchema.pre('save', async function(next){
//     try {
//         if(this.title && this.isModified('title')){
//             var slugged = await slug(this.title);
//             this.slug = slugged;
//             return next();
//         }
//     } catch (error) {
//         return next(error);
//     }
// })

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;