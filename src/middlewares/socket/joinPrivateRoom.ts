import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

const joinPrivateRoom = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  const userId = socket.handshake.headers.id;

  if (userId) {
    socket.join(userId);
  }
  return next();
};

export default joinPrivateRoom;
