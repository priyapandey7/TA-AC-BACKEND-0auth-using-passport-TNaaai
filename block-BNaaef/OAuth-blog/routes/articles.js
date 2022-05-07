var express = require('express');
var router = express.Router();
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Slug = require('slug');
const auth = require('../middleware/auth');
const { populate } = require('../models/Article');

/* GET home page. */
router.get('/', async function(req, res, next) {
    try {
        console.log(req.user);
        console.log(res.user);
        const articles = await Article.find({});
        res.render('allArticles', {articles});
    } catch (error) {
        return next(error);
    }
});

router.get('/new',auth.isUserLogged, async (req,res,next)=> {
    try {
        res.render('createArticle')
    } catch (error) {
        return netx(error);
    }
});

router.get('/:slug', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        // console.log(slug, "insdie get ");
        const article =await Article.findOne({slug}).populate('author').populate({path :"comments", populate :{path : "comment_author"}});
        console.log(article, "Artcile inside get");
        res.render('article', {article});
    } catch (error) {
        return next(error);
    }
});

router.use(auth.isUserLogged);



router.post('/', async (req,res,next)=> {
    try {
        req.body.slug = await Slug(req.body.title);
        req.body.author = req.user.id;
        const article = await Article.create(req.body);
        res.redirect('/articles');
    } catch (error) {
        return next(error)
    }
});

router.get('/:slug/edit',async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOne({slug}).populate('author');
        console.log(article);
        console.log(req.user.id === article.author.id);
        if(req.user.id === article.author.id){
            return res.render('editArticleForm',{article});
        }else{
            return res.redirect('/articles/'+ article.slug);
        }

    } catch (error) {
     return enxt(error);   
    }
})

router.post('/:slug', async (req,res,next)=> {
    const slug = req.params.slug;
    try {
        req.body.slug = await Slug(req.body.title);
        const article = await Article.findOneAndUpdate({slug}, req.body, {new : true});
        // console.log(article ,"artcile inside post");
        // console.log(article.slug,"inside post after updadting slug");
        res.redirect('/articles/' + article.slug);
    } catch (error) {
        return next(error);
    }
});

router.get('/:slug/delete', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOne({slug}).populate('author');
        if(req.user.id === article.author.id){
            const deletedArticle = await Article.findOneAndDelete({Slug});
            const deleteComment = await Comment.deleteMany({articleId : deletedArticle.id});
            res.redirect('/articles');
        }else {
            res.redirect('/articles/' + slug);
        }
        
    } catch (error) {
        return next(error);
    }
})




router.get('/:slug/likes/increment', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOneAndUpdate({slug}, {$inc : {likes : 1}}, {new : true});
        res.redirect('/articles/' + slug)
    } catch (error) {
        return next(error);
    }
})

router.get('/:slug/likes/decrement', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOneAndUpdate({slug}, {$inc : {likes : -1}}, {new : true});
        res.redirect('/articles/'+ slug)
    } catch (error) {
        return next(error);
    }
});

router.post('/:slug/comment', async (req,res,next)=> {
    try {
        const slug = req.params.slug;
        const article = await Article.findOne({slug});
        req.body.articleId =   article.id;
        req.body.comment_author = req.user.id;
        const comment = await Comment.create(req.body);
        const updatedArticle = await Article.findByIdAndUpdate(article.id, {$push : {comments : comment.id}})
        res.redirect('/articles/' + slug);
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
