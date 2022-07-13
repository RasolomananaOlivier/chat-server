const User = require('../models/user-model.js')

async function AddFriendAndRemoveRequest(id, friendData) {
    try {
        const userDoc = await User.findById(id);
        userDoc.friendsCollections.push(friendData);


        // Remove it from the request
        const newRequests = [];
        userDoc.requests.forEach(req => {
            if (req._id !== friendData._id) {
                newRequests.push(req);
            }
        })
        userDoc.requests = newRequests;


        const saved = await userDoc.save();

        return saved;
    } catch (error) {
        console.log(error);
    }

}

async function AddUserDataToFriendCollection(userId, details) {
    try {
        const userDoc = await User.findById(userId);

        const friendDoc = await User.findById(details._id);

        const data = {
            _id: `${userDoc._id}`,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            nickName: userDoc.nickName,
            avatarFileName: userDoc.avatarFileName,
            email: userDoc.email,
            bio: userDoc.bio
        }
        console.log('verify avatar id', data);
        friendDoc.friendsCollections.push(data);

        // console.log(friendDoc);
        const saved = await friendDoc.save();

        return saved;
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    AddUserDataToFriendCollection,
    AddFriendAndRemoveRequest
};