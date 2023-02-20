import { Router } from "express";
import NotificationController from "../../controllers/notificationController";

const NotificationRoutes = Router();

NotificationRoutes.get("/:userId", NotificationController.getAll);

NotificationRoutes.put("/", NotificationController.markAllAsRead);

NotificationRoutes.put("/:notificationId", NotificationController.markAsRead);

export default NotificationRoutes;
