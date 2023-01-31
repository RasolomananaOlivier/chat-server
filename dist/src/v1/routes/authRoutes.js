"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authControllers_1 = require("../../controllers/authControllers");
const validateLogin_1 = require("../../middlewares/validateLogin");
const AuthRoutes = express_1.default.Router();
AuthRoutes.post("/login", (0, validateLogin_1.userLoginRoules)(), validateLogin_1.validateLogin, authControllers_1.AuthControllers.login);
module.exports = AuthRoutes;
