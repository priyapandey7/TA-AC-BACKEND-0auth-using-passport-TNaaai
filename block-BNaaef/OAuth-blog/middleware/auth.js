const User = require('../models/User');
module.exports = {
    isUserLogged : async (req,res,next)=> {
        if(req.session && req.session.userId){
            return next()
        } else{
            return res.redirect('/users/login');
        }

    },
    userInfo : async(req,res,next)=>{
        try {
            var userId = req.session && req.session.userId;
            if(userId){
                const user = await User.findById(userId, "firstName lastName email");
                req.user = user;
                res.locals.user = user;
                return next()
            }else{
                req.user = null;
                res.locals.user = null;
                return next();
            }    
        } catch (error) {
            return next(error);
        }
        
    },
}