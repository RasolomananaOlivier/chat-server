const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email : {
        type: String ,
        unique : true
    },
    name : String ,
    password : {
        type: String ,
        unique : true
    },
    avatar : String
});

const User  = mongoose.model('user', UserSchema );

module.exports = User;