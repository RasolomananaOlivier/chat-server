"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControllers_1 = __importDefault(require("../../controllers/userControllers"));
const validateRegistration_1 = require("../../middlewares/validateRegistration");
const authenticate_1 = require("../../middlewares/authenticate");
const UserRoutes = express_1.default.Router();
UserRoutes.get("/", userControllers_1.default.getAllUsers);
UserRoutes.get("/:userId", authenticate_1.authenticate, userControllers_1.default.getOneUser);
UserRoutes.post("/", (0, validateRegistration_1.userRegistrationRules)(), validateRegistration_1.validateRegistration, userControllers_1.default.createOneUser);
UserRoutes.put("/:userId", userControllers_1.default.updateOneUser);
UserRoutes.delete("/", userControllers_1.default.deleteUsers);
UserRoutes.delete("/:userId", userControllers_1.default.deleteOneUser);
exports.default = UserRoutes;
