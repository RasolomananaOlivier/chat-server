const User = require('../models/user-model')

const modifyNicknameHandler = async (io, { userId, newUserNickname }, { friendId, newFriendNickName }) => {
    try {
        const userDoc = await User.findById(userId);
        const friendDoc = await User.findById(friendId);
        const messageId = newUserNickname.messageId;

        userDoc.nickName = updateNickNameList(userDoc.nickName, messageId, newUserNickname);
        userDoc.friendsCollections = updateNickNameListInsideFriendsCollections(userDoc, friendId, messageId, newFriendNickName)



        friendDoc.nickName = updateNickNameList(friendDoc.nickName, messageId, newFriendNickName);
        friendDoc.friendsCollections = updateNickNameListInsideFriendsCollections(friendDoc, userId, messageId, newUserNickname)

        const userDocUpdated = await userDoc.save()
        const friendDocUpdated = await friendDoc.save()

        const userData = {
            newUserNicknameList: userDocUpdated.nickName,
            newUserFriendsCollection: userDocUpdated.friendsCollections,
            messageId,
            friendId
        };
        const friendData = {
            newUserNickNameList: friendDocUpdated.nickName,
            newUserFriendsCollection: friendDocUpdated.friendsCollections,
            messageId,
            friendId: userId
        }

        io.emit(`${userId}_NEW_NICKNAME`, userData)
        io.emit(`${friendId}_NEW_NICKNAME`, friendData)
    } catch (error) {
        console.log(error);
    }
}

function updateNickNameListInsideFriendsCollections(userModel, id, messageId, newNickName) {
    let newFriendsCollections = []
    userModel.friendsCollections.forEach(friend => {
        let data = {
            _id: `${friend._id}`,
            email: friend.email,
            firstName: friend.firstName,
            lastName: friend.lastName,
            nickName: friend.nickName,
            bio: friend.bio,
            birthday: friend.birthday,
            avatarFileName: friend.avatarFileName,
        }
        if (`${friend._id}` === id) {
            const updatedCorrectFriend = {
                ...data,
                nickName: updateNickNameList(friend.nickName, messageId, newNickName)
            };
            newFriendsCollections.push(updatedCorrectFriend);
        } else {
            newFriendsCollections.push(data)
        }
    });
    return newFriendsCollections;
}

function updateNickNameList(nickNameList, messageId, newNickName) {
    return nickNameList.map(nickName => nickName.messageId === messageId ? newNickName : nickName);
}
module.exports = modifyNicknameHandler

