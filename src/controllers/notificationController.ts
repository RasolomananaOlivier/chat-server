import { Request, Response } from "express";
import NotificationServices from "../services/notificationServices";
import { AppError } from "../utils/appError";

const getAll = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  console.log(userId);

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

const NotificationController = {
  getAll,
};

export default NotificationController;
