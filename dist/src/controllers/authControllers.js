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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userServices_1 = require("../services/userServices");
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
            error.response(res);
    }
};
const authenticate = (req, res) => {
    if (req.headers["x-access-token"]) {
        const token = req.headers["x-access-token"].toString().split(" ")[1];
        console.log("====================================");
        console.log(token);
        console.log("====================================");
        jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, async (err, jwtPayload) => {
            if (err) {
                res.status(400).json({
                    status: 401,
                    name: err.name,
                    message: err.message,
                });
            }
            else {
                const payload = jwtPayload;
                const user = await userServices_1.UserServices.findUserById(payload.userId);
                res.json(user);
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
exports.AuthControllers = { login, authenticate };
