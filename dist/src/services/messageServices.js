"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageModel_1 = __importDefault(require("../database/models/MessageModel"));
const appError_1 = require("../utils/appError");
const findMessagesByUserId = async (userId) => {
    const messages = await MessageModel_1.default.find({});
    const filtered = messages.filter((message) => message.authorizedUser.some((id) => id === userId));
    return filtered.map((message) => ({
        _id: message._id,
        authorizedUser: message.authorizedUser,
        messages: [],
        isRead: false,
    }));
};
const findById = async (messageId) => {
    if ((0, mongoose_1.isValidObjectId)(messageId)) {
        const messages = await MessageModel_1.default.findById(messageId);
        if (messages === null) {
            throw new appError_1.AppError({
                status: 404,
                name: "MessageNotFound",
                message: `The message with ${messageId} was not found`,
            });
        }
        return messages;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidMessageId",
            message: "The messageId is not a valid",
        });
    }
};
const createOne = async (usersId) => {
    if (usersId.length === 2) {
        try {
            const message = new MessageModel_1.default({
                authorizedUser: usersId,
                messages: [],
                isRead: false,
            });
            return await message.save();
        }
        catch (error) {
            console.log(error);
        }
    }
    else {
        console.log("UsersId length diffent of 1");
    }
};
const addNewMessageItem = async ({ messageId, messageItem, }) => {
    if ((0, mongoose_1.isValidObjectId)(messageId)) {
        const message = await MessageModel_1.default.findById(messageId);
        if (message === null) {
            console.log("Message not found");
        }
        else {
            message.messages.push(messageItem);
            return await message.save();
        }
    }
    else {
        console.log("InvalidMessageId");
    }
};
const MessageServices = {
    findMessagesByUserId,
    findById,
    createOne,
    addNewMessageItem,
};
exports.default = MessageServices;
