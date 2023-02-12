import { Server } from "socket.io";
import { UserServices } from "../services/userServices";

const push = async (io: Server, originId: string, destinationId: string) => {
  const { firstname, lastname } = await UserServices.findUserById(
    destinationId
  );

  const userDestinationName = `${firstname} ${lastname}`;

  const data = {
    message: `${userDestinationName} accepted your request`,
    destinationId,
  };

  io.to(originId).emit("notification", data);
};

const NotificationEvents = {
  handle: {},
  emit: { push },
};

export default NotificationEvents;
