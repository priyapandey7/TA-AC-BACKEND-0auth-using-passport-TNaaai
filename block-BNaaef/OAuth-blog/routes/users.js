var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/register', async (req, res, next)=> {
  try {
    res.render('register');
  } catch (error) {
    return next(error);
  }
});

router.post('/register', async (req,res,next)=> {
  try {
    const user = await User.create(req.body);
    res.redirect('/users/login');
  } catch (error) {
    return next(error);
  }
}),

router.get('/login', async (req,res,next)=> {
  try {
    res.render('login');
  } catch (error) {
    return next(error)
  }
})

router.post('/login', async (req,res,next)=> {
  try {
    var {email,password} = req.body;
    if(!email || !password){
      return res.redirect('/users/login');
    }
    const user = await User.findOne({email});
    if(!user){
      return res.redirect('/users/login');
    }
    const isVerified = await user.verifyPassword(password);
    if(!isVerified){
      return res.redirect('/users/login');
    }
    req.session.userId = user.id;
    res.redirect('/articles');
  } catch (error) {
    return next(error);
  }
});

router.get('/logout', async (req,res,next)=> {
  try {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/');
  } catch (error) {
    return next(error);
  }
})

module.exports = router;
