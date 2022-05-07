const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
    },
    city : {
        type : String,
        required : true
    }
    
});

userSchema.pre('save', async function(next){
    try {
        if(this.password && this.isModified('password')){
            const verify = await bcrypt.hash(this.password,10);
            this.password = verify;
            return next();
        }
    } catch (error) {
        return next(error);   
    }
});

userSchema.methods.verifyPassword = async function(password){
    try {
        const verify = bcrypt.compare(password, this.password);
        return verify;
    } catch (error) {
        return error;
    }
}


const User = mongoose.model('User', userSchema);
module.exports = User;