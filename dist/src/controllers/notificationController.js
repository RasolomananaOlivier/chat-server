"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationServices_1 = __importDefault(require("../services/notificationServices"));
const appError_1 = require("../utils/appError");
const getAll = async (req, res) => {
    const userId = req.params.userId;
    try {
        const notifications = await notificationServices_1.default.getAllByDestinationId(userId);
        res.json(notifications);
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
    }
};
const markAsRead = async (req, res) => {
    const notificationId = req.params.notificationId;
    try {
        const notifications = await notificationServices_1.default.markAsRead(notificationId);
        res.json(notifications);
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
    }
};
const markAllAsRead = async (req, res) => {
    const destinationId = req.query.destinationId;
    try {
        const notifications = await notificationServices_1.default.markAllAsRead(destinationId);
        res.json(notifications);
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
    }
};
const NotificationController = {
    getAll,
    markAsRead,
    markAllAsRead,
};
exports.default = NotificationController;
