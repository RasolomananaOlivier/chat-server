"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const mongoose_1 = require("mongoose");
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const appError_1 = require("../utils/appError");
const RequestServices_1 = __importDefault(require("./RequestServices"));
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
    if ((0, mongoose_1.isValidObjectId)(userId)) {
        const foundUser = await UserModel_1.default.findById(userId);
        if (!foundUser) {
            throw new appError_1.AppError({
                name: "UserNotFound",
                message: `User with id ${userId} not found`,
                status: 404,
            });
        }
        return foundUser;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidUserId",
            message: `Failed to cast userId ${userId}`,
        });
    }
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
    if ((0, mongoose_1.isValidObjectId)(userId)) {
        const userEmailUpdated = await UserModel_1.default.findOneAndUpdate({ _id: userId }, {
            "email.address": email,
        }, options);
        if (!userEmailUpdated) {
            throw new appError_1.AppError({
                name: "UserNorFound",
                message: `User with id ${userId} not found`,
                status: 404,
            });
        }
        return userEmailUpdated;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidUserId",
            message: "UserId must be in objectId type",
        });
    }
};
const addFriend = async (userId, newFriendId) => {
    var _a, _b;
    if ((0, mongoose_1.isValidObjectId)(userId) && (0, mongoose_1.isValidObjectId)(newFriendId)) {
        const user = await UserModel_1.default.findById(userId);
        const connected = (_a = user === null || user === void 0 ? void 0 : user.friends) === null || _a === void 0 ? void 0 : _a.some((id) => id === newFriendId);
        if (!connected) {
            (_b = user === null || user === void 0 ? void 0 : user.friends) === null || _b === void 0 ? void 0 : _b.push(newFriendId);
            return await (user === null || user === void 0 ? void 0 : user.save());
        }
        else {
            console.log("Users already connected");
        }
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidUserId",
            message: "UserId or newFriendId must be in objectId type",
        });
    }
};
const deleteAllUsers = async () => {
    await UserModel_1.default.deleteMany({});
};
const getSuggestions = async (userId) => {
    if ((0, mongoose_1.isValidObjectId)(userId)) {
        const users = await UserModel_1.default.find().where("_id").ne(userId);
        const filterUsers = users.filter((user) => {
            const userFriends = user.friends;
            if (userFriends) {
                if (userFriends.length > 0) {
                    if (userFriends.some((id) => id !== userId)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
        });
        const arrayPromise = filterUsers.map((user) => RequestServices_1.default.isRequestExist(userId, user._id));
        const isRequestsCreated = await Promise.all(arrayPromise);
        const suggestions = filterUsers.filter((user, index) => !isRequestsCreated[index]);
        return suggestions;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidUserId",
            message: "UserId must be in objectId type",
        });
    }
};
exports.UserServices = {
    register,
    findUserById,
    updatePersonalInformation,
    updateEmail,
    deleteAllUsers,
    addFriend,
    getSuggestions,
};
