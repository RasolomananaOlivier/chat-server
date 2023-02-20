import { model, Schema } from "mongoose";

export interface IMessageItem {
  auth: string;
  type: "text" | "image" | "video";
  content: string;
  timeStamp: Date;
  authorizedUser: string[];
  imageUrl?: string;
}

export interface IMessage {
  _id?: string;
  authorizedUser: string[];
  messages: IMessageItem[];
  readBy: string[];
}

const MessageSchema = new Schema<IMessage>({
  authorizedUser: [String],
  messages: [
    {
      auth: { type: String, require: true },
      type: { type: String, require: true },
      content: { type: String, require: true },
      timeStamp: Date,
      authorizedUser: [String],
      imageUrl: { type: String, require: false },
    },
  ],
  readBy: [String],
});

const MessageModel = model<IMessage>("Message", MessageSchema);

export default MessageModel;
