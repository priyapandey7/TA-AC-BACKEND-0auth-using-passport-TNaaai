var express = require('express');
var router = express.Router();
var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login using Github Passport' });
});

router.get('/success', async(req,res,next)=> {
  try {
    res.render('success');
  } catch (error) {
    next(error);
  }
});

router.get('/failure', async(req,res,next)=> {
  try {
    res.render('failure');
  } catch (error) {
    next(error);
  }
});
// routes for guthub
router.get('/auth/github',passport.authenticate('github'));

router.get(
  '/auth/github/callback', 
  passport.authenticate('github', {failureRedirect : '/failure'}), 
  async (req,res,next)=> {
    try {
      res.redirect('/success');
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;
