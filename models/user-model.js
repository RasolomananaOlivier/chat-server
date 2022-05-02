const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        // unique: true
    },
    firstName: String,
    lastName: String,
    passwd: String,
    bio: String,
    birthday: String,
    avatarFileName: String,
    friendsCollections: [
        {
            _id: String,
            lastName: String,
            firstName: String,
            avatarFileName: String,
            email: String,
            bio: String,
        }
    ],
    requests: [
        {
            _id: String,
            lastName: String,
            firstName: String,
            avatarFileName: String,
            email: String,
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