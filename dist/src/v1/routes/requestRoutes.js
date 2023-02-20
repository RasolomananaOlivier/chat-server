"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestControllers_1 = __importDefault(require("../../controllers/requestControllers"));
const RequestRoutes = express_1.default.Router();
RequestRoutes.get("/", requestControllers_1.default.getRequests);
RequestRoutes.get("/:userId", requestControllers_1.default.getAllRequests);
exports.default = RequestRoutes;
