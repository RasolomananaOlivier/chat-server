"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    message: { type: String, require: true },
    destinationId: { type: String, require: true },
    isRead: { type: Boolean, default: false },
});
const NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema);
exports.default = NotificationModel;
