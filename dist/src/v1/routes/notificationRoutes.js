"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = __importDefault(require("../../controllers/notificationController"));
const NotificationRoutes = (0, express_1.Router)();
NotificationRoutes.get("/:userId", notificationController_1.default.getAll);
NotificationRoutes.put("/", notificationController_1.default.markAllAsRead);
NotificationRoutes.put("/:notificationId", notificationController_1.default.markAsRead);
exports.default = NotificationRoutes;
