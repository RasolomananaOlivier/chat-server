"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RequestModel_1 = __importDefault(require("../database/models/RequestModel"));
const RequestServices_1 = __importDefault(require("../services/RequestServices"));
const appError_1 = require("../utils/appError");
const getRequests = async (req, res) => {
    try {
        const requests = await RequestModel_1.default.find({});
        res.json(requests);
    }
    catch (error) {
        if (error instanceof appError_1.AppError)
            error.response(res);
    }
};
const getAllRequests = async (req, res) => {
    try {
        const requests = await RequestServices_1.default.findAllByDestinationId(req.params.userId);
        res.json(requests);
    }
    catch (error) {
        if (error instanceof appError_1.AppError)
            error.response(res);
    }
};
const RequestController = { getAllRequests, getRequests };
exports.default = RequestController;
