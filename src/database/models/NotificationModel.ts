import { model, Schema } from "mongoose";

export interface INotification {
  message: string;
  // For who the request is
  destinationId: string;
  isRead: boolean;
}

const notificationSchema = new Schema<INotification>({
  message: { type: String, require: true },
  destinationId: { type: String, require: true },
  isRead: { type: Boolean, default: false },
});

const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);

export default NotificationModel;
