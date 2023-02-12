"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageServices_1 = __importDefault(require("../../services/messageServices"));
const joinMessageRoom = async (socket, next) => {
    const userId = socket.handshake.headers.id;
    if (userId && (0, mongoose_1.isValidObjectId)(userId)) {
        const messages = await messageServices_1.default.findMessagesByUserId(userId);
        messages.forEach((message) => socket.join(message.messageId));
    }
    return next();
};
exports.default = joinMessageRoom;
