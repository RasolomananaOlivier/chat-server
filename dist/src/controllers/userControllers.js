"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const userRegistrationNormalizer_1 = require("../utils/normalizes/userRegistrationNormalizer");
const createToken_1 = require("../utils/createToken");
const userServices_1 = require("../services/userServices");
const getAllUsers = async (req, res) => {
    res.send({ data: await UserModel_1.default.find() });
};
const getOneUser = (req, res) => {
    res.json({ message: "getoneuser called" });
};
const createOneUser = async (req, res) => {
    try {
        const userSaved = await userServices_1.UserServices.register((0, userRegistrationNormalizer_1.userRegistrationNormalizer)(req));
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
        res.status(400).json({ status: 400, error: error.message });
    }
};
const updateOneUser = (req, res) => {
    res.json({ message: "getoneuser called" });
};
const deleteOneUser = (req, res) => {
    return;
};
const UserControllers = {
    getAllUsers,
    getOneUser,
    createOneUser,
    updateOneUser,
    deleteOneUser,
};
exports.default = UserControllers;
