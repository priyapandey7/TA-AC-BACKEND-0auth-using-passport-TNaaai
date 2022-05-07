var express = require('express');
var router = express.Router();
const Comment = require('../models/Comment');
const Article = require('../models/Article');
const auth = require('../middleware/auth');

router.use(auth.isUserLogged);

router.get('/:id/edit', async(req,res,next)=> {
    try {
        const id = req.params.id;
        const comment = await Comment.findOne({id}).populate('comment_author articleId');
        console.log(comment)
        if(req.user.id === comment.comment_author.id){
            return res.render('editCommentForm', {comment});
        }else {
            return res.redirect('/articles/'+ comment.articleId.slug);
        }
    } catch (error) {
        return next(error)
    }
})

router.post('/:id', async (req,res,next)=> {
    try {
        const id = await req.params.id;
        console.log(req.body)
        const comment = await Comment.findByIdAndUpdate(id,req.body);
        console.log(comment)
        const article = await Comment.findById(id).populate('articleId');
        res.redirect('/articles/' + article.articleId.slug);        
    } catch (error) {
        return next(error)
    }
});

router.get('/:id/likes',async (req,res,next)=> {
    try {
        const id = req.params.id;
        const comment = await Comment.findByIdAndUpdate(id, {$inc : {likes : 1}}, {new: true});
        const article = await Comment.findById(id).populate('articleId');
        res.redirect('/articles/' + article.articleId.slug);
    } catch (error) {
        return next(error);
    }
});

router.get('/:id/dislikes',async (req,res,next)=> {
    try {
        const id = req.params.id;
        const comment = await Comment.findByIdAndUpdate(id, {$inc : {dislikes : 1}}, {new: true});
        const article = await Comment.findById(id).populate('articleId');
        res.redirect('/articles/' + article.articleId.slug);
    } catch (error) {
        return next(error);
    }
});

router.get('/:id/delete', async (req,res,next)=> {
    try {
        const id = req.params.id;
        const comment = await Comment.findById(id).populate('articleId comment_author');
        if(req.user.id === comment.comment_author.id){
            const DeleteComment = await Comment.deleteOne({id: comment.id});
            const article = await Article.findByIdAndUpdate(comment.articleId.id,{$pull : {comments :   comment.id}});
            return res.redirect('/articles/'+ article.slug);
        } else{
            return res.redirect('/articles/'+ comment.articleId.slug);
        }
        
    } catch (error) {
        return next(error);
    }
})
module.exports = router;
