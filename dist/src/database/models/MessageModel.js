"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    authorizedUser: [String],
    messages: [
        {
            auth: { type: String, require: true },
            type: { type: String, require: true },
            content: { type: String, require: true },
            timeStamp: Date,
            authorizedUser: [String],
            imageUrl: { type: String, require: false },
        },
    ],
    readBy: [String],
});
const MessageModel = (0, mongoose_1.model)("Message", MessageSchema);
exports.default = MessageModel;
