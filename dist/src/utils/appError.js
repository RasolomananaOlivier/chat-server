"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    constructor({ name, message, status }) {
        super(message);
        this.name = name;
        this.status = status;
    }
    response(res) {
        res.status(this.status).json({
            status: this.status,
            name: this.name,
            error: this.message,
        });
    }
}
exports.AppError = AppError;
