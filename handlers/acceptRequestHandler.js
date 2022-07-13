const { AddFriendAndRemoveRequest, AddUserDataToFriendCollection } = require("../middleware/addFriendAndRemoveNot");
const addNotificationToFriend = require("../middleware/addNotification");
const createNewMedia = require("../middleware/createNewMedia");
const createNewMessage = require("../middleware/createNewMessage");
const User = require("../models/user-model");

async function acceptRequestHandler(io, data, socket) {
    const { _id, friendData } = data;
    const userId = _id;
    const friendId = friendData._id;

    const newMessageCollection = await createNewMessage(userId, friendId);
    const newMediaCollection = await createNewMedia(userId, friendId);

    await addNickName(userId, newMessageCollection);
    const friendNewNickName = await addNickName(friendId, newMessageCollection);

    const friendDataWithNewNickname = { ...friendData, nickName: friendNewNickName };
    console.log('friendDataWithNewNickname :>> ', friendDataWithNewNickname);

    const saved = await AddFriendAndRemoveRequest(userId, friendDataWithNewNickname);
    socket.emit(`${userId}_NEW_FRIEND_ACCEPTED`, saved, newMessageCollection, newMediaCollection);

    await AddUserDataToFriendCollection(userId, friendData);
    const notifUpdated = await addNotificationToFriend(userId, friendData);
    io.emit(`${notifUpdated._id}_NEW_NOTIFICATION`, notifUpdated, newMessageCollection, newMediaCollection);
}

async function addNickName(userId, newMediaCollection) {
    const userDoc = await User.findById(userId);
    userDoc.nickName.push({
        messageId: newMediaCollection._id,
        value: `${userDoc.lastName} ${userDoc.firstName}`
    });
    const updatedDoc = await userDoc.save();
    return updatedDoc.nickName


}

module.exports = acceptRequestHandler;