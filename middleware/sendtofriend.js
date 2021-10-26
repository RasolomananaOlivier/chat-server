const Message = require("../models/message-model");

const createNewMessage  = async (user , friend , id , content , timeStamp) => {
    try {
        const newMsg = new Message({
            user : friend ,
            friend : user ,
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


const sendToFriend  = async (body) => {
    try {
        console.log("> updating friend .....");
		const { user, friend, id, content, timeStamp } = body;
		const research = await Message.findOne({
			$and: [{ user: friend }, { friend: user }],
		});
		if (research === null) {
			createNewMessage(user, friend, id, content, timeStamp)
				.then((result) => {
					console.log(result);
                    next()
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
            console.log("> friend messages found");
			research.messages.push({
				id: id,
				author: user,
				content: content,
				timeStamp: timeStamp,
			});
			const saved = await research.save()
			return saved;
				
		}
	} catch (error) {
        console.log(error);
    }
};

module.exports = sendToFriend;
