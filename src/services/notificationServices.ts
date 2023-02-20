import { isValidObjectId } from "mongoose";
import NotificationModel from "../database/models/NotificationModel";
import { AppError } from "../utils/appError";
import { INotification } from "../database/models/NotificationModel";

const getAllByDestinationId = async (destinationId: string) => {
  if (isValidObjectId(destinationId)) {
    const notifications = await NotificationModel.find({ destinationId });

    return notifications;
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidDestinationId",
      message: "DestinationId must be a valid objectId",
    });
  }
};

const create = async (notification: INotification) => {
  await NotificationModel.create(notification);
};

const markAsRead = async (notificationId: string) => {
  if (isValidObjectId(notificationId)) {
    const notification = await NotificationModel.findOneAndUpdate(
      {
        _id: notificationId,
      },
      { isRead: true },
      { new: true }
    );

    return await getAllByDestinationId(notification?.destinationId!);
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidNotificationId",
      message: "NotificationId provided is not a valid",
    });
  }
};

const markAllAsRead = async (destinationId: string) => {
  if (isValidObjectId(destinationId)) {
    await NotificationModel.updateMany({ destinationId }, { isRead: true });

    return await getAllByDestinationId(destinationId);
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidDestinationId",
      message: "DestinationId provided is not a valid",
    });
  }
};

const NotificationServices = {
  getAllByDestinationId,
  create,
  markAsRead,
  markAllAsRead,
};

export default NotificationServices;
