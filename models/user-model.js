const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        // unique: true
    },
    firstName: String,
    lastName: String,
    passwd: String,
    nickName: [
        {
            messageId: String,
            value: String
        }
    ],
    bio: String,
    birthday: Date,
    avatarFileName: String,
    friendsCollections: [
        {
            _id: String,
            lastName: String,
            firstName: String,
            nickName: [
                {
                    messageId: String,
                    value: String
                }
            ],
            avatarFileName: String,
            email: String,
            birthday: Date,
            bio: String,
        }
    ],
    requests: [
        {
            _id: String,
            lastName: String,
            firstName: String,
            nickName: [
                {
                    messageId: String,
                    value: String
                }
            ],
            avatarFileName: String,
            email: String,
            birthday: Date,
            bio: String,
        }
    ],
    notificationsCollections: [
        {
            content: String,
            timeStamp: String,
        }
    ],

});

const User = mongoose.model('user', UserSchema);

module.exports = User;