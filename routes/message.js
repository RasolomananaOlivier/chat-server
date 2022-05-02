const express = require("express");
const createNewMessage = require("../middleware/createNewMessage");
const sendToFriend = require("../middleware/sendtofriend");
const Media = require("../models/media-model");
const Message = require("../models/message-model");

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
		console.log('>allmessage', resultFiltered);
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
