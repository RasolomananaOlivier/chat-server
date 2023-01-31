"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const appError_1 = require("../utils/appError");
const register = async (userData) => {
    const foundUser = await UserModel_1.default.findOne({
        "email.address": userData.email.address,
    });
    if (foundUser !== null) {
        throw new appError_1.AppError({
            name: "Registration error",
            message: "User with the same email already exist",
            status: 404,
        });
    }
    const user = new UserModel_1.default(userData);
    return await user.save();
};
const findUserById = async (userId) => {
    const foundUser = await UserModel_1.default.findById(userId);
    if (!foundUser) {
        throw new appError_1.AppError({
            name: "find one user by id",
            message: `User with id ${userId} not found`,
            status: 404,
        });
    }
    return foundUser;
};
const updatePersonalInformation = async (update) => {
    const options = { useFindAndModify: false, new: true };
    const updatedUser = await UserModel_1.default.findOneAndUpdate({ _id: update.userId }, {
        firstname: update.firstname,
        lastname: update.lastname,
    }, options);
    if (!updatedUser) {
        throw new appError_1.AppError({
            name: "update user personnal information",
            message: `User with id ${update.userId} not found`,
            status: 404,
        });
    }
    return updatedUser;
};
const updateEmail = async ({ userId, email, }) => {
    const options = { useFindAndModify: false, new: true };
    const userEmailUpdated = await UserModel_1.default.findOneAndUpdate({ _id: userId }, {
        "email.address": email,
    }, options);
    if (!userEmailUpdated) {
        throw new appError_1.AppError({
            name: "update user email",
            message: `User with id ${userId} not found`,
            status: 404,
        });
    }
    return userEmailUpdated;
};
const relation = async ({ userId, friendId, type }) => {
    var _a, _b, _c, _d, _e, _f;
    const user = await UserModel_1.default.findById(userId);
    const friend = await UserModel_1.default.findById(friendId);
    if (!user || !friend) {
        throw new appError_1.AppError({
            name: "Add new friend error",
            message: `User ${userId} or ${friendId} does not exist`,
            status: 404,
        });
    }
    const isConnected = ((_a = user.friends) === null || _a === void 0 ? void 0 : _a.some((id) => id === friendId)) ||
        ((_b = friend.friends) === null || _b === void 0 ? void 0 : _b.some((id) => id === userId));
    if (type === "add") {
        if (isConnected) {
            throw new appError_1.AppError({
                name: "Add new friend error",
                message: `User ${userId} and ${friendId} are already connected`,
                status: 400,
            });
        }
        (_c = user.friends) === null || _c === void 0 ? void 0 : _c.push(friendId);
        (_d = friend.friends) === null || _d === void 0 ? void 0 : _d.push(userId);
        return { user: await user.save(), friend: await friend.save() };
    }
    else {
        if (!isConnected) {
            throw new appError_1.AppError({
                name: "Remove friend error",
                message: `User ${userId} and ${friendId} are already disconnected`,
                status: 400,
            });
        }
        user.friends = (_e = user.friends) === null || _e === void 0 ? void 0 : _e.filter((id) => id !== friendId);
        friend.friends = (_f = friend.friends) === null || _f === void 0 ? void 0 : _f.filter((id) => id !== userId);
        return { user: await user.save(), friend: await friend.save() };
    }
};
const deleteAllUsers = async () => {
    await UserModel_1.default.deleteMany({});
};
exports.UserServices = {
    register,
    findUserById,
    updatePersonalInformation,
    updateEmail,
    relation,
    deleteAllUsers,
};
