const User = require('../models/user-model.js')

async function AddFriendAndRemoveRequest(id, details) {
    try {
        const result = await User.findById(id);
        result.friendsCollections.push(details);


        // Remove it from the request
        const newRequests = [];
        result.requests.forEach(req => {
            if (req._id !== details._id) {
                newRequests.push(req);
            }
        })
        result.requests = newRequests;


        const saved = await result.save();

        return saved;
    } catch (error) {
        console.log(error);
    }

}

async function AddMeToFriendCollection(id, details) {
    try {
        const result = await User.findById(id);

        const result2 = await User.findById(details._id);

        const details2 = {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            avatarFileName: result.avatarFileName,
            email: result.email,
            bio: result.bio
        }
        // console.log('verify avatar id', details2);
        result2.friendsCollections.push(details2);


        // console.log(result2);
        const saved = await result2.save();

        return saved;
    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    AddMeToFriendCollection: AddMeToFriendCollection,
    AddFriendAndRemoveRequest: AddFriendAndRemoveRequest
};