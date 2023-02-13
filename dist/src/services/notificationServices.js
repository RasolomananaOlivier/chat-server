"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationModel_1 = __importDefault(require("../database/models/NotificationModel"));
const appError_1 = require("../utils/appError");
const getAllByDestinationId = async (destinationId) => {
    if ((0, mongoose_1.isValidObjectId)(destinationId)) {
        const notifications = await NotificationModel_1.default.find({ destinationId });
        return notifications;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidDestinationId",
            message: "DestinationId must be a valid objectId",
        });
    }
};
const create = async (notification) => {
    await NotificationModel_1.default.create(notification);
};
const NotificationServices = {
    getAllByDestinationId,
    create,
};
exports.default = NotificationServices;
