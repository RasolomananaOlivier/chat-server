"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newRequest = void 0;
const app_1 = require("../app");
const newRequest = (userId, request) => {
    app_1.serverSocket.emit(`request:new:${userId}`, request);
    console.log("after");
};
exports.newRequest = newRequest;
const EmitEvent = { newRequest: exports.newRequest };
exports.default = EmitEvent;
