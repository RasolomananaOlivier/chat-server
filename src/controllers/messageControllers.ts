import { Request, Response } from "express";
import MessageModel from "../database/models/MessageModel";
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
  const messageId = req.params.messageId;

  try {
    const message = await MessageServices.findById(messageId);

    res.json(message);
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
    }
  }
};

// const createOneMessage = (req, res) => {
//   return;
// };

// const updateOneMessage = (req, res) => {
//   return;
// };

// const deleteOneMessage = (req, res) => {
//   return;
// };

const MessageControllers = {
  getAllMessages,
  getOneMessage,
  // createOneMessage,
  // updateOneMessage,
  // deleteOneMessage,
};

export default MessageControllers;
