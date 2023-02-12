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
UserRoutes.get("/:userId", authenticate_1.authenticate, async (req, res) => {
    if (req.query.q === "friends") {
        await userControllers_1.default.getUserFriends(req, res);
    }
    else {
        await userControllers_1.default.getOneUser(req, res);
    }
});
UserRoutes.post("/", (0, validateRegistration_1.userRegistrationRules)(), validateRegistration_1.validateRegistration, userControllers_1.default.createOneUser);
UserRoutes.put("/:userId", async (req, res) => {
    if (Object.keys(req.query).length === 0) {
        await userControllers_1.default.updateInformation(req, res);
    }
    else {
        if (req.query.email) {
            switch (req.query.email) {
                case "update":
                    userControllers_1.default.updateEmail(req, res);
                    break;
                case "validate":
                    break;
                default:
                    break;
            }
        }
        else if (req.query.friend) {
            switch (req.query.friend) {
                case "add":
                    break;
                case "remove":
                    break;
                default:
                    break;
            }
        }
    }
});
UserRoutes.delete("/", userControllers_1.default.deleteUsers);
UserRoutes.delete("/:userId", userControllers_1.default.deleteOneUser);
exports.default = UserRoutes;
