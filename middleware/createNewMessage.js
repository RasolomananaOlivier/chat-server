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
module.exports = createNewMessage;