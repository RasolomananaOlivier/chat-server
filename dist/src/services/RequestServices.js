"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const RequestModel_1 = __importDefault(require("../database/models/RequestModel"));
const UserModel_1 = __importDefault(require("../database/models/UserModel"));
const appError_1 = require("../utils/appError");
const userServices_1 = require("./userServices");
const create = async ({ destinationId, originId }) => {
    const destination = await UserModel_1.default.findById(destinationId);
    const origin = await UserModel_1.default.findById(originId);
    if (!destination || !origin) {
        throw new appError_1.AppError({
            name: "Add new friend error",
            message: `User ${destinationId} or ${originId} does not exist`,
            status: 404,
        });
    }
    const existingRequest = await RequestModel_1.default.findOne({
        destinationId,
        originId,
    });
    if (existingRequest === null) {
        const request = new RequestModel_1.default({
            destinationId,
            originId,
            message: `${origin.firstname} ${origin.lastname} want to connect with you`,
        });
        const savedRequest = await request.save();
        return savedRequest;
    }
    else {
        console.log("Request already exists");
    }
};
const findAllByDestinationId = async (userId) => {
    if ((0, mongoose_1.isValidObjectId)(userId)) {
        const result = await RequestModel_1.default.find({ destinationId: userId });
        let requestsList = [];
        for (const request of result) {
            const origin = await userServices_1.UserServices.findUserById(request.originId);
            requestsList.push({
                _id: request._id,
                userId: origin._id,
                email: origin.email.address,
                fullname: origin.getFullname(),
            });
        }
        return requestsList;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidUserId",
            message: "UserId provided is not a valid",
        });
    }
};
const findAllByOriginId = async (userId) => {
    if ((0, mongoose_1.isValidObjectId)(userId)) {
        const result = await RequestModel_1.default.find({ originId: userId });
        return result;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidUserId",
            message: "UserId provided is not a valid",
        });
    }
};
const findOne = async (requestId) => {
    if ((0, mongoose_1.isValidObjectId)(requestId)) {
        const request = await RequestModel_1.default.findById(requestId);
        return request;
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidRequestId",
            message: "RequestId provided is not a valid",
        });
    }
};
const deleteOne = async (requestId) => {
    if ((0, mongoose_1.isValidObjectId)(requestId)) {
        await RequestModel_1.default.deleteOne({ _id: requestId });
    }
    else {
        throw new appError_1.AppError({
            status: 400,
            name: "InvalidRequestId",
            message: "RequestId provided is not a valid",
        });
    }
};
const isRequestExist = async (userId, testId) => {
    const byDestination = await RequestModel_1.default.findOne({
        destinationId: userId,
        originId: testId,
    });
    const byOrigin = await RequestModel_1.default.findOne({
        destinationId: testId,
        originId: userId,
    });
    if (byDestination === null && byOrigin === null) {
        return false;
    }
    else {
        return true;
    }
};
const RequestServices = {
    create,
    findAllByDestinationId,
    findAllByOriginId,
    findOne,
    deleteOne,
    isRequestExist,
};
exports.default = RequestServices;
