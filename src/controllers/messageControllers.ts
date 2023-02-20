import { Request, Response } from "express";
import MessageServices from "../services/messageServices";
import { AppError } from "../utils/appError";

const getAllMessages = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;

  if (userId) {
    const messages = await MessageServices.findMessagesByUserId(userId);

    res.json(messages);
  } else {
    res.json({ status: 400, message: "UserId not provided" });
  }
};

const getOneMessage = async (req: Request, res: Response) => {
  const messageId = req.params.messageId,
    userId = req.params.userId;
  const page = +req.query.page!;

  try {
    const result = await MessageServices.findById(messageId, userId, page);

    res.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
    }
  }
};

const getLastMessage = async (req: Request, res: Response) => {
  const messageId = req.params.messageId;

  try {
    const lastMessage = await MessageServices.getLastMessage(messageId);

    res.json(lastMessage);
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
    }
  }
};

const MessageControllers = {
  getAllMessages,
  getOneMessage,
  getLastMessage,
};

export default MessageControllers;
