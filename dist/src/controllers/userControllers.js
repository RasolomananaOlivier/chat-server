"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const createToken_1 = require("../utils/createToken");
const userServices_1 = require("../services/userServices");
const appError_1 = require("../utils/appError");
const userFormater_1 = require("../utils/formaters/userFormater");
const getAllUsers = async (req, res) => {
    res.status(200).send({ data: await UserModel_1.default.find() });
};
const getOneUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userServices_1.UserServices.findUserById(userId);
        res.json(user);
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
    }
};
const getUserFriends = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userServices_1.UserServices.findUserById(userId);
        let friends = [];
        if (user.friends) {
            for (const friendId of user.friends) {
                const friend = await userServices_1.UserServices.findUserById(friendId);
                friends.push(friend);
            }
        }
        res.json(friends);
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
    }
};
const createOneUser = async (req, res) => {
    try {
        console.log(req.body);
        const userSaved = await userServices_1.UserServices.register(userFormater_1.UserFormater.beforeRegistration(req));
        const token = (0, createToken_1.createToken)({
            userId: userSaved._id,
            firstname: userSaved.firstname,
            lastname: userSaved.lastname,
        });
        res.status(201).json({
            data: userSaved,
            token: `bearer ${token}`,
        });
    }
    catch (error) {
        if (error instanceof appError_1.AppError)
            res.status(400).json({ status: 400, error: error.message });
    }
};
const updateInformation = async (req, res) => {
    try {
        const updatedUser = await userServices_1.UserServices.updatePersonalInformation(userFormater_1.UserFormater.beforeUpdate(req));
        res.json(updatedUser);
    }
    catch (error) {
        if (error instanceof appError_1.AppError)
            error.response(res);
    }
};
const updateEmail = async (req, res) => {
    try {
        const userEmailUpdated = await userServices_1.UserServices.updateEmail(userFormater_1.UserFormater.beforeEmailUpdate(req));
        res.json({ status: 200, data: userEmailUpdated });
    }
    catch (error) {
        if (error instanceof appError_1.AppError)
            error.response(res);
    }
};
const deleteOneUser = async (req, res) => { };
const deleteUsers = async (req, res) => {
    try {
        await userServices_1.UserServices.deleteAllUsers();
        res.json({ status: 200, message: "All users deleted" });
    }
    catch (error) {
        console.log(error);
    }
};
const getSuggestions = async (req, res) => {
    const userId = req.params.userId;
    try {
        const suggestions = await userServices_1.UserServices.getSuggestions(userId);
        res.json({ suggestions });
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
    }
};
const isEmailExist = async (req, res) => {
    const email = req.body.email;
    try {
        await userServices_1.UserServices.isEmailExist(email);
        res.json();
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
    }
};
const UserControllers = {
    getAllUsers,
    getOneUser,
    getUserFriends,
    createOneUser,
    deleteOneUser,
    deleteUsers,
    updateInformation,
    updateEmail,
    getSuggestions,
};
exports.default = UserControllers;
