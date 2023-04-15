import { isValidObjectId } from "mongoose";
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
const findById = async (messageId: string, userId: string, page = 1) => {
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

      const savedMessage = await message.save();

      return {
        totalMessages: savedMessage.messages.length,
        message: {
          _id: savedMessage._id,
          authorizedUser: savedMessage.authorizedUser,
          readBy: savedMessage.readBy,
          // Pagenate the message items from 0 to page * 10.
          // ex : page = 2 => messages = [msg1, msg2, ..., msg10]
          messages: savedMessage.messages.slice(-page * 15),
        },
      };
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

const getLastMessage = async (messageId: string) => {
  if (isValidObjectId(messageId)) {
    const message = await MessageModel.findById(messageId);
    if (message !== null) {
      const lastMessage = message.messages[message.messages.length - 1];

      return lastMessage;
    } else {
      console.log("message not found");
    }
  } else {
    console.log("InvalidMessageId");
  }
};

const findByIdAndByType = async (
  messageId: string,
  userId: string,
  type = "text"
) => {
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

      const savedMessage = await message.save();

      const filterOption = (type: string) => {
        if (type === "text") {
          return ["text"];
        } else if (type === "media") {
          return ["image", ["video"]];
        } else {
          return ["file"];
        }
      };
      const filteredMessage = savedMessage.messages.filter((message) =>
        filterOption(type).includes(message.type)
      );

      return {
        message: {
          _id: savedMessage._id,
          authorizedUser: savedMessage.authorizedUser,
          readBy: savedMessage.readBy,
          messages: filteredMessage,
        },
      };
    }
  } else {
    throw new AppError({
      status: 400,
      name: "InvalidMessageId",
      message: "The messageId is not a valid",
    });
  }
};

const MessageServices = {
  findMessagesByUserId,
  findById,
  createOne,
  addNewMessageItem,
  getLastMessage,
  findByIdAndByType,
};

export default MessageServices;
