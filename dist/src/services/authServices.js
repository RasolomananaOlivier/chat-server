"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const login = async (arg) => {
    const foundUser = await UserModel_1.default.findOne({ email: arg.email });
    if (!foundUser) {
        throw new Error(`User with email ${arg.email} doesn't exist`);
    }
    const isCorrect = await bcrypt_1.default.compare(arg.password, foundUser.password);
    if (isCorrect) {
        return foundUser;
    }
    else {
        throw new Error("User password incorrect");
    }
};
exports.login = login;
const AuthServices = { login: exports.login };
exports.default = AuthServices;
