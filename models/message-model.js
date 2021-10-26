const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    user : String ,
    friend : String ,
    messages : [
        {
            id : String ,
            author : String ,
            content : String ,
            timeStamp : String
        }
    ]
});

const Message  = mongoose.model('message', MessageSchema );

module.exports = Message;