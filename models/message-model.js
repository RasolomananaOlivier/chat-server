const mongoose = require("mongoose");



const MessageSchema = mongoose.Schema({
    access: [String],
    type: String, // type : private | public
    // Field only for public message
    admin: String,
    name: String,
    pictureUrl: String,
    // #############################

    items: [
        {
            auth: String,
            messageType: String,
            mediaId: String,
            content: String,
            timeStamp: String,
            hasCopy: [String],
            reactions: [String],
        }
    ],
    more: Number,
    loadAll: Boolean,
    read: Boolean
});

const Message = mongoose.model('message', MessageSchema);

module.exports = Message;