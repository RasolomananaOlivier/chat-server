"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor({ name, message, status }) {
        super(message);
        this.name = name;
        this.status = status;
    }
}
exports.AppError = AppError;
