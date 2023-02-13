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
        readBy: message.readBy,
    }));
};
const findById = async (messageId, userId) => {
    if ((0, mongoose_1.isValidObjectId)(messageId)) {
        const message = await MessageModel_1.default.findById(messageId);
        if (message === null) {
            throw new appError_1.AppError({
                status: 404,
                name: "MessageNotFound",
                message: `The message with ${messageId} was not found`,
            });
        }
        else {
            if (message.readBy.length === 0) {
                message.readBy = [userId];
            }
            else {
                message.readBy = [...new Set([...message.readBy, userId])];
            }
            return await message.save();
        }
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
                readBy: [],
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
            message.readBy = [messageItem.auth];
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
