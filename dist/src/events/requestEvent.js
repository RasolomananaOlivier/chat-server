"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageServices_1 = __importDefault(require("../services/messageServices"));
const RequestServices_1 = __importDefault(require("../services/RequestServices"));
const userServices_1 = require("../services/userServices");
const utils_1 = __importDefault(require("../utils"));
const NotificationEvents_1 = __importDefault(require("./NotificationEvents"));
const userEvents_1 = __importDefault(require("./userEvents"));
const creation = (io, socket) => {
    socket.on("request:new", async ({ destinationId, originId }) => {
        await RequestServices_1.default.create({
            destinationId,
            originId,
        });
        socket.emit("request:sent", await RequestServices_1.default.findAllByOriginId(originId));
        io.to(destinationId).emit("request:listen", await RequestServices_1.default.findAllByDestinationId(destinationId));
    });
};
const accept = (io, socket) => {
    socket.on("request:accept", async (requestId) => {
        const request = await RequestServices_1.default.findOne(requestId);
        let destinationUpdated, originUpdated;
        if (request) {
            if (request.destinationId && request.originId) {
                destinationUpdated = await userServices_1.UserServices.addFriend(request === null || request === void 0 ? void 0 : request.destinationId, request === null || request === void 0 ? void 0 : request.originId);
                originUpdated = await userServices_1.UserServices.addFriend(request === null || request === void 0 ? void 0 : request.originId, request === null || request === void 0 ? void 0 : request.destinationId);
            }
        }
        if (destinationUpdated && originUpdated) {
            userEvents_1.default.emit.update(io, destinationUpdated);
            userEvents_1.default.emit.update(io, originUpdated);
            NotificationEvents_1.default.emit.push(io, utils_1.default.stringify(originUpdated._id), utils_1.default.stringify(destinationUpdated._id));
            await messageServices_1.default.createOne([
                destinationUpdated._id,
                originUpdated._id,
            ]);
            await RequestServices_1.default.deleteOne(requestId);
        }
    });
};
const refuse = (io, socket) => {
    socket.on("request:refuse", async (requestId) => {
        const request = await RequestServices_1.default.findOne(requestId);
        if (request !== null) {
            const destinationId = request.destinationId;
            const originId = request.originId;
            await RequestServices_1.default.deleteOne(requestId);
            io.to(destinationId).emit("request:listen", await RequestServices_1.default.findAllByDestinationId(destinationId));
            io.to(originId).emit("request:listen", await RequestServices_1.default.findAllByOriginId(originId));
        }
    });
};
const RequestEvents = {
    handle: { creation, accept, refuse },
};
exports.default = RequestEvents;
