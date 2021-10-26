const Message = require("../models/message-model");

const createNewMessage  = async (user , friend , id , content , timeStamp) => {
    try {
        const newMsg = new Message({
            user : user,
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


const sendToMe  = async (body) => {
    try {
        console.log('body' , body);
        console.log("> updating .....");
		const { user, friend, id, content, timeStamp } = body;
		const research = await Message.findOne({
			$and: [{ user: user }, { friend: friend}],
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
            console.log("> messages found");
			research.messages.push({
				id: id,
				author: user,
				content: content,
				timeStamp: timeStamp,
			});
			const r = await research.save()
            console.log('> saved ok');
			return r
		}
	} catch (error) {
        console.log(error);
    }
};

module.exports = sendToMe;
