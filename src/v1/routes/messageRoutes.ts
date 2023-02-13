import express from "express";
import MessageControllers from "../../controllers/messageControllers";
const MessageRoutes = express.Router();

MessageRoutes.get("/", MessageControllers.getAllMessages);

MessageRoutes.get("/:messageId/:userId", MessageControllers.getOneMessage);

// MessageRoutes.put("/:messageId", MessageControllers.updateOneMessage);

// MessageRoutes.delete("/:messageId", MessageControllers.deleteOneMessage);

export default MessageRoutes;
