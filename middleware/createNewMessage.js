const Message = require('../models/message-model');

const createNewMessage  = async (user , friend , id , content , timeStamp) => {
    try {
        const newMsg = new Message({
            user : user ,
            friend : friend ,
            message : [
                {
                    id : id ,
                    author : user ,
                    content : content ,
                    timeStamp :  timeStamp,
                }
            ]
        })
        const save = await newMsg.save()
        return save

    } catch (error) {
        console.log(error);
    }
};
module.exports = createNewMessage;