import { Router } from "express";
import NotificationController from "../../controllers/notificationController";

const NotificationRoutes = Router();

NotificationRoutes.get("/:userId", NotificationController.getAll);

export default NotificationRoutes;
