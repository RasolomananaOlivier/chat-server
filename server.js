const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const Router = require("./routes/new-account");
const RouterLogin = require("./routes/authentification");
const RouterUpload = require("./routes/upload-avatar");
const RouterUser = require("./routes/all-users");
const MessageRouter = require("./routes/message");

const cors = require("cors");
const { database } = require("./database/config");
const sort = require("./controllers/sortOnline");
const sortOffline = require("./controllers/sortOffline");
const Message = require("./models/message-model");
const createNewMessage = require("./middleware/createNewMessage");
const sendToMe = require("./middleware/sendToMe");
const sendToFriend = require("./middleware/sendtofriend");

const io = new Server(server, {
	cors: {
		/*origin: "https://chat-app-by-rasolomanana-olivier.netlify.app",*/
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

//const db ="mongodb+srv://Olivier:Herimanitra0@cluster0.6kowo.mongodb.net/chatapp?retryWrites=true&w=majority";

mongoose
	.connect(database, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.info("> Mongodb connected");
	})
	.catch(() => {
		console.log("> Failed to connected to mongodb");
	});

app.get("/", (req, res) => {
	res.send("hello from the server");
});

app.use(RouterLogin, Router, RouterUpload, RouterUser, MessageRouter);

let actif_array = [];

io.on("connection", (socket) => {
	socket.on("USER_CONNECTED", (user) => {
		console.log(" > connected ; " + user);
		actif_array.push(user);
		console.log(" > all connected ; " + sort(actif_array));

		Message.find({ user: user })
			.then((result) => {
				console.log('message fetch', result);
				if (result !== null) io.emit("FETCH_MESSAGE", result);
			})
			.catch((err) => {
				console.log(err);
			});
	});
	io.emit("ONLINE_USERS", sort(actif_array));
	socket.on("LOG_OUT", (user) => {
		console.log(" > disconnected ; " + user);
		console.log(" > disconnected arr : ", sortOffline(actif_array, user));
		actif_array = sortOffline(actif_array, user);
		io.emit("OFFLINE_USERS", actif_array);
	});

	socket.on("SEND_MESSAGE", (data) => {
		console.log(data);
		sendToMe(data)
			.then((r) => {
				//console.log("result to me ", r);
				io.emit(`${data.user}`, r);
			})
			.catch((err) => {
				console.log(err);
			});

		sendToFriend(data)
			.then((r) => {
				//console.log("result to friend ", r);
				io.emit(`${data.friend}`, r);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});

const port = process.env.PORT || 5000;
//console.log(process.env.NODE_ENV);

server.listen(port, () => console.log(`Server running on port ${port} 🔥`));
// hello
