"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageServices_1 = __importDefault(require("../services/messageServices"));
const appError_1 = require("../utils/appError");
const getAllMessages = async (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const messages = await messageServices_1.default.findMessagesByUserId(userId);
        res.json(messages);
    }
    else {
        res.json({ status: 400, message: "UserId not provided" });
    }
};
const getOneMessage = async (req, res) => {
    const messageId = req.params.messageId;
    try {
        const message = await messageServices_1.default.findById(messageId);
        res.json(message);
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
    }
};
const MessageControllers = {
    getAllMessages,
    getOneMessage,
};
exports.default = MessageControllers;
