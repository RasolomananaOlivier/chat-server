"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    if (req.headers["x-access-token"]) {
        const token = req.headers["x-access-token"].toString().split(" ")[1];
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, payload) => {
            if (err) {
                res.status(400).json({
                    status: 401,
                    name: err.name,
                    message: err.message,
                });
            }
            else {
                next();
            }
        });
    }
    else {
        res.status(400).json({
            name: "x-access-token-error",
            message: "x-access-token must be provided",
        });
    }
};
exports.authenticate = authenticate;
