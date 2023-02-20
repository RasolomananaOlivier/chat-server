import { isValidObjectId } from "mongoose";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import MessageServices from "../../services/messageServices";
import Utilities from "../../utils";

const joinMessageRoom = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  const userId = socket.handshake.headers.id;
  if (userId && isValidObjectId(userId)) {
    const messages = await MessageServices.findMessagesByUserId(
      userId as string
    );

    messages.forEach((message) => {
      socket.join(Utilities.stringify(message._id));
    });
  }
  return next();
};

export default joinMessageRoom;
