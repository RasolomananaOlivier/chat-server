"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const appError_1 = require("../utils/appError");
const login = async (arg) => {
    const foundUser = await UserModel_1.default.findOne({ "email.address": arg.email });
    if (!foundUser) {
        throw new appError_1.AppError({
            status: 404,
            name: "EmailNotFound",
            message: `User with email ${arg.email} does not exist`,
        });
    }
    const isCorrect = await bcrypt_1.default.compare(arg.password, foundUser.password);
    if (isCorrect) {
        return foundUser;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "IncorrectPassword",
            message: `Incorrect Password provided`,
        });
    }
};
exports.login = login;
const AuthServices = { login: exports.login };
exports.default = AuthServices;
