"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitNewRequest = void 0;
const app_1 = require("../../app");
const emitNewRequest = (userId, request) => {
    app_1.serverSocket.emit(`request:new:${userId}`, request);
};
exports.emitNewRequest = emitNewRequest;
