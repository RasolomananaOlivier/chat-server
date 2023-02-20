"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationServices_1 = __importDefault(require("../services/notificationServices"));
const userServices_1 = require("../services/userServices");
const push = async (io, originId, destinationId) => {
    const { firstname, lastname } = await userServices_1.UserServices.findUserById(destinationId);
    const userDestinationName = `${firstname} ${lastname}`;
    const data = {
        message: `${userDestinationName} accepted your request`,
        destinationId: originId,
        isRead: false,
    };
    await notificationServices_1.default.create(data);
    const notifications = await notificationServices_1.default.getAllByDestinationId(originId);
    io.to(originId).emit("notification:listen", notifications);
};
const NotificationEvents = {
    handle: {},
    emit: { push },
};
exports.default = NotificationEvents;
