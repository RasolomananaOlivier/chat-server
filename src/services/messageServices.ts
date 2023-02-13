import { isValidObjectId } from "mongoose";
import { log } from "node:console";
import MessageModel, {
  IMessage,
  IMessageItem,
} from "../database/models/MessageModel";
import { AppError } from "../utils/appError";

const findMessagesByUserId = async (userId: string): Promise<IMessage[]> => {
  const messages = await MessageModel.find({});

  const filtered = messages.filter((message) =>
    message.authorizedUser.some((id) => id === userId)
  );

  return filtered.map((message) => ({
    _id: message._id,
    authorizedUser: message.authorizedUser,
    messages: [],
    readBy: message.readBy,
  }));
};

// Find the message and update the readBy property
const findById = async (messageId: string, userId: string) => {
  if (isValidObjectId(messageId)) {
    const message = await MessageModel.findById(messageId);

    if (message === null) {
      throw new AppError({
        status: 404,
        name: "MessageNotFound",
        message: `The message with ${messageId} was not found`,
      });
    } else {
      if (message.readBy.length === 0) {
        message.readBy = [userId];
      } else {
        message.readBy = [...new Set([...message.readBy, userId])];
      }

      return await message.save();
    }
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidMessageId",
      message: "The messageId is not a valid",
    });
  }
};

const createOne = async (usersId: string[]) => {
  if (usersId.length === 2) {
    try {
      const message = new MessageModel({
        authorizedUser: usersId,
        messages: [],
        readBy: [],
      });

      return await message.save();
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("UsersId length diffent of 1");
  }
};

export interface IMessagePayload {
  messageId: string;
  messageItem: IMessageItem;
}
const addNewMessageItem = async ({
  messageId,
  messageItem,
}: IMessagePayload) => {
  if (isValidObjectId(messageId)) {
    const message = await MessageModel.findById(messageId);

    if (message === null) {
      console.log("Message not found");
    } else {
      message.messages.push(messageItem);
      message.readBy = [messageItem.auth];

      return await message.save();
    }
  } else {
    console.log("InvalidMessageId");
  }
};

const MessageServices = {
  findMessagesByUserId,
  findById,
  createOne,
  addNewMessageItem,
};

export default MessageServices;
