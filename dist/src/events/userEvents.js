"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils"));
const update = (io, user) => {
    io.to(utils_1.default.stringify(user._id)).emit("user:update", user);
};
const UserEvents = {
    handle: {},
    emit: { update },
};
exports.default = UserEvents;
