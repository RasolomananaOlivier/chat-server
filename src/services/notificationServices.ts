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

const NotificationServices = {
  getAllByDestinationId,
  create,
};

export default NotificationServices;
