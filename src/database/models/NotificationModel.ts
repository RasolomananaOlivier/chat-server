import { model, Schema } from "mongoose";

export interface INotification {
  message: string;
  // For who the request is
  destinationId: string;
}

const notificationSchema = new Schema<INotification>({
  message: { type: String, require: true },
  destinationId: { type: String, require: true },
});

const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
