const express = require("express");
const MessageControllers = require("../../controllers/messageControllers");
const MessageRoutes = express.Router();

MessageRoutes.get("/", MessageControllers.getAllMessages);

MessageRoutes.get("/:messageId", MessageControllers.getOneMessage);

MessageRoutes.put("/:messageId", MessageControllers.updateOneMessage);

MessageRoutes.delete("/:messageId", MessageControllers.deleteOneMessage);

module.exports = MessageRoutes;
