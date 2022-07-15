const Message = require('../models/message-model');

const createNewMessage = async (userId, friendId) => {
    try {
        const newMsg = new Message({
            access: [userId, friendId],
            items: [],
            more: 5,
            loadAll: false,
            read: false
        });
        const saved = await newMsg.save();
        return saved;

    } catch (error) {
        console.log(error);
    }
};

const createMessageGroup = async (adminId, members, name, pictureUrl) => {
    try {
        const newMsg = new Message({
            admin: adminId,
            access: members,
            name,
            pictureUrl,

            items: [],
            more: 5,
            loadAll: false,
            read: false
        });
        return await newMsg.save();

    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    createNewMessage,
    createMessageGroup
};