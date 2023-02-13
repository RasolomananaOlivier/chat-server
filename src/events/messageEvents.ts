import { Server, Socket } from "socket.io";
import { IMessageItem } from "../database/models/MessageModel";
import MessageServices, { IMessagePayload } from "../services/messageServices";
import Utilities from "../utils";

const push = (io: Server, socket: Socket) => {
  socket.on("message:push", async (messagePayload: IMessagePayload) => {
    console.log(messagePayload.messageId);

    const message = await MessageServices.addNewMessageItem(messagePayload);

    if (message) {
      io.to(Utilities.stringify(message._id)).emit("message:update", message);
    }
  });
};

const MessageEvents = {
  handle: { push },
};

export default MessageEvents;
