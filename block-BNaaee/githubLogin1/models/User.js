const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type : String,
    },
    username : {
        type : String,
        unique : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    avatar : {
        type : String
    }  
});

module.exports = mongoose.model('User', userSchema);