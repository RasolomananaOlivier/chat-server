const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const Router = require("./api/new-account");
const RouterLogin = require("./api/authentification");
const RouterUpload = require("./api/upload-avatar");
const RouterUser = require("./api/all-users");
const MessageRouter = require("./api/message");
const NotificationRouter = require("./api/notification");

const cors = require("cors");
const sortOffline = require("./controllers/sortOffline");
const Message = require("./models/message-model");
const createNewMessage = require("./middleware/createNewMessage");
const User = require("./models/user-model");
const {
  AddFriendAndRemoveRequest,
  AddMeToFriendCollection,
} = require("./middleware/addFriendAndRemoveNot");
const addNotificationToFriend = require("./middleware/addNotification");
const createNewMedia = require("./middleware/createNewMedia");
const Media = require("./models/media-model");
const { DATABASE } = require("./database/config");
const modifyNicknameHandler = require("./handlers/modifyNicknameHandler");
const acceptRequestHandler = require("./handlers/acceptRequestHandler");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

//const db ="mongodb+srv://Olivier:Herimanitra0@cluster0.6kowo.mongodb.net/chatapp?retryWrites=true&w=majority";

mongoose
  .connect(DATABASE, {
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
  res.send({ message: "hello from the server" });
});

app.use("/pic", RouterUpload);

app.use(RouterLogin, Router, RouterUser, MessageRouter, NotificationRouter);

let actif_array = [];

io.on("connection", (socket) => {
  console.log("One user connected", socket.id);
  socket.on("test", (arg) => {
    console.log("received test");
    socket.emit("hello", "0007");
  });

  socket.on("USER-CONNECTED", (user) => {
    console.log(" > connected ; ", user);
    actif_array.push(user);

    io.emit("ONLINE_USERS", [...new Set(actif_array)]);
  });

  socket.on("LOG_OUT", (user) => {
    actif_array = sortOffline(actif_array, user);
    io.emit("OFFLINE_USERS", actif_array);
  });

  socket.on("SEND_MESSAGE", async (data, item) => {
    try {
      const { userId, friendId, messagesId, mediasId } = data;

      const message = await Message.findById(messagesId);

      message.items.push(item);
      const savedMessage = await message.save();

      let mediaSaved;
      if (item.messageType === "media") {
        const mediaDoc = await Media.findById(mediasId);
        const mediaId = {
          mediaId: item.mediaId,
        };
        mediaDoc.collections.push(mediaId);
        mediaSaved = await mediaDoc.save();
      }

      socket.emit(`${userId}_NEW_MESSAGE`, savedMessage, mediaSaved);
      io.emit(`${friendId}_NEW_MESSAGE`, savedMessage, mediaSaved);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("SEND_REQUEST", async (data) => {
    console.log("Request received");
    //  _id is id of the receiver
    const { friendId, details } = data;

    const result = await User.findOne({ _id: friendId });

    result.requests.push(details);
    const saved = await result.save();
    // console.log('friendId', friendId);
    io.emit(`${friendId}_NEW_REQUEST`, saved.requests);
    //TODO: Verify if the 2 persons are already friends
  });

  /**
   * Find the account of the user that accept the request
   * Then, push the new friend details to his/her friend collections,
   * Send the new collection to his propertary.
   * Finally, send a notification to the other user that his/her
   * request has been accepted.
   */
  socket.on("ACCEPT_REQUEST", async (data) => {
    await acceptRequestHandler(io, data, socket);
  });

  socket.on("MODIFY_NICKNAME", async (data) => {
    console.log("data :>> ", data);
    await modifyNicknameHandler(
      io,
      { userId: data?.userId, newUserNickname: data?.newUserNickname },
      { friendId: data?.friendId, newFriendNickName: data?.newFriendNickName }
    );
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server running on port ${port} 🔥`));
