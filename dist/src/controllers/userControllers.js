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
    res.send({ data: await UserModel_1.default.find() });
};
const getOneUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userServices_1.UserServices.findUserById(userId);
        res.json({ data: user });
    }
    catch (error) {
        if (error instanceof appError_1.AppError) {
            error.response(res);
        }
        else {
            res.status(500).json({ message: "Unexpected error", error });
        }
    }
};
const createOneUser = async (req, res) => {
    try {
        const userSaved = await userServices_1.UserServices.register(userFormater_1.UserFormater.beforeRegistration(req));
        const token = (0, createToken_1.createToken)({
            userId: userSaved._id,
            firstname: userSaved.firstname,
            lastname: userSaved.lastname,
        });
        res.json({
            data: userSaved,
            token: `bearer ${token}`,
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof appError_1.AppError)
            res.status(400).json({ status: 400, error: error.message });
    }
};
const updateOneUser = async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        try {
            const updatedUser = await userServices_1.UserServices.updatePersonalInformation(userFormater_1.UserFormater.beforeUpdate(req));
            res.json({ status: 200, data: updatedUser });
        }
        catch (error) {
            if (error instanceof appError_1.AppError)
                error.response(res);
        }
    }
    else {
        if (req.query.email === "update") {
            try {
                const userEmailUpdated = await userServices_1.UserServices.updateEmail(userFormater_1.UserFormater.beforeEmailUpdate(req));
                res.json({ status: 200, data: userEmailUpdated });
            }
            catch (error) {
                console.log(error);
                if (error instanceof appError_1.AppError)
                    error.response(res);
            }
        }
        else if (req.query.email === "validate") {
        }
        else if (req.query.friend === "add" || req.query.friend === "remove") {
            try {
                const { user, friend } = await userServices_1.UserServices.relation({
                    ...userFormater_1.UserFormater.beforeHandlingRelation(req),
                    type: req.query.friend,
                });
                res.json({ status: 200, data: { user, friend } });
            }
            catch (error) {
                console.log(error);
                if (error instanceof appError_1.AppError) {
                    error.response(res);
                }
            }
        }
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
const UserControllers = {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser,
    deleteUsers,
};
exports.default = UserControllers;
