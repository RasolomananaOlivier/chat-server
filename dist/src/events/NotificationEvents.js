"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userServices_1 = require("../services/userServices");
const push = async (io, originId, destinationId) => {
    const { firstname, lastname } = await userServices_1.UserServices.findUserById(destinationId);
    const userDestinationName = `${firstname} ${lastname}`;
    const data = {
        message: `${userDestinationName} accepted your request`,
        destinationId,
    };
    io.to(originId).emit("notification", data);
};
const NotificationEvents = {
    handle: {},
    emit: { push },
};
exports.default = NotificationEvents;
