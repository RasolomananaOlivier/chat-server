const mongoose = require("mongoose");



const MessageSchema = mongoose.Schema({
    access: [String, String],

    items: [
        {
            id: String,
            auth: String,
            messageType: String,
            mediaId: String,
            content: String,
            timeStamp: String
        }
    ],
    more: Number,
    loadAll: Boolean,
    read: Boolean
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;