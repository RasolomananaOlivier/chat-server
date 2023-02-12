"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageServices_1 = __importDefault(require("../services/messageServices"));
const utils_1 = __importDefault(require("../utils"));
const push = (io, socket) => {
    socket.on("message:push", async (messagePayload) => {
        const message = await messageServices_1.default.addNewMessageItem(messagePayload);
        if (message) {
            io.to(utils_1.default.stringify(message._id)).emit("message:update", message);
        }
    });
};
const MessageEvents = {
    handle: { push },
};
exports.default = MessageEvents;
