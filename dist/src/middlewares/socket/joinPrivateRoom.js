"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joinPrivateRoom = async (socket, next) => {
    const userId = socket.handshake.headers.id;
    if (userId) {
        socket.join(userId);
    }
    return next();
};
exports.default = joinPrivateRoom;
