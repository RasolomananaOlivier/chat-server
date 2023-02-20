import { Request, Response } from "express";
import NotificationServices from "../services/notificationServices";
import { AppError } from "../utils/appError";

const getAll = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const notifications = await NotificationServices.getAllByDestinationId(
      userId
    );

    res.json(notifications);
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
    }
  }
};

const markAsRead = async (req: Request, res: Response) => {
  const notificationId = req.params.notificationId;
  try {
    const notifications = await NotificationServices.markAsRead(notificationId);
    res.json(notifications);
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
    }
  }
};

const markAllAsRead = async (req: Request, res: Response) => {
  const destinationId = req.query.destinationId;
  try {
    const notifications = await NotificationServices.markAllAsRead(
      destinationId as string
    );
    res.json(notifications);
  } catch (error) {
    if (error instanceof AppError) {
      error.response(res);
    }
  }
};

const NotificationController = {
  getAll,
  markAsRead,
  markAllAsRead,
};

export default NotificationController;
