const Message = require("../models/message-model");
const Media = require("../models/media-model");

async function sendMessageHandler(io, socket, data, item) {
    try {
        const { userId, friendId, messagesId, mediasId } = data;
        const savedMessage = await addMessage(messagesId, item);

        let mediaSaved;
        if (item.messageType === 'media') {
            mediaSaved = await addMedia(mediasId, item);
        }

        socket.emit(`${userId}_NEW_MESSAGE`, savedMessage, mediaSaved);
        io.emit(`${friendId}_NEW_MESSAGE`, savedMessage, mediaSaved);
    } catch (error) {
        console.log(error);
    }
}

async function addMedia(mediasId, item) {
    const mediaDoc = await Media.findById(mediasId);
    const mediaId = {
        mediaId: item.mediaId
    };
    mediaDoc.collections.push(mediaId);
    return await mediaDoc.save();
}

async function addMessage(messagesId, item) {
    const message = await Message.findById(messagesId);

    message.items.push(item);
    const savedMessage = await message.save();
    return savedMessage;
}

module.exports = {
    sendMessageHandler,
    addMedia,
    addMessage
};