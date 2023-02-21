import express from "express";
import MessageControllers from "../../controllers/messageControllers";
const MessageRoutes = express.Router();

MessageRoutes.get("/", MessageControllers.getAllMessages);

MessageRoutes.get("/:messageId/:userId", MessageControllers.getOneMessage);

MessageRoutes.get("/:messageId", MessageControllers.getLastMessage);

export default MessageRoutes;
