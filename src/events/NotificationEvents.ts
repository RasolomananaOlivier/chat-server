import { Server } from "socket.io";
import { INotification } from "../database/models/NotificationModel";
import NotificationServices from "../services/notificationServices";
import { UserServices } from "../services/userServices";

const push = async (io: Server, originId: string, destinationId: string) => {
  const { firstname, lastname } = await UserServices.findUserById(
    destinationId
  );

  const userDestinationName = `${firstname} ${lastname}`;

  const data: INotification = {
    message: `${userDestinationName} accepted your request`,
    // This notification is destinated to the origin
    destinationId: originId,
  };

  await NotificationServices.create(data);
  const notifications = await NotificationServices.getAllByDestinationId(
    originId
  );

  io.to(originId).emit("notification:listen", notifications);
};

const NotificationEvents = {
  handle: {},
  emit: { push },
};

export default NotificationEvents;
