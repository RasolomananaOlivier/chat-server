const express = require("express");
const createNewMessage = require("../middleware/createNewMessage");
const sendToFriend = require("../middleware/sendtofriend");
const Message = require("../models/message-model");

const app = express();

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

app.get("/currentMessage/:userName/:friendName", async (req, res) => {
	try {
		const result = await Message.findOne({
			$and: [{ user: req.params.userName }, { friend: req.params.friendName }],
		});

		res.json(result);
	} catch (error) {
		console.log("> Error  ", error);
	}
});

app.post("/send", sendToFriend, async (req, res) => {
	try {
		console.log("> updating user ....");
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
			console.log("> user messages found");
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

const middlewareInteraction = async function (req, res, next) {
	try {
		const { user, friend } = req.body;
		const newMessage = new Message({
			user: friend,
			friend: user,
			messages: [],
		});
		const saved = await newMessage.save();
		next();
	} catch (error) {
		console.log(error);
	}
};

app.post("/newInteraction", middlewareInteraction, async (req, res) => {
	try {
		const { user, friend } = req.body;
		const newMessage = new Message({
			user: user,
			friend: friend,
			messages: [],
		});
		const saved = await newMessage.save();
		res.json(saved);
	} catch (error) {
		console.log(error);
	}
});

app.delete("/delete", async (req, res) => {
	try {
		console.log("----> delete message");
		//console.log(req.body);
		const { user, friend } = req.body;
		const deleted = await Message.findOneAndUpdate(
			{
				$and: [{ user: user }, { friend: friend }],
			},
			{ messages: [] },
			{ new: true }
		);

		console.log("---->> updated : true");
		//console.log(deleted);
		res.json(deleted);
	} catch (error) {
		console.log(error);
	}
});

module.exports = app;
