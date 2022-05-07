var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'My Blogs' });
});

router.get('/auth/github',passport.authenticate('github'));

router.get(
  '/auth/github/callback', 
  passport.authenticate('github', {failureRedirect : '/failure'}),
  (req,res)=> {
    res.redirect('/success');
  }
);

router.get('/auth/google',passport.authenticate('google',{ scope: ['profile','email'] }));

router.get(
  '/auth/google/callback', 
  passport.authenticate('google', {failureRedirect : '/failure'}),
  (req,res)=> {
    res.redirect('/success');
  }
);


module.exports = router;
