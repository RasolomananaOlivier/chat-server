import { Server, Socket } from "socket.io";
import { IMessage } from "../database/models/MessageModel";
import MessageServices, { IMessagePayload } from "../services/messageServices";
import Utilities from "../utils";
interface IMessageClient extends IMessage {
  totalMessages: number;
}
const push = (io: Server, socket: Socket) => {
  socket.on("message:push", async (messagePayload: IMessagePayload) => {
    const message = await MessageServices.addNewMessageItem(messagePayload);

    if (message) {
      const totalMessages = message?.messages.length;

      const messageClient: IMessageClient = {
        _id: message._id,
        authorizedUser: message.authorizedUser,
        messages: message.messages.slice(-15),
        readBy: message.readBy,
        totalMessages,
      };

      io.to(Utilities.stringify(message._id)).emit(
        "message:update",
        messageClient
      );
    }
  });
};

const MessageEvents = {
  handle: { push },
};

export default MessageEvents;
