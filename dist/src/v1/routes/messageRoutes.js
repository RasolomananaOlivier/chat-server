"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const messageControllers_1 = __importDefault(require("../../controllers/messageControllers"));
const MessageRoutes = express_1.default.Router();
MessageRoutes.get("/", messageControllers_1.default.getAllMessages);
MessageRoutes.get("/:messageId/:userId", messageControllers_1.default.getOneMessage);
exports.default = MessageRoutes;
