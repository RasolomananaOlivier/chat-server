import express from "express";
import MessageControllers from "../../controllers/messageControllers";
const MessageRoutes = express.Router();

MessageRoutes.get("/", MessageControllers.getAllMessages);

MessageRoutes.get("/:messageId/:userId", MessageControllers.getOneMessage);

MessageRoutes.get(
  "/:messageId?q=lastmessage",
  MessageControllers.getOneMessage
);

export default MessageRoutes;
