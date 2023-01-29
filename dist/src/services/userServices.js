"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const register = async (userData) => {
    const foundUser = await UserModel_1.default.findOne({ email: userData.email });
    if (foundUser) {
        throw new Error("User with the same email already exist");
    }
    const user = new UserModel_1.default(userData);
    return await user.save();
};
exports.UserServices = { register };
