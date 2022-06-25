const express = require("express");
const createNewMessage = require("../middleware/createNewMessage");
const sendToFriend = require("../middleware/sendtofriend");
const Media = require("../models/media-model");
const Message = require("../models/message-model");
const mongodb = require('mongodb')

const app = express();

app.get("/allMessage/:id", async (req, res) => {
    try {

        const result = await Message.find({});
        // console.log('>mess', result);
        const resultFiltered = [];
        result.forEach(element => {
            if (element.access.some(elem => elem === req.params.id)) {
                resultFiltered.push(element);
            }
        })
        // console.log('>allmessage', resultFiltered);
        res.json(resultFiltered);
    } catch (error) {
        console.log("> Error  ", error);
    }
});
app.get("/allMedias/:id", async (req, res) => {
    try {

        const result = await Media.find({});
        // console.log('>mess', result);
        const resultFiltered = [];
        result.forEach(element => {
            if (element.access.some(elem => elem === req.params.id)) {
                resultFiltered.push(element);
            }
        })
        // console.log('>allmedia', resultFiltered);
        res.json(resultFiltered);
    } catch (error) {
        console.log("> Error  ", error);
    }
});

app.get("/defaultMessage/:user", async (req, res) => {
    try {
        const result = await Message.findOne({ user: req.params.user });
        //console.log('params' );
        //console.log('default msg ' , result);
        res.json(result);
    } catch (error) {
        console.log("> Error  ", error);
    }
});



app.post("/send", sendToFriend, async (req, res) => {
    try {
        // console.log("> updating user ....");
        const { user, friend, id, content, timeStamp } = req.body;
        const research = await Message.findOne({
            $and: [{ user: user }, { friend: friend }],
        });
        if (research === null) {
            createNewMessage(user, friend, id, content, timeStamp)
                .then((result) => {
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            // console.log("> user messages found");
            research.messages.push({
                id: id,
                author: user,
                content: content,
                timeStamp: timeStamp,
            });
            research
                .save()
                .then((result) => {
                    console.log(" > updated OK");
                    console.log(result);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    } catch (error) {
        console.log(error);
    }
});



app.delete("/message/item/:messageId/:userId/:itemId", async (req, res) => {
    try {
        const { messageId, userId, itemId } = req.params;
        const message = await Message.findById(messageId);

        let newItems = []
        message.items.forEach(item => {

            if (`${item._id}` === itemId) {
                const newHasCopy = item.hasCopy.filter(accessId => accessId !== userId)
                // Verify if the item has deleted by both users
                if (newHasCopy.length !== 0) {
                    newItems.push({
                        _id: item._id,
                        auth: item.auth,
                        messageType: item.messageType,
                        content: item.content,
                        timeStamp: item.timeStamp,
                        hasCopy: newHasCopy
                    })
                }

            } else {
                newItems.push(item)
            }
        })
        message.items = newItems;
        const saved = await message.save();
        res.json(saved);
    } catch (error) {
        console.log(error);
    }
});


app.delete("/message/all/:messageId/:userId/:mediaId", async (req, res) => {
    try {
        const { messageId, userId, mediaId } = req.params;
        const message = await Message.findById(messageId);
        const media = await Media.findById(mediaId)


        let newItems = []
        message.items.forEach(item => {
            const newHasCopy = item.hasCopy.filter(accessId => accessId !== userId)
            // Verify if the item has deleted by both users
            if (newHasCopy.length !== 0) {
                newItems.push({
                    _id: item._id,
                    auth: item.auth,
                    messageType: item.messageType,
                    content: item.content,
                    timeStamp: item.timeStamp,
                    hasCopy: newHasCopy
                })
            }
        })
        message.items = newItems;
        const savedMsg = await message.save();

        let newCollection = []
        media.collections.forEach(item => {
            const newHasCopy = item.hasCopy.filter(accessId => accessId !== userId)
            // Verify if the item has been deleted by both users
            if (newHasCopy.length !== 0) {
                newItems.push({
                    _id: item._id,
                    hasCopy: newHasCopy,
                    mediaId: item.mediaId
                })
            }
        })
        media.collections = newCollection
        const savedMedia = await media.save()

        res.json({
            message: savedMsg,
            media: savedMedia
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = app;
