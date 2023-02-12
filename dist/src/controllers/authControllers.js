"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const authServices_1 = __importDefault(require("../services/authServices"));
const appError_1 = require("../utils/appError");
const createToken_1 = require("../utils/createToken");
const userFormater_1 = require("../utils/formaters/userFormater");
const login = async (req, res) => {
    try {
        const user = await authServices_1.default.login(userFormater_1.UserFormater.beforeLogin(req));
        const token = (0, createToken_1.createToken)({
            userId: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
        });
        res.json({
            data: user,
            token: `bearer ${token}`,
        });
    }
    catch (error) {
        if (error instanceof appError_1.AppError)
            res.status(400).json({
                status: 400,
                error: error.message,
            });
    }
};
exports.AuthControllers = { login };
